package org.lamisplus.modules.lims.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.Laboratory.domain.dto.ResultDTO;
import org.lamisplus.modules.Laboratory.domain.dto.SampleDTO;
import org.lamisplus.modules.Laboratory.service.ResultService;
import org.lamisplus.modules.Laboratory.service.SampleService;
import org.lamisplus.modules.lims.domain.dto.ManifestDTO;
import org.lamisplus.modules.lims.domain.entity.Result;
import org.lamisplus.modules.lims.domain.mapper.LimsMapper;
import org.lamisplus.modules.lims.repository.LimsManifestRepository;
import org.lamisplus.modules.lims.repository.LimsResultRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class LimsResultService {
    private final LimsResultRepository resultRepository;
    private final LimsManifestRepository manifestRepository;
    private final SampleService labSampleService;
    private final ResultService labResultService;
    private final LimsMapper limsMapper;

    private Result Save(Result result){
        result.setUuid(UUID.randomUUID().toString());
        SaveResultInLabModule(result);
        return resultRepository.save(result);
    }

    public List<Result> SaveAll(List<Result> results){
        List<Result> savedResults = new ArrayList<>();

        for(Result result:results){
            Result savedResult = Save(result);
            savedResults.add(savedResult);
        }

        return  savedResults;
    }

    public Result Update(Result result, int id){
        return resultRepository.save(result);
    }

    public Result FindById(int id){
        return resultRepository.findById(id).orElse(null);
    }

    public  String Delete(int id){
        resultRepository.deleteById(id);
        return id+" deleted successfully";
    }

    public ManifestDTO FindResultsByManifestId(Integer id){
        ManifestDTO dto = limsMapper.toManifestDto(manifestRepository.findById(id).orElse(null));
        List<Result> results = resultRepository.findAllByManifestRecordID(id);
        dto.setResults(results);
        return dto;
    }

    private void SaveResultInLabModule(Result limsResult){
        try {
            SampleDTO sampleDTO = labSampleService.FindById(Integer.parseInt(limsResult.getSampleID()));
            ResultDTO resultDTO = new ResultDTO();
            resultDTO.setTestId(sampleDTO.getTestId());
            resultDTO.setResultReported(limsResult.getTestResult());
            resultDTO.setTimeAssayed(LocalTime.parse("00:00:00"));
            resultDTO.setDateAssayed(LocalDate.parse(limsResult.getAssayDate()));
            resultDTO.setTimeResultReported(LocalTime.parse("00:00:00"));
            resultDTO.setDateResultReported(LocalDate.parse(limsResult.getDateResultDispatched()));
            labResultService.Save(resultDTO);
        }catch (Exception exception) {
            LOG.info("ERROR SAVING RESULT: " + exception.getMessage());
        }
    }
}
