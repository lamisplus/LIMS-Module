package org.lamisplus.modules.lims.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "lims_sample")
public class Sample {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;
    @Column(name = "uuid", nullable = false, unique = true, updatable = false)
    private String uuid;

    @Column(name = "sample_id")
    private String sampleID;
    @Column(name = "pid")
    private int pid;

    @Column(name = "sample_type")
    private String sampleType;
    @Column(name = "sample_ordered_by")
    private String sampleOrderedBy;
    @Column(name = "sample_order_date")
    private String sampleOrderDate;
    @Column(name = "sample_collected_by")
    private String sampleCollectedBy;
    @Column(name = "sample_collection_date")
    private String sampleCollectionDate;
    @Column(name = "sample_collection_time")
    private String sampleCollectionTime;
    @Column(name = "date_sample_sent")
    private String dateSampleSent;
    @Column(name = "indication_vl_test")
    private String indicationVLTest;

    @Column(name = "first_name")
    private String firstName;
    @Column(name = "surname")
    private String surName;
    @Column(name = "sex")
    private String Sex;
    @Column(name = "age")
    private String Age;
    @Column(name = "date_of_birth")
    private String dateOfBirth;

    @Column(name = "pregnant_breast_feeding_status")
    private String pregnantBreastFeedingStatus;
    @Column(name = "art_commencement_date")
    private String artCommencementDate;
    @Column(name = "drug_regimen")
    private String drugRegimen;

    @Column(name = "sending_facility_id")
    private String sendingFacilityID;
    @Column(name = "sending_facility_name")
    private String sendingFacilityName;
    @Column(name = "priority")
    private String priority;
    @Column(name = "priority_reason")
    private String priorityReason;

    @Column(name = "manifest_id")
    private int manifestID;
}
