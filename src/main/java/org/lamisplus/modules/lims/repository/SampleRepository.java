package org.lamisplus.modules.lims.repository;

import org.lamisplus.modules.lims.domain.entity.Sample;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SampleRepository extends JpaRepository<Sample, Integer> {
    List<Sample> findAllByManifestID(String id);

    @Query(value = "select c.id, '0' as manifest_id, '' as date_sample_sent, c.id as sample_id\n" +
            ", c.uuid\n" +
            ", a.patient_id as pid\n" +
            ", a.patient_id\n" +
            ", CAST(a.order_date as TEXT)||' 00:00:00' as collection_date\n" +
            ", e.display as sample_type\n" +
            "from laboratory_order a\n" +
            "inner join laboratory_test b on a.id=b.lab_order_id\n" +
            "inner join laboratory_sample c on b.id=c.test_id\n" +
            "inner join laboratory_labtest d on b.lab_test_id=d.id\n" +
            "inner join base_application_codeset e on c.sample_type_id = e.id\n" +
            "where d.lab_test_name='Viral Load'\n" +
            "and b.lab_test_order_status=1 ", nativeQuery = true)
    List<Sample> findPendingVLSamples();
}
