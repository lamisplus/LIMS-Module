package org.lamisplus.modules.lims.domain.dto;

import lombok.Data;
import org.lamisplus.modules.lims.domain.entity.Result;

import java.time.LocalDateTime;
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
    private String manifestStatus;
    private LocalDateTime createDate;
    private List<SampleDTO> sampleInformation;
    private List<Result> results;
}
