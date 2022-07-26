CREATE SEQUENCE lims_manifest_id_seq;
CREATE TABLE public.lims_manifest
(
    id bigint NOT NULL DEFAULT nextval('lims_manifest_id_seq'),
    uuid character varying(100),
    manifest_number character varying(100),
    sending_facility_id character varying(100),
    sending_facility_name character varying(100),
    receiving_lab_id character varying(100),
    receiving_lab_name character varying(100),
    date_scheduled_for_pickup character varying(100),
    temperature_at_pickup character varying(100),
    sample_packaged_by character varying(100),
    courier_rider_name character varying(100),
    courier_contact character varying(100),
    manifest_status character varying(100),
    PRIMARY KEY (id)
);
ALTER SEQUENCE lims_manifest_id_seq OWNED BY lims_manifest.id;


CREATE SEQUENCE lims_sample_id_seq;
CREATE TABLE public.lims_sample
(
    id bigint NOT NULL DEFAULT nextval('lims_sample_id_seq'),
    uuid character varying(100),
    sample_id character varying(100),
    pid INTEGER,
    patient_id character varying(100),
    sample_type character varying(100),
    collection_Date character varying(100),
    date_sample_sent character varying(100),
    manifest_id INTEGER,
    PRIMARY KEY (id)
);
ALTER SEQUENCE lims_sample_id_seq OWNED BY lims_sample.id;
