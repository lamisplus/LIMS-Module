package org.lamisplus.modules.lims.domain.dto;

import lombok.Data;

import java.util.List;

@Data
public class ManifestDTO {
    private int id;
    private String uuid;
    private String manifestID;
    private String sendingFacilityID;
    private String sendingFacilityName;
    private String receivingLabID;
    private String receivingLabName;
    private String dateScheduledForPickup;
    private String temperatureAtPickup;
    private String samplePackagedBy;
    private String courierRiderName;
    private String courierContact;
    private List<SampleDTO> sampleDTOS;
}
