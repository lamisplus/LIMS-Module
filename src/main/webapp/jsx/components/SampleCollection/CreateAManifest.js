import React, {useEffect, useCallback, useState} from 'react';
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import ConfigModal from './ConfigModal';
import ProgressBar from './Progressbar';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Alert from '@mui/material/Alert';

import IconButton from '@material-ui/core/IconButton';

import {  Modal, ModalHeader, ModalBody, Row,
    Col, Card, CardBody, Table,
    Form, FormFeedback, FormGroup, FormText,
    Input,
    Label, Badge
} from 'reactstrap';

import axios from "axios";
import { toast } from 'react-toastify';
import {token, url } from "../../../api";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { makeStyles } from '@material-ui/core/styles'
import { pcr_lab } from './pcr';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@material-ui/icons/Save'

const useStyles = makeStyles(theme => ({
    card: {
        margin: theme.spacing(20),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    cardBottom: {
        marginBottom: 20
    },
    Select: {
        height: 45,
        width: 350
    },
    button: {
        margin: theme.spacing(1)
    },

    root: {
        '& > *': {
            margin: theme.spacing(1)
        }
    },
    input: {
        border:'1px solid #014d88',
        borderRadius:'0px',
        fontSize:'14px',
        color:'#000'
    },
    error: {
        color: "#f85032",
        fontSize: "11px",
    },
    success: {
        color: "#4BB543 ",
        fontSize: "11px",
    },
    inputGroupText:{
        backgroundColor:'#014d88',
        fontWeight:"bolder",
        color:'#fff',
        borderRadius:'0px'
    },
    label:{
        fontSize:'14px',
        color:'#014d88',
        fontWeight:'600'
    }
}))

const CreateAManifest = (props) => {
    const classes = useStyles();
    const [loading, setLoading] = useState('')
    const [collectedSamples, setCollectedSamples] = useState([])
    const samples = []
    const [saved, setSaved] = useState(false);
    const [send, setSend] = useState(false);
    const [localStore, SetLocalStore] = useState([]);
    const [manifestsId, setManifestsId] = useState(0);
    const [status, setStatus] = useState("Pending")
    const [progress, setProgress] = useState(0);
    const [failed, setFailed] = useState(false);

    const [errors, setErrors] = useState({});

    const [open, setOpen] = useState(false)

    const handleOpen = () => setOpen(true);

    const toggleModal = () => setOpen(!open)

    const confirmStatusSubmitted = (status) => {
        props.setSubmitted(status)
    }

    useEffect(() => {
      const collectedSamples = JSON.parse(localStorage.getItem('samples'));
      if (collectedSamples) {
        SetLocalStore(collectedSamples);
      }
    }, []);

    const [pcrLabCode, setPcrLabCode] = useState({ name: "", labNo: ""});

    const [manifestData, setManifestData] = useState({
         manifestID: "",
         manifestStatus: "Pending",
         sendingFacilityID: "FH7LMnbnVlT",
         sendingFacilityName: "CHC ZUNGERU",
         receivingLabID: pcrLabCode.labNo,
         receivingLabName: pcrLabCode.name,
         dateScheduledForPickup: "",
         temperatureAtPickup: "",
         samplePackagedBy: "",
         courierRiderName: "",
         courierContact: "",
         createDate: "",
         sampleInformation: localStore,
         id: 0,
         uuid: ""
     })

    const [contactPhone, setContactPhone] = useState("");

    const checkPhoneNumber=(e)=> {
        setContactPhone(e)
    }

    const handleChange = (event) => {
           checkPCRLab(event.target.value)
           const { name, value } = event.target
           setManifestData({ ...manifestData, [name]: value, receivingLabID: pcrLabCode.labNo,
           receivingLabName: pcrLabCode.name, sampleInformation: localStore })
    }

    const checkPCRLab = (name) => {
        pcr_lab.map(( val ) => {
            if (val.name === name) {
                setPcrLabCode({name: val.name, labNo: val.labNo})
            }
        })
    }

    const validateInputs = () => {
        let temp = { ...errors }
        temp.dateScheduledForPickup = manifestData.dateScheduledForPickup ? "" : "Pick-Up date is required."
        temp.temperatureAtPickup = manifestData.temperatureAtPickup ? "" : "Temperature is required."
        temp.receivingLabID = manifestData.receivingLabID ? "" : "Receiving lab Id is required."
        temp.receivingLabName = manifestData.receivingLabName ? "" : "Receiving lab name is required."
        temp.courierRiderName = manifestData.courierRiderName ? "" : "Courier rider name is required."
        temp.courierContact = manifestData.courierContact ? "" : "Courier rider contact is required."
        temp.samplePackagedBy = manifestData.samplePackagedBy ? "" : "Sample packaged by is required."

        setErrors({
              ...temp
          })
          return Object.values(temp).every(x => x == "")
   }

    const handleSubmit = async (e) => {
        e.preventDefault()

        manifestData.courierContact = contactPhone;
            if (validateInputs()) {
               await axios.post(`${url}lims/manifests`, manifestData,
                { headers: {"Authorization" : `Bearer ${token}`}}).then(resp => {
                    setManifestsId(resp.data.id)

                    setSaved(true);
                    toast.success("Sample manifest saved successfully!!", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    manifestData.manifestID = resp.data.manifestID
                    manifestData.sendingFacilityID = resp.data.sendingFacilityID
                    manifestData.sendingFacilityName = resp.data.sendingFacilityName

                    localStorage.setItem('manifest', JSON.stringify(manifestData));
                    localStorage.removeItem("samples");
                    handleOpen()
                });
            }
    }

    const resendManifest = async (e) => {
        e.preventDefault()

        setProgress(20);
        const serverId = JSON.parse(localStorage.getItem('configId'));

         try{
            setProgress(50);
             await axios.get(`${url}lims/ready-manifests/${manifestsId}/${serverId}`, { headers: {"Authorization" : `Bearer ${token}`} })
                .then((resp) => {
                    setProgress(70);

                    if (resp) {
                        console.log("re sending manifest", resp)
                        setProgress(100);
                    }
                    setProgress(100);
                    toast.success("Sample manifest sent successfully to PCR Lab.", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }).catch(err => {
                     setProgress(10);
//                     toast.error("Error encountered while sending manifest", {
//                        position: toast.POSITION.TOP_RIGHT
//                     });

                     toast.success("Server currently down!!! Try sending manifest later", {
                         position: toast.POSITION.TOP_CENTER
                     });
                     setProgress(0);
                     setFailed(true);
                })
         }catch(err) {
            setProgress(10);
            toast.error("Error encountered while sending manifest", {
                position: toast.POSITION.TOP_RIGHT
            });
            setFailed(true);
         }
    }

    const handleProgress = (progessCount) => {
        setProgress(progessCount)
    }

    const handleFailure = (status) => {
        setFailed(!failed)
    }

  return (
      <>
        <Card>
            <CardBody>
             <br/>
             <Alert severity="info"><b>Tip: &nbsp;&nbsp; </b>Kindly fill the manifest form correctly before going to the next page. &nbsp;&nbsp;&nbsp;&nbsp;</Alert>
             { progress !== 0 ?
                <>
                <span>Sending manifest to PCR Lab</span>
                <ProgressBar value={progress} />
                </>
                : " "
             }
              <br/>
             { localStore.length === 0 ?
                <Alert severity="error" style={{width:'100%',fontSize:'18px', textAlign: 'center'}}>
                  <b>Manifest</b> has no sample logged. pls use the previous button to add samples.
                </Alert>
              :
                <Form>
                    <Row>
                        <Col> <FormGroup>
                         <Label for="dateScheduledForPickup" className={classes.label}>Date & Time *</Label>
                         <Input
                             type="datetime-local"
                             max={new Date().toISOString().substr(0, 16)}
                             name="dateScheduledForPickup"
                             id="dateScheduledForPickup"
                             placeholder="Date & Time Created"
                             className={classes.input}
                             value={manifestData.dateScheduledForPickup}
                             onChange={handleChange}

                         />

                             {errors.dateScheduledForPickup !="" ? (
                               <span className={classes.error}>{errors.dateScheduledForPickup}</span>
                             ) : "" }
                     </FormGroup></Col>
                        <Col><FormGroup>
                         <Label for="receivingLabName" className={classes.label}>Receiving Lab *</Label>
                         <select
                             className="form-control"
                             style={{
                              border: "1px solid #014d88",
                              borderRadius:'0px',
                              fontSize:'14px',
                              color:'#000'
                              }}
                             name="receivingLabName"
                             value={pcrLabCode.name}
                             id="receivingLabName"
                             onChange={handleChange}
                         >
                           <option>
                             Select PCR Lab
                           </option>
                           {pcr_lab.map((value, i) =>
                           <option key={i} value={value.name} >{value.name}</option>)}
                         </select>

                          {errors.receivingLabName !="" ? (
                            <span className={classes.error}>{errors.receivingLabName}</span>
                          ) : "" }
                     </FormGroup></Col>
                        <Col> <FormGroup>
                          <Label for="receivingLabID" className={classes.label}>Receiving Lab number *</Label>
                          <Input
                              type="text"
                              name="receivingLabID"
                              value={pcrLabCode.labNo}
                              id="receivingLabID"
                              onChange={handleChange}
                              className={classes.input}
                              disabled
                          />
                       {errors.receivingLabID !="" ? (
                          <span className={classes.error}>{errors.receivingLabID}</span>
                        ) : "" }
                      </FormGroup></Col>
                    </Row>
                     <Row>
                        <Col><FormGroup>
                         <Label for="courierRiderName" className={classes.label}>Courier Name *</Label>
                         <Input
                             type="text"
                             name="courierRiderName"
                             id="courierRiderName"
                             value={manifestData.courierRiderName}
                             onChange={handleChange}
                             className={classes.input}
                         />
                      {errors.courierRiderName !="" ? (
                           <span className={classes.error}>{errors.courierRiderName}</span>
                         ) : "" }
                     </FormGroup></Col>
                        <Col> <FormGroup>
                         <Label for="courierContact" className={classes.label}>Courier Contact *</Label>
                         <PhoneInput
                             containerStyle={{width:'100%', border: "1px solid #014d88"}}
                             inputStyle={{width:'100%',borderRadius:'0px', height: 44}}
                             country={'ng'}
                             masks={{ng: '...-...-....', at: '(....) ...-....'}}
                             placeholder="(234)7099999999"
                             value={manifestData.courierContact}
                             onChange={ e => checkPhoneNumber(e)}
                         />
                        {errors.courierContact !="" ? (
                           <span className={classes.error}>{errors.courierContact}</span>
                         ) : "" }
                     </FormGroup></Col>
                        <Col><FormGroup>
                      <Label for="samplePackagedBy" className={classes.label}>Sample Packaged By *</Label>
                      <Input
                          type="text"
                          name="samplePackagedBy"
                          value={manifestData.samplePackagedBy}
                          id="samplePackagedBy"
                          onChange={handleChange}
                          className={classes.input}
                      />
                       {errors.samplePackagedBy !="" ? (
                         <span className={classes.error}>{errors.samplePackagedBy}</span>
                       ) : "" }
                  </FormGroup></Col>
                    </Row>
                     <Row>
                        <Col><FormGroup>
                        <Label for="total_sample" className={classes.label}>Total Sample</Label>
                        <Input
                            type="text"
                            name="total_sample"
                            id="total_sample"
                            value={localStore.length}
                            onChange={handleChange}
                            disabled
                            className={classes.input}
                        />

                    </FormGroup></Col>
                        <Col> <FormGroup>
                        <Label for="test_type" className={classes.label}>Test type</Label>
                        <Input
                            type="text"
                            name="test_type"
                            id="test_type"
                            value="VL"
                            onChange={handleChange}
                            disabled
                            className={classes.input}
                        />

                    </FormGroup></Col>
                      <Col><FormGroup>
                           <Label for="temperatureAtPickup" className={classes.label}>Temperature at pickup (°C)</Label>
                           <Input
                               type="number"
                               name="temperatureAtPickup"
                               id="temperatureAtPickup"
                               value={manifestData.temperatureAtPickup}
                               onChange={handleChange}
                               className={classes.input}
                           />
                       {errors.temperatureAtPickup !="" ? (
                          <span className={classes.error}>{errors.temperatureAtPickup}</span>
                        ) : "" }
                       </FormGroup></Col>
                    </Row>
                    {
                        !saved ?
                         <>
                            <Button variant="contained" color="primary" type="submit"
                            startIcon={<SaveIcon />} onClick={handleSubmit}>
                              Save
                            </Button>

                        </> : ""
                    }
                    {" "}
                    {
                        failed ?
                         <>
                            <Button variant="contained" color="secondary" type="submit"
                            startIcon={<SendIcon />} onClick={resendManifest}>
                              Re-Send
                            </Button>

                        </> : ""
                    }
                </Form>
                 }
             </CardBody>
        </Card>
        { open ?
        <ConfigModal modalstatus={open} togglestatus={toggleModal}
        manifestsId={manifestsId} saved={saved} handleProgress={handleProgress}
        handleFailure={handleFailure} submitted={confirmStatusSubmitted}/> : " "}
      </>
  );
}

export default CreateAManifest;