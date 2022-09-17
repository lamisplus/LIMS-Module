package org.lamisplus.modules.lims.repository;

import org.lamisplus.modules.lims.domain.entity.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LimsTestRepository extends JpaRepository<Test, Integer> {
    @Query(value="select * from laboratory_test where id= " +
            "(select test_id from laboratory_sample where id=:sampleId limit 1)", nativeQuery = true)
    List<Test> findBySampleId(@Param("sampleId") Integer sampleId);
}
