package org.lamisplus.modules.lims.domain.dto;

import lombok.Data;

import javax.persistence.Column;


@Data
public class SampleDTO {
    private int id;
    private String uuid;
    private String sampleID;
    private int pid;
    private String patientID;
    private String sampleType;
    private String collectionDate;
    private String dateSampleSent;
    private String manifestID;
}
