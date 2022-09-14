package org.lamisplus.modules.lims.repository;

import org.lamisplus.modules.lims.domain.entity.Manifest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LimsManifestRepository extends JpaRepository<Manifest, Integer> {

}
