package org.lamisplus.modules.lims.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.lims.domain.dto.ConfigDTO;
import org.lamisplus.modules.lims.domain.entity.Config;
import org.lamisplus.modules.lims.domain.mapper.LimsMapper;
import org.lamisplus.modules.lims.repository.ConfigRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class ConfigService {
    private final ConfigRepository configRepository;
    private final LimsMapper limsMapper;

    public ConfigDTO Save(ConfigDTO configDTO){
        Config config = limsMapper.toConfig(configDTO);
        config.setUuid(UUID.randomUUID().toString());
        config.setCreateDate(LocalDateTime.now());
        return limsMapper.toConfigDto(configRepository.save(config));
    }
    public ConfigDTO Update(ConfigDTO configDTO, int id) throws Exception {
        if(FindById(id) != null) {
            return limsMapper.toConfigDto(configRepository.save(limsMapper.toConfig(configDTO)));
        }
        else {
            throw new Exception(id + " not found");
        }
    }

    public ConfigDTO FindById(Integer id){
        return limsMapper.toConfigDto(configRepository.findById(id).orElse(null));
    }

    public String Delete(Integer id){
        configRepository.deleteById(id);
        return id+" deleted successfully";
    }

    public List<ConfigDTO> FindAll(){
        return limsMapper.toConfigDtoList(configRepository.findAll());
    }
}
