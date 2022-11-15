package org.lamisplus.modules.lims.repository;

import org.lamisplus.modules.lims.domain.entity.LIMSManifest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LimsManifestRepository extends JpaRepository<LIMSManifest, Integer> {
    Page<LIMSManifest> findLIMSManifestByManifestID(String searchParam, Pageable pageable);
}
