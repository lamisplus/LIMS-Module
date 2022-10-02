package org.lamisplus.modules.lims.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.lims.domain.dto.ManifestDTO;
import org.lamisplus.modules.lims.domain.entity.Result;
import org.lamisplus.modules.lims.domain.entity.Test;
import org.lamisplus.modules.lims.domain.mapper.LimsMapper;
import org.lamisplus.modules.lims.repository.LimsManifestRepository;
import org.lamisplus.modules.lims.repository.LimsResultRepository;
import org.lamisplus.modules.lims.repository.LimsTestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class LimsResultService {
    private final LimsResultRepository resultRepository;
    private final LimsManifestRepository manifestRepository;
    private final LimsTestRepository testRepository;
    private final LimsMapper limsMapper;

    private Result Save(Result result){
        result.setUuid(UUID.randomUUID().toString());
        LOG.info("1. RESULT: " + result);
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

    public void SaveResultInLabModule(Result result){
        try {
            Test test = testRepository.findBySampleId(Integer.valueOf(result.getSampleID())).get(0);
            LOG.info("TEST: " + test);

            resultRepository.SaveSampleResult(UUID.randomUUID().toString(),
                    LocalDate.parse(result.getAssayDate()),
                    LocalTime.parse("00:00:00"),
                    LocalDate.parse(result.getDateResultDispatched()),
                    LocalTime.parse("00:00:00"),
                    result.getTestResult(),
                    test.getId(),
                    test.getPatientUuid(),
                    test.getFacilityId().toString(),
                    test.getPatientId());
        }catch (Exception exception) {
            LOG.info("ERROR SAVING RESULT: " + exception.getMessage());
        }
    }
}
