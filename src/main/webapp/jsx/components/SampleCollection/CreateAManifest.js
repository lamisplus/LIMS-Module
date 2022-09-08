import React, {useEffect, useCallback, useState} from 'react';
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import ConfigModal from './ConfigModal';
import Alert from 'react-bootstrap/Alert';

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
        border:'2px solid #014d88',
        borderRadius:'0px',
        fontSize:'16px',
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
        fontSize:'16px',
        color:'rgb(153, 46, 98)',
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
    const [validate, setValidate] = useState({
        dateScheduledForPickupSucess: false,
        dateScheduledForPickupFail: false,
        temperatureAtPickup: false,
        receivingLabID: "",
        receivingLabName: "",
        courierRiderName: "",
        courierContact: ""
    })

    const [open, setOpen] = useState(false)

    const handleOpen = () => setOpen(true);

    const toggleModal = () => setOpen(!open)

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

   const validateInputs = (manifestData) => {
        //console.log("mani",manifestData)
        if (manifestData.dateScheduledForPickup.length === 0) {
            validate.dateScheduledForPickupFail = true;
        }

        setValidate({validate})
       //console.log("after",validate)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        validateInputs(manifestData)

        console.log("xxx",manifestData);

        if (manifestData.dateScheduledForPickup.length === 0) {
             toast.error("Sample Pick up date can not be empty", {
                position: toast.POSITION.TOP_RIGHT
             });
        }

        if ( manifestData.receivingLabName.length === 0) {
             toast.error("Receiving lab can not be empty", {
                position: toast.POSITION.TOP_RIGHT
             });
        }
        else{
               await axios.post(`${url}lims/manifests`, manifestData,
                { headers: {"Authorization" : `Bearer ${token}`}}).then(resp => {
                    setManifestsId(resp.data.id)
                     console.log("response", resp)
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

  return (
      <>
        <Card>
            <CardBody>
             <br/>
             { localStore.length === 0 ?
                <Alert variant='danger' style={{width:'100%',fontSize:'18px', textAlign: 'center'}}>
                  <b>Manifest</b> has no sample logged. pls use the previous button to add samples.
                </Alert>
              :
                <Form>
                    <Row>
                        <Col> <FormGroup>
                         <Label for="dateScheduledForPickup" className={classes.label}>Date & Time *</Label>
                         <Input
                             type="datetime-local"
                             name="dateScheduledForPickup"
                             id="dateScheduledForPickup"
                             placeholder="Date & Time Created"
                             className={classes.input}
                             value={manifestData.dateScheduledForPickup}
                             onChange={handleChange}

                         />
                          <FormText>Pick up date is a required field.</FormText>
                     </FormGroup></Col>
                        <Col><FormGroup>
                         <Label for="receivingLabName" className={classes.label}>Receiving Lab *</Label>
                         <Input
                             type="select"
                             name="receivingLabName"
                             value={pcrLabCode.name}
                             id="receivingLabName"
                             onChange={handleChange}
                             className={classes.input}
                         >
                           <option>
                             Select PCR Lab
                           </option>
                           {pcr_lab.map((value, i) =>
                           <option key={i} value={value.name} >{value.name}</option>)}
                         </Input>
                         <FormText>Receiving lab is a required field.</FormText>
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
                      <FormText>Receiving lab Id is a required field.</FormText>
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
                     <FormText>Courier name is a required field.</FormText>
                     </FormGroup></Col>
                        <Col> <FormGroup>
                         <Label for="courierContact" className={classes.label}>Courier Contact *</Label>
                         <Input
                             type="text"
                             name="courierContact"
                             value={manifestData.courierContact}
                             id="courierContact"
                             onChange={handleChange}
                             className={classes.input}
                         />
                         <FormText>Courier contact is a required field.</FormText>
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
                      <FormText>Sample package by is a required field.</FormText>
                  </FormGroup></Col>
                    </Row>
                     <Row>
                        <Col> <FormGroup>
                         <Label for="manifest_status" className={classes.label}>Status</Label>
                         <Input
                             type="text"
                             name="manifestStatus"
                             id="manifestStatus"
                             value={status}
                             onChange={handleChange}
                             disabled
                             className={classes.input}
                         />

                     </FormGroup></Col>
                        <Col><FormGroup>
                       <Label for="temperatureAtPickup" className={classes.label}>Temperature at pickup</Label>
                       <Input
                           type="text"
                           name="temperatureAtPickup"
                           id="temperatureAtPickup"
                           value={manifestData.temperatureAtPickup}
                           onChange={handleChange}
                           className={classes.input}
                       />
                   <FormText>Temperature at pickup is a required.</FormText>
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
                </Form>
                 }
             </CardBody>
        </Card>
        { open ?
        <ConfigModal modalstatus={open} togglestatus={toggleModal} manifestsId={manifestsId} saved={saved} /> : " "}
      </>
  );
}

export default CreateAManifest;