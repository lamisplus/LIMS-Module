package org.lamisplus.modules.lims.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.entities.OrganisationUnit;
import org.lamisplus.modules.base.domain.entities.User;
import org.lamisplus.modules.base.service.OrganisationUnitService;
import org.lamisplus.modules.base.service.UserService;
import org.lamisplus.modules.lims.domain.dto.*;
import org.lamisplus.modules.lims.domain.entity.Config;
import org.lamisplus.modules.lims.domain.entity.Manifest;
import org.lamisplus.modules.lims.domain.entity.Result;
import org.lamisplus.modules.lims.domain.entity.Sample;
import org.lamisplus.modules.lims.domain.mapper.LimsMapper;
import org.lamisplus.modules.lims.repository.LimsConfigRepository;
import org.lamisplus.modules.lims.repository.LimsManifestRepository;
import org.lamisplus.modules.lims.repository.LimsResultRepository;
import org.lamisplus.modules.lims.repository.LimsSampleRepository;
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
public class LimsManifestService {
    private final LimsManifestRepository limsManifestRepository;
    private final LimsResultRepository resultRepository;
    private final LimsSampleRepository sampleRepository;
    private final LimsMapper limsMapper;
    private final OrganisationUnitService organisationUnitService;
    private  final UserService userService;
    private final LimsConfigRepository limsConfigRepository;

    String FacilityDATIMCode = "FH7LMnbnVlT";
    String FacilityMFLCode = "543";
    String loginUrl = "/login.php";
    String manifestUrl = "/samples/create.php";
    String resultsUrl = "/samples/result.php";

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

        return limsMapper.toManifestDto( limsManifestRepository.save(manifest));
    }

    public ManifestDTO Update(ManifestDTO manifestDTO){
        return Save(manifestDTO);
    }

    public String Delete(Integer id){
        Manifest manifest = limsManifestRepository.findById(id).orElse(null);
        limsManifestRepository.delete(manifest);
        return id + " deleted successfully";
    }

    public ManifestDTO findById(Integer id) {
        return limsMapper.toManifestDto(limsManifestRepository.findById(id).orElse(null));
    }

    public List<ManifestDTO> findAllManifests(){
        List<ManifestDTO> dtos = limsMapper.toManifestDtoList(limsManifestRepository.findAll());
        return dtos;
    }

    private String GenerateManifestID(String FacilityCode){
        List<ManifestDTO> manifestDTOList = findAllManifests();
        return "LP-"+FacilityCode +"-"+ String.format("%05d", manifestDTOList.size()+1);
    }

    public LIMSManifestResponseDTO PostManifestToServer(int id, int configId) {
        RestTemplate restTemplate = GetRestTemplate();
        HttpHeaders headers = GetHTTPHeaders();
        Config config = limsConfigRepository.findById(configId).orElse(null);

        //Login to LIMS
        assert config != null;
        LIMSLoginResponseDTO loginResponseDTO = LoginToLIMS(restTemplate, headers, config);

        //Post request
        LIMSManifestResponseDTO response  = PostManifestRequest(restTemplate, headers, loginResponseDTO, id, config);

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

    private LIMSLoginResponseDTO LoginToLIMS(RestTemplate restTemplate, HttpHeaders headers, Config config){
        LIMSLoginRequestDTO loginRequestDTO = new LIMSLoginRequestDTO();
        loginRequestDTO.setEmail(config.getConfigEmail());
        loginRequestDTO.setPassword(config.getConfigPassword());

        HttpEntity<LIMSLoginRequestDTO> loginEntity = new HttpEntity<>(loginRequestDTO, headers);
        ResponseEntity<LIMSLoginResponseDTO> loginResponse = restTemplate.exchange(config.getServerUrl()+loginUrl, HttpMethod.POST, loginEntity, LIMSLoginResponseDTO.class);

        return loginResponse.getBody();
    }

    private HttpHeaders GetHTTPHeaders(){
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("user-agent", "Application");
        return headers;
    }

    private LIMSManifestResponseDTO PostManifestRequest(RestTemplate restTemplate, HttpHeaders headers, LIMSLoginResponseDTO loginResponseDTO, int ManifestId, Config config){
        LIMSManifestDTO manifest = limsMapper.toLimsManifestDto(findById(ManifestId));
        LIMSManifestRequestDTO requestDTO = new LIMSManifestRequestDTO();
        assert loginResponseDTO != null;
        requestDTO.setToken(loginResponseDTO.getJwt());
        requestDTO.setViralLoadManifest(manifest);

        HttpEntity<LIMSManifestRequestDTO> manifestEntity = new HttpEntity<>(requestDTO, headers);
        ResponseEntity<LIMSManifestResponseDTO> manifestResponse = restTemplate.exchange(config.getServerUrl()+manifestUrl, HttpMethod.POST, manifestEntity, LIMSManifestResponseDTO.class);
        return manifestResponse.getBody();
    }

    private LIMSResultsResponseDTO GetResultsRequest(RestTemplate restTemplate, HttpHeaders headers, LIMSLoginResponseDTO loginResponseDTO, int ManifestId, Config config){
        LIMSManifestDTO manifest = limsMapper.toLimsManifestDto(findById(ManifestId));
        LIMSResultsRequestDTO requestDTO = new LIMSResultsRequestDTO();

        requestDTO.setToken(loginResponseDTO.getJwt());
        requestDTO.setManifestID(manifest.getManifestID());
        requestDTO.setReceivingPCRLabID(manifest.getReceivingLabID());
        requestDTO.setReceivingPCRLabName(manifest.getReceivingLabName());
        requestDTO.setTestType("VL");
        requestDTO.setSendingFacilityID(manifest.getSendingFacilityID());
        requestDTO.setSendingFacilityName(manifest.getSendingFacilityName());

        HttpEntity<LIMSResultsRequestDTO> manifestEntity = new HttpEntity<>(requestDTO, headers);
        ResponseEntity<LIMSResultsResponseDTO> manifestResponse = restTemplate.exchange(config.getServerUrl()+resultsUrl, HttpMethod.POST, manifestEntity, LIMSResultsResponseDTO.class);
        return manifestResponse.getBody();
    }

    public LIMSResultsResponseDTO DownloadResultsFromLIMS(int id, int configId) {
        RestTemplate restTemplate = GetRestTemplate();
        HttpHeaders headers = GetHTTPHeaders();
        Config config = limsConfigRepository.findById(configId).orElse(null);

        //Login to LIMS
        assert config != null;
        LIMSLoginResponseDTO loginResponseDTO = LoginToLIMS(restTemplate, headers, config);

        //Get results
        LIMSResultsResponseDTO response  = GetResultsRequest(restTemplate, headers, loginResponseDTO, id, config);
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
