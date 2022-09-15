package org.lamisplus.modules.lims.repository;

import org.lamisplus.modules.lims.domain.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LimsResultRepository extends JpaRepository<Result, Integer> {
    List<Result> findAllByManifestRecordID(Integer id);
}
