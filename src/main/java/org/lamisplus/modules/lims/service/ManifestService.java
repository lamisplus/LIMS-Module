package org.lamisplus.modules.lims.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.lims.domain.dto.ManifestDTO;
import org.lamisplus.modules.lims.domain.entity.Manifest;
import org.lamisplus.modules.lims.domain.mapper.LimsMapper;
import org.lamisplus.modules.lims.repository.ManifestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ManifestService {
    private final ManifestRepository manifestRepository;
    private final LimsMapper limsMapper;

    public ManifestDTO Save(ManifestDTO manifestDTO){
        Manifest manifest = limsMapper.tomManifest(manifestDTO);
        return limsMapper.toManifestDto( manifestRepository.save(manifest));
    }

    public ManifestDTO Update(ManifestDTO manifestDTO){
        return Save(manifestDTO);
    }

    public String Delete(Integer id){
        Manifest manifest = manifestRepository.findById(id).orElse(null);
        manifestRepository.delete(manifest);
        return id.toString() + " deleted successfully";
    }

    public ManifestDTO findById(Integer id) {
        return limsMapper.toManifestDto(manifestRepository.findById(id).orElse(null));
    }

    public List<ManifestDTO> findAllManifests(){
        return limsMapper.toManifestDtoList(manifestRepository.findAll());
    }
}
