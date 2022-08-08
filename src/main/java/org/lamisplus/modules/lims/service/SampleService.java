package org.lamisplus.modules.lims.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.lims.domain.dto.PatientIdDTO;
import org.lamisplus.modules.lims.domain.dto.SampleDTO;
import org.lamisplus.modules.lims.domain.entity.Sample;
import org.lamisplus.modules.lims.domain.mapper.LimsMapper;
import org.lamisplus.modules.lims.repository.SampleRepository;
import org.lamisplus.modules.lims.util.JsonNodeTransformer;
import org.lamisplus.modules.patient.domain.dto.PersonResponseDto;
import org.lamisplus.modules.patient.service.PersonService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class SampleService {
    private final SampleRepository sampleRepository;
    private final LimsMapper limsMapper;
    private final PersonService personService;
    private final JsonNodeTransformer jsonNodeTransformer;

    public SampleDTO Save(SampleDTO sampleDTO){
        Sample sample = limsMapper.toSample(sampleDTO);
        sample.setUuid(UUID.randomUUID().toString());
        return limsMapper.tosSampleDto( sampleRepository.save(sample));
    }

    public SampleDTO Update(SampleDTO sampleDTO){
        return Save(sampleDTO);
    }

    public String Delete(Integer id){
        Sample sample = sampleRepository.findById(id).orElse(null);
        sampleRepository.delete(sample);
        return id.toString() + " deleted successfully";
    }

    public SampleDTO findById(Integer id) {
        return limsMapper.tosSampleDto(sampleRepository.findById(id).orElse(null));
    }

    public List<SampleDTO> findbyManifestRecordId(int id) {
        return AppendPatientDetails(limsMapper.toSampleDtoList(sampleRepository.findAllByManifestRecordID(id)));
    }

    public List<SampleDTO> getAllPendingSamples() {
        return AppendPatientDetails(limsMapper.toSampleDtoList(sampleRepository.findPendingVLSamples()));
    }

    public List<SampleDTO> AppendPatientDetails(List<SampleDTO> sampleDTOS) {
        for (SampleDTO sampleDTO: sampleDTOS) {
            PersonResponseDto personResponseDTO = personService.getPersonById((long) sampleDTO.getPid());

            List<PatientIdDTO> patientIdDTOS = new ArrayList<>();
            PatientIdDTO patientIdDTO = new PatientIdDTO();
            patientIdDTO.setIdNumber(jsonNodeTransformer.getNodeValue(personResponseDTO.getIdentifier(), "identifier", "value", true));
            patientIdDTO.setIdTypeCode("HOSPITALNO");
            patientIdDTOS.add(patientIdDTO);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode patientIDNode = mapper.convertValue(patientIdDTO, JsonNode.class);

            sampleDTO.setPatientID(patientIDNode);
            sampleDTO.setAge("10");
            sampleDTO.setDateSampleSent("");
            sampleDTO.setArtCommencementDate("");
            sampleDTO.setDateOfBirth(String.valueOf(personResponseDTO.getDateOfBirth()));
            sampleDTO.setDrugRegimen("");
            sampleDTO.setFirstName(personResponseDTO.getFirstName());
            sampleDTO.setSurName(personResponseDTO.getSurname());
            sampleDTO.setIndicationVLTest("1");
            sampleDTO.setPregnantBreastFeedingStatus("");
            sampleDTO.setSex("M");
        }

        return sampleDTOS;
    }
}
