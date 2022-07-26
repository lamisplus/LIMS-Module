package org.lamisplus.modules.lims.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.lims.domain.dto.SampleDTO;
import org.lamisplus.modules.lims.service.SampleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/lims")
public class LimsSampleController {
    private final SampleService sampleService;

    @PostMapping("/samples")
    public SampleDTO SaveManifest(@RequestBody SampleDTO manifestDTO){
        return sampleService.Save(manifestDTO);
    }

    @PutMapping("/samples")
    public SampleDTO UpdateManifest(@RequestBody SampleDTO manifestDTO){
        return sampleService.Update(manifestDTO);
    }

    @DeleteMapping("/samples/{id}")
    public String DeleteManifest(@PathVariable int id){
        return sampleService.Delete(id);
    }

    @GetMapping("/samples/{id}")
    public SampleDTO GetAllLabOrders(@PathVariable int id){
        return sampleService.findById(id);
    }

    @GetMapping("/samples/manifests/{id}")
    public List<SampleDTO> GetSamplesByManifestId(@PathVariable String id){
        return sampleService.findbyManifestId(id);
    }
}
