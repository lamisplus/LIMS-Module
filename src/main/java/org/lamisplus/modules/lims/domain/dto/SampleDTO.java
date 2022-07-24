package org.lamisplus.modules.lims.domain.dto;

import lombok.Data;


@Data
public class SampleDTO {
    private int id;
    private String uuid;
    private String firstName;
    private String surName;
    private String sex;
    private String pregnantBreastFeedingStatus;
    private String age;
    private String dateOfBirth;
    private String sampleID;
    private String sampleType;
    private String indicationVLTest;
    private String artCommencementDate;
    private String drugRegimen;
    private String sampleOrderedBy;
    private String sampleOrderDate;
    private String sampleCollectedBy;
    private String sampleCollectionDate;
    private String sampleCollectionTime;
    private String dateSampleSent;
    private String manifestID;
}
