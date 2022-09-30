package org.lamisplus.modules.lims.repository;

import org.lamisplus.modules.lims.domain.entity.Sample;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LimsSampleRepository extends JpaRepository<Sample, Integer> {
    List<Sample> findAllByManifestRecordID(Integer id);
    @Query(value = "select c.id, '0' as manifest_record_id\n" +
            ", c.id as sample_id\n" +
            ", c.uuid\n" +
            ", a.patient_id as pid\n" +
            ", null as patient_id\n" +
            ", e.display as sample_type\n" +
            ", a.userid as sample_ordered_by\n" +
            ", CAST(a.order_date as TEXT)||' 00:00:00'sample_order_date\n" +
            ", c.sample_collected_by\n" +
            ", CAST(c.date_sample_collected as TEXT)||' 00:00:00' as sample_collection_date\n" +
            ", c.time_sample_collected as sample_collection_time\n" +
            ", '' as date_sample_sent\n" +
            ", e.display as indication_vl_test\n" +
            ", '' as first_name\n" +
            ", '' as surname\n" +
            ", '' as sex\n" +
            ", '' as age\n" +
            ", '' as date_of_birth\n" +
            ", '' as pregnant_breast_feeding_status\n" +
            ", '' as art_commencement_date\n" +
            ", '' as drug_regimen\n" +
            ", '' as sending_facility_id\n" +
            ", '' as sending_facility_name\n" +
            ", '' as priority\n" +
            ", '' as priority_reason\n" +
            "from laboratory_order a\n" +
            "inner join laboratory_test b on a.id=b.lab_order_id\n" +
            "inner join laboratory_sample c on b.id=c.test_id\n" +
            "inner join laboratory_labtest d on b.lab_test_id=d.id\n" +
            "inner join base_application_codeset e on c.sample_type_id = e.id\n" +
            "left join base_application_codeset f on b.viral_load_indication = e.id\n" +
            "where d.lab_test_name='Viral Load'\n" +
            "and b.lab_test_order_status in (1,2,3) ", nativeQuery = true)
    List<Sample> findPendingVLSamples();
}
