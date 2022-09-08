package org.lamisplus.modules.lims.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.lims.domain.dto.ConfigDTO;
import org.lamisplus.modules.lims.domain.dto.ManifestDTO;
import org.lamisplus.modules.lims.service.ConfigService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/lims")
public class LimsConfigController {
    private final ConfigService configService;

    @PostMapping("/configs")
    public ConfigDTO SaveConfig(@RequestBody ConfigDTO configDTO){
        return configService.Save(configDTO);
    }

    @PutMapping("/configs/{id}")
    public ConfigDTO UpdateConfig(@PathVariable int id, @RequestBody ConfigDTO configDTO) throws Exception {
        return configService.Update(configDTO, id);
    }

    @DeleteMapping("/configs/{id}")
    public String DeleteConfig(@PathVariable int id) throws Exception {
        return configService.Delete(id);
    }

    @GetMapping("/configs")
    public List<ConfigDTO> GetAllConfig(){
        return configService.FindAll();
    }

    @GetMapping("/configs/{id}")
    public ConfigDTO GetConfigById(@PathVariable int id){
        return configService.FindById(id);
    }
}
