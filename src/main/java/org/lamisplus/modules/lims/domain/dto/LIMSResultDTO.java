package org.lamisplus.modules.lims.domain.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;

@Data
public class LIMSResultDTO {
    private JsonNode patientID;
    private String firstName;
    private String surName;
    private String sex;
    private String dateOfBirth;
    private String sampleID;
    private String pcrLabSampleNumber;
    private String visitDate;
    private String dateSampleReceivedAtPCRLab;
    private String resultDate;
    private String testResult;
    private String assayDate;
    private String approvalDate;
    private String dateResultDispatched;
    private String sampleStatus;
    private String sampleTestable;
    private int manifestRecordID;
}
