package org.lamisplus.modules.lims.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "lims_manifest")
public class Manifest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;
    @Column(name = "uuid", nullable = false, unique = true, updatable = false)
    private String uuid;
    @Column(name = "manifestID")
    private String manifestID;
    @Column(name = "sendingFacilityID")
    private String sendingFacilityID;
    @Column(name = "sendingFacilityName")
    private String sendingFacilityName;
    @Column(name = "receivingLabID")
    private String receivingLabID;
    @Column(name = "receivingLabName")
    private String receivingLabName;
    @Column(name = "dateScheduledForPickup")
    private String dateScheduledForPickup;
    @Column(name = "temperatureAtPickup")
    private String temperatureAtPickup;
    @Column(name = "samplePackagedBy")
    private String samplePackagedBy;
    @Column(name = "courierRiderName")
    private String courierRiderName;
    @Column(name = "courierContact")
    private String courierContact;
    @Column(name = "manifestStatus")
    private String manifestStatus;
    @JoinColumn(name = "manifestID")
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Sample> sampleList;
}
