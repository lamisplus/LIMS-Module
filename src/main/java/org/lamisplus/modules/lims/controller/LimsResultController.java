package org.lamisplus.modules.lims.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.lims.domain.entity.Result;
import org.lamisplus.modules.lims.service.ResultService;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/lims")
public class LimsResultController {
    private final ResultService resultService;

    @PostMapping("/results")
    public Result SaveResult(@RequestBody Result result){
        return resultService.Save(result);
    }

    @PutMapping("/results/{id}")
    public Result UpdateResult(@PathVariable int id, @RequestBody Result result) {
        return resultService.Update(result, id);
    }

    @DeleteMapping("/results/{id}")
    public String DeleteResult(@PathVariable int id) {
        return resultService.Delete(id);
    }

    @GetMapping("/results/{id}")
    public Result GetResultById(@PathVariable int id){
        return resultService.FindById(id);
    }
}
