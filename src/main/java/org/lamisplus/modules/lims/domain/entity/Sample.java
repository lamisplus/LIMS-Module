package org.lamisplus.modules.lims.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "lims_sample")
public class Sample {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;
    @Column(name = "uuid", nullable = false, unique = true, updatable = false)
    private String uuid;

    @Column(name = "sample_id")
    private String sampleID;
    @Column(name = "pid")
    private int pid;
    @Column(name = "patient_id")
    private String patientID;
    @Column(name = "sample_type")
    private String sampleType;
    @Column(name = "collection_date")
    private String collectionDate;
    @Column(name = "date_sample_sent")
    private String dateSampleSent;

    @Column(name = "manifest_id")
    private String manifestID;
}
