package org.lamisplus.modules.lims.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.lims.domain.dto.ManifestDTO;
import org.lamisplus.modules.lims.domain.entity.Result;
import org.lamisplus.modules.lims.service.LimsResultService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/lims")
public class LimsResultController {
    private final LimsResultService limsResultService;

    @PostMapping("/results")
    public List<Result> SaveResults(@RequestBody List<Result> results){
        return limsResultService.SaveAll(results);
    }

    @PutMapping("/results/{id}")
    public Result UpdateResult(@PathVariable int id, @RequestBody Result result) {
        return limsResultService.Update(result, id);
    }

    @DeleteMapping("/results/{id}")
    public String DeleteResult(@PathVariable int id) {
        return limsResultService.Delete(id);
    }

    @GetMapping("/results/{id}")
    public Result GetResultById(@PathVariable int id){
        return limsResultService.FindById(id);
    }

    @GetMapping("/results/manifests/{id}")
    public ManifestDTO GetResultByManifestId(@PathVariable int id){
        return limsResultService.FindResultsByManifestId(id);
    }
}
