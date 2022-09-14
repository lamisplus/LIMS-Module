package org.lamisplus.modules.lims.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.lims.domain.dto.SampleDTO;
import org.lamisplus.modules.lims.domain.entity.Sample;
import org.lamisplus.modules.lims.domain.mapper.LimsMapper;
import org.lamisplus.modules.lims.repository.SampleRepository;
import org.lamisplus.modules.lims.util.JsonNodeTransformer;
import org.lamisplus.modules.patient.domain.dto.PersonResponseDto;
import org.lamisplus.modules.patient.service.PersonService;
import org.springframework.stereotype.Service;


import java.util.List;

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

    public List<SampleDTO> findbyManifestId(String id){
        return limsMapper.toSampleDtoList(sampleRepository.findAllByManifestID(id));
    }

    public List<SampleDTO> getAllPendingSamples(){
        return AppendPatientDetails(limsMapper.toSampleDtoList(sampleRepository.findPendingVLSamples()));
    }

    private List<SampleDTO> AppendPatientDetails(List<SampleDTO> sampleDTOS){
        for (SampleDTO sampleDTO: sampleDTOS) {
            PersonResponseDto personResponseDTO = personService.getPersonById((long) sampleDTO.getPid());
            sampleDTO.setPatientID(jsonNodeTransformer.getNodeValue(personResponseDTO.getIdentifier(), "identifier", "value", true));
        }

        return sampleDTOS;
    }
}
