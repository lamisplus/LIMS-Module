package org.lamisplus.modules.lims.domain.mapper;

import org.lamisplus.modules.lims.domain.dto.*;
import org.lamisplus.modules.lims.domain.entity.Config;
import org.lamisplus.modules.lims.domain.entity.Manifest;
import org.lamisplus.modules.lims.domain.entity.Sample;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LimsMapper {
    ManifestDTO toManifestDto(Manifest manifest);
    SampleDTO tosSampleDto(Sample sample);
    List<ManifestDTO> toManifestDtoList(List<Manifest> manifestList);
    List<SampleDTO> toSampleDtoList(List<Sample> sampleList);

    Manifest tomManifest(ManifestDTO manifestDTO);
    Sample toSample(SampleDTO sampleDTO);
    List<Manifest> tomManifestList(List<ManifestDTO> manifestDTOList);
    List<Sample> toSampleList(List<SampleDTO> sampleDTOList);

    LIMSManifestDTO toLimsManifestDto(ManifestDTO manifestDTO);
    LIMSSampleDTO toLimsSampleDto(SampleDTO sampleDTO);
    ManifestDTO toManifestDto(LIMSManifestDTO limsManifestDTO);
    SampleDTO toSampleDto(LIMSSampleDTO limsSampleDTO);

    ConfigDTO toConfigDto(Config config);
    Config toConfig(ConfigDTO configDTO);
    List<ConfigDTO> toConfigDtoList(List<Config> configList);
    List<Config> toConfigList(List<ConfigDTO> configDTOList);
}
