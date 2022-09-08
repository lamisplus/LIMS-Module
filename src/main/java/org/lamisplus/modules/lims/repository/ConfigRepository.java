package org.lamisplus.modules.lims.repository;

import org.lamisplus.modules.lims.domain.entity.Config;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfigRepository extends JpaRepository<Config, Integer> {
}
