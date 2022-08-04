package org.lamisplus.modules.lims.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.entities.OrganisationUnit;
import org.lamisplus.modules.base.service.OrganisationUnitService;
import org.lamisplus.modules.lims.domain.dto.*;
import org.lamisplus.modules.lims.domain.entity.Manifest;
import org.lamisplus.modules.lims.domain.entity.Sample;
import org.lamisplus.modules.lims.domain.mapper.LimsMapper;
import org.lamisplus.modules.lims.repository.ManifestRepository;
import org.lamisplus.modules.patient.domain.dto.PersonResponseDto;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class ManifestService {
    private final ManifestRepository manifestRepository;
    private final LimsMapper limsMapper;
    private final OrganisationUnitService organisationUnitService;
    private final SampleService sampleService;

    public ManifestDTO Save(ManifestDTO manifestDTO){
        Manifest manifest = limsMapper.tomManifest(manifestDTO);

        //TODO: pick the active facility
        Long FacilityId = Long.valueOf(1870);
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
//        for(ManifestDTO dto: dtos){
//            AppendPatientInformation(dto);
//        }
        return dtos;
    }

    private String GenerateManifestID(String FacilityCode){
        List<ManifestDTO> manifestDTOList = findAllManifests();
        return "LP-"+FacilityCode +"-"+ String.format("%05d", manifestDTOList.size()+1);
    }

    public LIMSManifestResponseDTO PostManifestToServer(int id){
        RestTemplate restTemplate = new RestTemplate();

        //Get token
        LIMSLoginRequestDTO loginRequestDTO = new LIMSLoginRequestDTO();
        loginRequestDTO.setEmail("nmrs@lims.ng");
        loginRequestDTO.setPassword("nmrs@2020!");
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<LIMSLoginRequestDTO> loginRequest = new HttpEntity<>(loginRequestDTO, headers);
        LIMSLoginResponseDTO loginResponseDTO = restTemplate.postForObject(
                "https://lims.ng/apidemo/login.php",
                loginRequest,
                LIMSLoginResponseDTO.class);

        //Post manifest
        ManifestDTO manifest = findById(id);
        LIMSManifestRequestDTO requestDTO = new LIMSManifestRequestDTO();
        assert loginResponseDTO != null;
        requestDTO.setToken(loginResponseDTO.getJwt());
        requestDTO.setViralLoadManifest(manifest);
        HttpEntity<LIMSManifestRequestDTO> manifestRequest = new HttpEntity<>(requestDTO, headers);
        LIMSManifestResponseDTO responseDTO =  restTemplate.postForObject(
                "https://lims.ng/apidemo/samples/create.php",
                manifestRequest,
                LIMSManifestResponseDTO.class);

        //Update manifest status
        manifest.setManifestStatus("Submitted");
        manifest.setCreateDate(LocalDateTime.now());
        Save(manifest);

        return responseDTO;
    }

//    private ManifestDTO AppendPatientInformation(ManifestDTO dto){
//        dto.setSampleInformation(sampleService.AppendPatientDetails(dto.getSampleInformation()));
//        return dto;
//    }
}
