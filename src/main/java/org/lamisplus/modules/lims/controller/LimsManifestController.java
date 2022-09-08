package org.lamisplus.modules.lims.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.lims.domain.dto.LIMSManifestResponseDTO;
import org.lamisplus.modules.lims.domain.dto.LIMSResultsResponseDTO;
import org.lamisplus.modules.lims.domain.dto.ManifestDTO;
import org.lamisplus.modules.lims.service.ManifestService;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/lims")
public class LimsManifestController {
    private final ManifestService manifestService;

    @PostMapping("/manifests")
    public ManifestDTO SaveManifest(@RequestBody ManifestDTO manifestDTO){
        return manifestService.Save(manifestDTO);
    }

    @PutMapping("/manifests")
    public ManifestDTO UpdateManifest(@RequestBody ManifestDTO manifestDTO){
        return manifestService.Update(manifestDTO);
    }

    @DeleteMapping("/manifests/{id}")
    public String DeleteManifest(@PathVariable int id){
        return manifestService.Delete(id);
    }

    @GetMapping("/manifests/{id}")
    public ManifestDTO GetManifestById(@PathVariable int id){
        return manifestService.findById(id);
    }

    @GetMapping("/manifests")
    public List<ManifestDTO> GetAllManifests(){
        return manifestService.findAllManifests();
    }

    @GetMapping("/ready-manifests/{id}/{configId}")
    public LIMSManifestResponseDTO PostManifestsToLIMSServer(@PathVariable int id, @PathVariable int configId) {
        return manifestService.PostManifestToServer(id, configId);
    }

    @GetMapping("/manifest-results/{id}/{configId}")
    public LIMSResultsResponseDTO DownloadResults(@PathVariable int id, @PathVariable int configId) {
        return manifestService.DownloadResultsFromLIMS(id, configId);
    }
}
