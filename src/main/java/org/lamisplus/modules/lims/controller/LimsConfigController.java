package org.lamisplus.modules.lims.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.lims.domain.dto.ConfigDTO;
import org.lamisplus.modules.lims.service.LimsConfigService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/lims")
public class LimsConfigController {
    private final LimsConfigService limsConfigService;

    @PostMapping("/configs")
    public ConfigDTO SaveConfig(@RequestBody ConfigDTO configDTO){
        return limsConfigService.Save(configDTO);
    }

    @PutMapping("/configs/{id}")
    public ConfigDTO UpdateConfig(@PathVariable int id, @RequestBody ConfigDTO configDTO) throws Exception {
        return limsConfigService.Update(configDTO, id);
    }

    @DeleteMapping("/configs/{id}")
    public String DeleteConfig(@PathVariable int id) throws Exception {
        return limsConfigService.Delete(id);
    }

    @GetMapping("/configs")
    public List<ConfigDTO> GetAllConfig(){
        return limsConfigService.FindAll();
    }

    @GetMapping("/configs/{id}")
    public ConfigDTO GetConfigById(@PathVariable int id){
        return limsConfigService.FindById(id);
    }
}
