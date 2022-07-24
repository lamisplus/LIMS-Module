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

    @Column(name = "firstName")
    private String firstName;
    @Column(name = "surName")
    private String surName;
    @Column(name = "sex")
    private String sex;
    @Column(name = "pregnantBreastFeedingStatus")
    private String pregnantBreastFeedingStatus;
    @Column(name = "age")
    private String age;
    @Column(name = "dateOfBirth")
    private String dateOfBirth;

    @Column(name = "sampleID")
    private String sampleID;
    @Column(name = "sampleType")
    private String sampleType;
    @Column(name = "indicationVLTest")
    private String indicationVLTest;
    @Column(name = "artCommencementDate")
    private String artCommencementDate;
    @Column(name = "drugRegimen")
    private String drugRegimen;
    @Column(name = "sampleOrderedBy")
    private String sampleOrderedBy;
    @Column(name = "sampleOrderDate")
    private String sampleOrderDate;
    @Column(name = "sampleCollectedBy")
    private String sampleCollectedBy;
    @Column(name = "sampleCollectionDate")
    private String sampleCollectionDate;
    @Column(name = "sampleCollectionTime")
    private String sampleCollectionTime;
    @Column(name = "dateSampleSent")
    private String dateSampleSent;
    @Column(name = "manifestID")
    private String manifestID;
}
