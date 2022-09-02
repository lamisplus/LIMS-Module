package org.lamisplus.modules.lims.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.entities.OrganisationUnit;
import org.lamisplus.modules.base.domain.entities.User;
import org.lamisplus.modules.base.service.OrganisationUnitService;
import org.lamisplus.modules.base.service.UserService;
import org.lamisplus.modules.lims.domain.dto.*;
import org.lamisplus.modules.lims.domain.entity.Manifest;
import org.lamisplus.modules.lims.domain.entity.Sample;
import org.lamisplus.modules.lims.domain.mapper.LimsMapper;
import org.lamisplus.modules.lims.repository.ManifestRepository;
import org.lamisplus.modules.lims.repository.SampleRepository;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class ManifestService {
    private final ManifestRepository manifestRepository;
    private final SampleRepository sampleRepository;
    private final LimsMapper limsMapper;
    private final OrganisationUnitService organisationUnitService;
    private  final UserService userService;


    //TODO: move this to config file
    String FacilityDATIMCode = "FH7LMnbnVlT";
    String FacilityMFLCode = "543";
    String LIMSUsername = "nmrs@lims.ng";
    String LIMSPassword = "nmrs@2020!";
    String loginUrl = "https://lims.ng/apidemo/login.php";
    String manifestUrl = "https://lims.ng/apidemo/samples/create.php";
    String resultsUrl = "https://lims.ng/apidemo/samples/result.php";


    public ManifestDTO Save(ManifestDTO manifestDTO){
        Manifest manifest = limsMapper.tomManifest(manifestDTO);

        if(manifest.getId()==0) {
            //TODO: pick the active facility
            Long FacilityId = getCurrentUserOrganization();
            OrganisationUnit organisationUnit = organisationUnitService.getOrganizationUnit(FacilityId);
            String FacilityName = organisationUnit.getName();

            manifest.setManifestID(GenerateManifestID(FacilityMFLCode));
            manifest.setSendingFacilityID(FacilityDATIMCode);
            manifest.setSendingFacilityName(FacilityName);
            manifest.setManifestStatus("Ready");
            manifest.setCreateDate(LocalDateTime.now());
            manifest.setUuid(UUID.randomUUID().toString());

            for(Sample sample: manifest.getSampleInformation()){
                sample.setUuid(UUID.randomUUID().toString());
            }
        }

        return limsMapper.toManifestDto( manifestRepository.save(manifest));
    }

    public ManifestDTO Update(ManifestDTO manifestDTO){
        return Save(manifestDTO);
    }

    public String Delete(Integer id){
        Manifest manifest = manifestRepository.findById(id).orElse(null);
        manifestRepository.delete(manifest);
        return id + " deleted successfully";
    }

    public ManifestDTO findById(Integer id) {
        return limsMapper.toManifestDto(manifestRepository.findById(id).orElse(null));
    }

    public List<ManifestDTO> findAllManifests(){
        List<ManifestDTO> dtos = limsMapper.toManifestDtoList(manifestRepository.findAll());
        return dtos;
    }

    private String GenerateManifestID(String FacilityCode){
        List<ManifestDTO> manifestDTOList = findAllManifests();
        return "LP-"+FacilityCode +"-"+ String.format("%05d", manifestDTOList.size()+1);
    }

    public LIMSManifestResponseDTO PostManifestToServer(int id) {
        RestTemplate restTemplate = GetRestTemplate();
        HttpHeaders headers = GetHTTPHeaders();

        //Login to LIMS
        LIMSLoginResponseDTO loginResponseDTO = LoginToLIMS(restTemplate, headers);

        //Post request
        LIMSManifestResponseDTO response  = PostManifestRequest(restTemplate, headers, loginResponseDTO, id);

        //Update manifest status
        ManifestDTO dto = findById(id);
        dto.setManifestStatus("Submitted");
        Save(dto);

        return response;
    }

    public RestTemplate GetRestTemplate(){
        RestTemplate restTemplate = new RestTemplate();

        //set message converters
        List<HttpMessageConverter<?>> messageConverters = new ArrayList<>();
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setSupportedMediaTypes(Collections.singletonList(MediaType.ALL));
        messageConverters.add(converter);
        restTemplate.setMessageConverters(messageConverters);

        return restTemplate;
    }

    private LIMSLoginResponseDTO LoginToLIMS(RestTemplate restTemplate, HttpHeaders headers){
        LIMSLoginRequestDTO loginRequestDTO = new LIMSLoginRequestDTO();
        loginRequestDTO.setEmail(LIMSUsername);
        loginRequestDTO.setPassword(LIMSPassword);

        HttpEntity<LIMSLoginRequestDTO> loginEntity = new HttpEntity<>(loginRequestDTO, headers);
        ResponseEntity<LIMSLoginResponseDTO> loginResponse = restTemplate.exchange(loginUrl, HttpMethod.POST, loginEntity, LIMSLoginResponseDTO.class);

        return loginResponse.getBody();
    }

    private HttpHeaders GetHTTPHeaders(){
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("user-agent", "Application");
        return headers;
    }

    private LIMSManifestResponseDTO PostManifestRequest(RestTemplate restTemplate, HttpHeaders headers, LIMSLoginResponseDTO loginResponseDTO, int ManifestId){
        LIMSManifestDTO manifest = limsMapper.toLimsManifestDto(findById(ManifestId));
        LIMSManifestRequestDTO requestDTO = new LIMSManifestRequestDTO();
        assert loginResponseDTO != null;
        requestDTO.setToken(loginResponseDTO.getJwt());
        requestDTO.setViralLoadManifest(manifest);

        HttpEntity<LIMSManifestRequestDTO> manifestEntity = new HttpEntity<>(requestDTO, headers);
        ResponseEntity<LIMSManifestResponseDTO> manifestResponse = restTemplate.exchange(resultsUrl, HttpMethod.POST, manifestEntity, LIMSManifestResponseDTO.class);
        return manifestResponse.getBody();
    }

    private LIMSResultsResponseDTO GetResultsRequest(RestTemplate restTemplate, HttpHeaders headers, LIMSLoginResponseDTO loginResponseDTO, int ManifestId){
        LIMSManifestDTO manifest = limsMapper.toLimsManifestDto(findById(ManifestId));
        LIMSResultsRequestDTO requestDTO = new LIMSResultsRequestDTO();

        requestDTO.setToken(loginResponseDTO.getJwt());
        /*
        requestDTO.setManifestID(manifest.getManifestID());
        requestDTO.setReceivingPCRLabID(manifest.getReceivingLabID());
        requestDTO.setReceivingPCRLabName(manifest.getReceivingLabName());
        requestDTO.setTestType("VL");
        requestDTO.setSendingFacilityID(manifest.getSendingFacilityID());
        requestDTO.setSendingFacilityName(manifest.getSendingFacilityName());
         */
        requestDTO.setManifestID("LP-543-00012");
        requestDTO.setReceivingPCRLabID("LIMS250002");
        requestDTO.setReceivingPCRLabName("OAUTHC Testing Lab");
        requestDTO.setTestType("VL");
        requestDTO.setSendingFacilityID("FH7LMnbnVlT");
        requestDTO.setSendingFacilityName("Braithwaite Memorial Specialist Hospital");

        HttpEntity<LIMSResultsRequestDTO> manifestEntity = new HttpEntity<>(requestDTO, headers);
        ResponseEntity<LIMSResultsResponseDTO> manifestResponse = restTemplate.exchange(resultsUrl, HttpMethod.POST, manifestEntity, LIMSResultsResponseDTO.class);
        return manifestResponse.getBody();
    }

    public LIMSResultsResponseDTO DownloadResultsFromLIMS(int id) {
        RestTemplate restTemplate = GetRestTemplate();
        HttpHeaders headers = GetHTTPHeaders();

        //Login to LIMS
        LIMSLoginResponseDTO loginResponseDTO = LoginToLIMS(restTemplate, headers);

        //Get results
        LIMSResultsResponseDTO response  = GetResultsRequest(restTemplate, headers, loginResponseDTO, id);
        LOG.info("RESPONSE:"+response);

        try {
            //Update Lamisplus
            for (LIMSResultDTO result : response.getViralLoadTestReport()) {
                LOG.info("RESULT: " + result);
                sampleRepository.SaveSampleResult(result.getTestResult(), Integer.parseInt(result.getSampleID()));
            }
        }catch (Exception e) {
            LOG.info("ERROR:" + e);
        }

        return response;
    }

    public Long getCurrentUserOrganization() {
        Optional<User> userWithRoles = userService.getUserWithRoles ();
        return userWithRoles.map (User::getCurrentOrganisationUnitId).orElse (null);
    }
}
