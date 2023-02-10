package org.lamisplus.modules.lims.repository;

import org.lamisplus.modules.lims.domain.entity.LIMSPCRLab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface LIMSPCRLabRepository extends JpaRepository<LIMSPCRLab, Long>
{
    @Query(value = "SELECT * FROM lims_pcr_lab order by name", nativeQuery = true)
    List<LIMSPCRLab> allpcrlabs();

}
