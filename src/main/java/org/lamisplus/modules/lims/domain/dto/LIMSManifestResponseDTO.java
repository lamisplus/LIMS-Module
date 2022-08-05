package org.lamisplus.modules.lims.domain.dto;

import lombok.Data;

import java.util.List;
import java.util.Objects;

@Data
public class LIMSManifestResponseDTO {
    String manifestID;
    String facilityName;
    String facilityId;
    String receivingPCRLab;
    String receivingPCRLabId;
    String totalSamplesProcessed;
    String totalSamplesNotProcessed;
    @JsonProperty("errors")
    private JsonNode errors;
}
