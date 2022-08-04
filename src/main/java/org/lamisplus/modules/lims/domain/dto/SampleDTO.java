package org.lamisplus.modules.lims.domain.dto;

import lombok.Data;

import java.util.List;

@Data
public class SampleDTO {
    private int id;
    private String uuid;
    private int pid;
    private List<PatientIdDTO> patientID;
    private String firstName;
    private String surName;
    private String Sex;
    private String pregnantBreastFeedingStatus;
    private String Age;
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
    private String priority;
    private String priorityReason;

    private int manifestID;
}
