package org.lamisplus.modules.lims.repository;

import org.lamisplus.modules.lims.domain.entity.Sample;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SampleRepository extends JpaRepository<Sample, Integer> {
    List<Sample> findAllByManifestID(String id);
}
