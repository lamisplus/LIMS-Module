package org.lamisplus.modules.lims.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.lims.domain.entity.Result;
import org.lamisplus.modules.lims.repository.ResultRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class ResultService {
    private final ResultRepository resultRepository;

    public Result Save(Result result){
        result.setUuid(UUID.randomUUID().toString());
        return resultRepository.save(result);
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
}
