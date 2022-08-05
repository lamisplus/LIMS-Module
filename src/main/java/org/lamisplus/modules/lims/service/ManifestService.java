package org.lamisplus.modules.lims.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.google.gson.JsonObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.lamisplus.modules.base.domain.entities.OrganisationUnit;
import org.lamisplus.modules.base.domain.entities.User;
import org.lamisplus.modules.base.service.OrganisationUnitService;
import org.lamisplus.modules.base.service.UserService;
import org.lamisplus.modules.lims.domain.dto.*;
import org.lamisplus.modules.lims.domain.entity.Manifest;
import org.lamisplus.modules.lims.domain.entity.Sample;
import org.lamisplus.modules.lims.domain.mapper.LimsMapper;
import org.lamisplus.modules.lims.repository.ManifestRepository;
import org.lamisplus.modules.lims.util.JsonNodeTransformer;
import org.lamisplus.modules.patient.domain.dto.PersonResponseDto;
import org.lamisplus.modules.patient.service.PersonService;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.http.*;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
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
    private final LimsMapper limsMapper;
    private final OrganisationUnitService organisationUnitService;
    private final SampleService sampleService;
    private final PersonService personService;
    private  final UserService userService;
    private final JsonNodeTransformer jsonNodeTransformer;

    public ManifestDTO Save(ManifestDTO manifestDTO){
        Manifest manifest = limsMapper.tomManifest(manifestDTO);

        //TODO: pick the active facility
        Long FacilityId = getCurrentUserOrganization();
        OrganisationUnit organisationUnit = organisationUnitService.getOrganizationUnit(FacilityId);
        String FacilityDATIMCode = "FH7LMnbnVlT";
        String FacilityMFLCode = "543";
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

        return AppendPatientInformation(limsMapper.toManifestDto( manifestRepository.save(manifest)));
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
        return AppendPatientInformation(limsMapper.toManifestDto(manifestRepository.findById(id).orElse(null)));
    }

    public List<ManifestDTO> findAllManifests(){
        List<ManifestDTO> dtos = limsMapper.toManifestDtoList(manifestRepository.findAll());
        for(ManifestDTO dto: dtos){
            AppendPatientInformation(dto);
        }
        return dtos;
    }

    private String GenerateManifestID(String FacilityCode){
        List<ManifestDTO> manifestDTOList = findAllManifests();
        return "LP-"+FacilityCode +"-"+ String.format("%05d", manifestDTOList.size()+1);
    }

    public LIMSManifestResponseDTO PostManifestToServer(int id) throws JsonProcessingException, JSONException {
        RestTemplate restTemplate = new RestTemplate();

        //set message converters
        List<HttpMessageConverter<?>> messageConverters = new ArrayList<>();
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setSupportedMediaTypes(Collections.singletonList(MediaType.ALL));
        messageConverters.add(converter);
        restTemplate.setMessageConverters(messageConverters);

        //Get token
        LIMSLoginRequestDTO loginRequestDTO = new LIMSLoginRequestDTO();
        loginRequestDTO.setEmail("nmrs@lims.ng");
        loginRequestDTO.setPassword("nmrs@2020!");

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("user-agent", "Application");
        HttpEntity<LIMSLoginRequestDTO> loginEntity = new HttpEntity<>(loginRequestDTO, headers);
        String loginUrl = "https://lims.ng/apidemo/login.php";
        ResponseEntity<LIMSLoginResponseDTO> loginResponse = restTemplate.exchange(loginUrl, HttpMethod.POST, loginEntity, LIMSLoginResponseDTO.class);
        LIMSLoginResponseDTO loginResponseDTO = loginResponse.getBody();

        //Post manifest
        LIMSManifestDTO manifest = limsMapper.toLimsManifestDto(findById(id));
        LIMSManifestRequestDTO requestDTO = new LIMSManifestRequestDTO();
        assert loginResponseDTO != null;
        requestDTO.setToken(loginResponseDTO.getJwt());
        requestDTO.setViralLoadManifest(manifest);

        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        String manifestObject = ow.writeValueAsString(requestDTO);

        LOG.info("MANIFEST-REQUEST: "+manifestObject);

        HttpEntity<LIMSManifestRequestDTO> manifestEntity = new HttpEntity<>(requestDTO, headers);
        String manifestUrl = "https://lims.ng/apidemo/samples/create.php";
        ResponseEntity<JsonNode> manifestResponse = restTemplate.exchange(manifestUrl, HttpMethod.POST, manifestEntity, JsonNode.class);
        LOG.info("MANIFEST-RESPONSE: "+manifestResponse.getBody());

        //Update manifest status
        //manifest.setManifestStatus("Submitted");
        //manifest.setCreateDate(LocalDateTime.now());
        //Save(limsMapper.toManifestDto(manifest));

        return null;//manifestResponse.getBody();
    }

    private ManifestDTO AppendPatientInformation(ManifestDTO dto){
        try {
            for (SampleDTO sampleDTO : dto.getSampleInformation()) {
                PersonResponseDto personResponseDTO = personService.getPersonById((long) sampleDTO.getPid());
                List<PatientIdDTO> patientIdDTOS = new ArrayList<>();
                PatientIdDTO patientIdDTO = new PatientIdDTO();
                patientIdDTO.setIdTypeCode("HOSPITALNO");
                patientIdDTO.setIdNumber(jsonNodeTransformer.getNodeValue(personResponseDTO.getIdentifier(), "identifier", "value", true));
                patientIdDTOS.add(patientIdDTO);
                sampleDTO.setPatientID(patientIdDTOS);
            }
            return dto;
        }
        catch (Exception exception){
            return dto;
        }
    }



    public Long getCurrentUserOrganization() {
        Optional<User> userWithRoles = userService.getUserWithRoles ();
        return userWithRoles.map (User::getCurrentOrganisationUnitId).orElse (null);
    }
}
