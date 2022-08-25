import React, {useEffect, useCallback, useState} from 'react';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import "./sample.css";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import {format} from "date-fns";

import {  Modal, ModalHeader, ModalBody,
    Col, Card, CardBody, Table,
    Form, FormFeedback, FormGroup, FormText,
    Input,
    Label, Badge
} from 'reactstrap';

import { forwardRef } from 'react';
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

    useEffect(() => {
      const collectedSamples = JSON.parse(localStorage.getItem('samples'));
      if (collectedSamples) {
        SetLocalStore(collectedSamples);
      }
    }, []);

    const [pcrLabCode, setPcrLabCode] = useState({ name: "", labNo: ""});

    const [manifestData, setManifestData] = useState({
         token: "",
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
                });
        }
    }

    const sendManifest = async (e) => {
        e.preventDefault()
         await axios.get(`${url}lims/ready-manifests/${manifestsId}`, { headers: {"Authorization" : `Bearer ${token}`} })
            .then((resp) => {
                console.log("sending manifest", resp)

                if (resp.data.errors.length > 0) {
                    toast.error(resp.data.errors[0].reasons, {
                        position: toast.POSITION.TOP_RIGHT
                     });
                     setSend(true)
                }
                else {
                     toast.success("Sample manifest sent successfully to PCR Lab.", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    setSend(true)
                    setStatus("Manifest Sent");
                }
            })
    }

  return (
      <>
        <Card>
            <CardBody>
             <br/>
                <Form>
                    <Box sx={{ flexGrow: 1 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6} md={4}>
                            <FormGroup>
                                <Label for="dateScheduledForPickup" className={classes.label}>Date & Time *</Label>

                                <Input
                                    type="datetime-local"
                                    name="dateScheduledForPickup"
                                    id="dateScheduledForPickup"
                                    placeholder="Date & Time Created"
                                    className={classes.input}
                                    invalid={manifestData.dateScheduledForPickup.length === 0? true: false}
                                    value={manifestData.dateScheduledForPickup}
                                    onChange={handleChange}
                                />
                                <FormFeedback>
                                  Pick up date is a required field
                                </FormFeedback>
                            </FormGroup>
                        </Grid>
                        <Grid item xs={6} md={4}>
                             <FormGroup>
                                <Label for="receivingLabName" className={classes.label}>Receiving Lab *</Label>
                                <Input
                                    type="select"
                                    name="select"
                                    value={pcrLabCode.name}
                                    id="receivingLabName"
                                    onChange={handleChange}
                                    className={classes.input}
                                    invalid={pcrLabCode.name.length === 0? true: false}
                                >
                                  <option>
                                    Selcet PCR Lab
                                  </option>
                                  {pcr_lab.map((value, i) =>
                                  <option key={i} value={value.name} >{value.name}</option>)}
                                </Input>
                                <FormFeedback>Receiving lab is a required field</FormFeedback>
                            </FormGroup>
                        </Grid>
                        <Grid item xs={6} md={4}>
                             <FormGroup>
                                 <Label for="receivingLabID" className={classes.label}>Receiving Lab number *</Label>
                                 <Input
                                     type="text"
                                     name="receivingLabID"
                                     value={pcrLabCode.labNo}
                                     id="receivingLabID"
                                     onChange={handleChange}
                                     className={classes.input}
                                     disabled
                                     invalid={pcrLabCode.labNo.length === 0? true: false}
                                 />
                             <FormFeedback>Receiving lab Id is a required field</FormFeedback>
                             </FormGroup>
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <FormGroup>
                                <Label for="courierRiderName" className={classes.label}>Courier Name *</Label>
                                <Input
                                    type="text"
                                    name="courierRiderName"
                                    id="courierRiderName"
                                    value={manifestData.courierRiderName}
                                    onChange={handleChange}
                                    className={classes.input}
                                    invalid={manifestData.courierRiderName.length === 0? true: false}
                                />
                            <FormFeedback>Courier name is a required field</FormFeedback>
                            </FormGroup>
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <FormGroup>
                                <Label for="courierContact" className={classes.label}>Courier Contact *</Label>
                                <Input
                                    type="text"
                                    name="courierContact"
                                    value={manifestData.courierContact}
                                    id="courierContact"
                                    onChange={handleChange}
                                    className={classes.input}
                                    invalid={manifestData.courierContact.length === 0? true: false}
                                />
                                <FormFeedback>Courier contact is a required field</FormFeedback>
                            </FormGroup>
                         </Grid>
                         <Grid item xs={6} md={4}>
                              <FormGroup>
                                 <Label for="samplePackagedBy" className={classes.label}>Sample Packaged By *</Label>
                                 <Input
                                     type="text"
                                     name="samplePackagedBy"
                                     value={manifestData.samplePackagedBy}
                                     id="samplePackagedBy"
                                     onChange={handleChange}
                                     className={classes.input}
                                     invalid={manifestData.samplePackagedBy.length === 0? true: false}
                                 />
                                 <FormFeedback>Sample package by is a required field</FormFeedback>
                             </FormGroup>
                          </Grid>
                          <Grid item xs={6} md={6}>
                            <FormGroup>
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

                            </FormGroup>
                        </Grid>
                        <Grid item xs={6} md={6}>
                              <FormGroup>
                                  <Label for="temperatureAtPickup" className={classes.label}>Tempaerature at pickup</Label>
                                  <Input
                                      type="text"
                                      name="temperatureAtPickup"
                                      id="temperatureAtPickup"
                                      value={manifestData.temperatureAtPickup}
                                      onChange={handleChange}
                                      invalid={manifestData.temperatureAtPickup.length === 0? true: false}
                                      className={classes.input}
                                  />
                              <FormFeedback>
                                Temperature at pickup is a required
                              </FormFeedback>
                              </FormGroup>
                          </Grid>
                          <Grid item xs={6} md={6}>
                                <FormGroup>
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

                               </FormGroup>
                            </Grid>
                          <Grid item xs={6} md={6}>
                             <FormGroup>
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

                           </FormGroup>
                        </Grid>
                      </Grid>
                    </Box>
                    {
                        send ? " " :
                        <>
                            <Button variant="contained" color="primary" type="submit"
                            startIcon={<SaveIcon />} onClick={handleSubmit} disabled={!saved ? false : true}>
                              Save
                            </Button>
                            {" "}
                            <Button variant="contained" color="secondary" startIcon={<SendIcon />}
                            type="submit" onClick={sendManifest} disabled={saved ? false : true}>
                              Send
                            </Button>
                        </>
                    }
                </Form>
             </CardBody>
        </Card>
      </>
  );
}

export default CreateAManifest;