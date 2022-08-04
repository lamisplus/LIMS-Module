import React, {useEffect, useCallback, useState, useRef} from 'react';
import Container from '@mui/material/Container';
import MaterialTable from 'material-table';
import { Link, useHistory } from 'react-router-dom'
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { useReactToPrint } from 'react-to-print';
import ManifestPrint from './ManifestPrint';

import {  Modal, ModalHeader, ModalBody,
    Col,Input,
    FormGroup,
    Label,Card, CardBody, Table, Badge
} from 'reactstrap';

import "./sample.css";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import SendIcon from '@mui/icons-material/Send';
import PrintIcon from '@mui/icons-material/Print';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { pcr_lab } from './pcr';

import { forwardRef } from 'react';
import axios from "axios";
import { toast } from 'react-toastify';
import {token, url, pcrUrl } from "../../../api";

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

const CreateManifest = (props) => {
    let history = useHistory();
    const sampleObj = history.location && history.location.state ? history.location.state.sampleObj : {}
    //console.log("samples", sampleObj);
    const classes = useStyles();
    const [loading, setLoading] = useState('')
    const [collectedSamples, setCollectedSamples] = useState([])
    const [saved, setSaved] = useState(false);
    const [status, setStatus] = useState(0);
    const [pcrLabCode, setPcrLabCode] = useState({ name: "", labNo: ""});

    const [manifestData, setManifestData] = useState({
         token: "",
         manifestID: `DATA.FI-${Math.random().toString(36).slice(2)}`,
         sendingFacilityID: "",
         sendingFacilityName: "",
         receivingLabID: pcrLabCode.labNo,
         receivingLabName: pcrLabCode.name,
         dateScheduledForPickup: "",
         temperatureAtPickup: 0,
         samplePackagedBy: "",
         courierRiderName: "",
         courierContact: "",
         sampleInformation: sampleObj
     })

    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
          checkPCRLab(event.target.value)
          const { name, value } = event.target
          setManifestData({ ...manifestData, [name]: value, receivingLabID: pcrLabCode.labNo, receivingLabName: pcrLabCode.name })
    }

    const validate = () => {
            let temp = { ...errors }
            setErrors({
                ...temp
            })
            return Object.values(temp).every(x => x == "")
        }

    const checkPCRLab = (name) => {
        pcr_lab.map(( val ) => {
            if (val.name === name) {
                setPcrLabCode({name: val.name, labNo: val.labNo})
            }
        })
    }

    const sampleStatus = e =>{
        if(e===1){
            return <p><Badge  color="primary">Saved</Badge></p>
        }else if(e===2){
            return <p><Badge  color="success">Sent</Badge></p>
        }else{
            return <p><Badge  color="warning">Pending</Badge></p>
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        //console.log(`manifest created...${JSON.stringify(manifestData)}`)

           await axios.post(`${url}lims/manifests`, manifestData,
            { headers: {"Authorization" : `Bearer ${token}`}}).then(resp => {
                setLoading(!true);
                 toast.success("Sample manifest saved successfully!!", {
                    position: toast.POSITION.TOP_RIGHT
                });
                setStatus(1);
            });

        setSaved(true);
    }

    const sendManifest = async () => {
        setStatus(2)
        console.log("sent manifest", manifestData)
       const loginData = { "email": "nmrs@lims.ng", "password": "nmrs@2020!"}

      await axios.post(`${pcrUrl}/apidemo/login.php`, loginData)
      .then(res => {
        console.log(res);
        console.log(res.data);
      })
      .catch(err => console.log("PCR Lab error caught", err))
    }

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
      });

  return (
  <>
    <Container>
         <Card>
          <CardBody>
              <h2>Create Sample Manifest Form</h2>
              <p style={{textAlign: 'right'}}>
              <Link color="inherit"
                to={{pathname: "/"}}
                 >
                <MatButton
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    startIcon={<FirstPageIcon />}>
                    Back
                </MatButton>
               </Link>
              </p>
              <p>
              <b>Manifest Status:</b>
              <span>{sampleStatus(status)}</span>
              </p>
              <hr />
              <form>
               <h3>
                  PCR Details
               </h3>
               <br />
                <div className="row">
                        <div className="form-group mb-3 col-md-3">
                            <FormGroup>
                                <Label for="dateScheduledForPickup" className={classes.label}>Date & Time *</Label>

                                <Input
                                    type="datetime-local"
                                    name="dateScheduledForPickup"
                                    value={manifestData.dateScheduledForPickup}
                                    id="dateScheduledForPickup"
                                    placeholder="Date & Time Created"
                                    onChange={handleChange}
                                    className={classes.input}
                                />
                            </FormGroup>
                            {manifestData.dateScheduledForPickup === "" ? (
                                    <span className={classes.error}>{"Date Scheduled For Pickup is required.."}</span>
                                ) : ""
                            }
                        </div>
                         <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                                <Label for="receivingLabName" className={classes.label}>Receiving Lab *</Label>
                                <Input
                                    type="select"
                                    name="select"
                                    value={pcrLabCode.name}
                                    id="receivingLabName"
                                    onChange={handleChange}
                                    className={classes.input}
                                >
                                  <option>
                                    Selcet PCR Lab
                                  </option>
                                  {pcr_lab.map((value, i) =>
                                  <option key={i} value={value.name} >{value.name}</option>)}
                                </Input>
                            </FormGroup>
                        </div>
                         <div className="form-group mb-3 col-md-3">
                            <FormGroup>
                                <Label for="receivingLabID" className={classes.label}>Receiving Lab number *</Label>
                                <Input
                                    type="text"
                                    name="receivingLabID"
                                    value={pcrLabCode.labNo}
                                    id="receivingLabID"
                                    onChange={handleChange}
                                    className={classes.input}
                                    disabled={true}
                                />

                            </FormGroup>
                        </div>
                        </div>
                        <br />
                          <h3>
                            Courier Details
                          </h3>
                          <br />

                        <div className="row">
                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                    <Label for="courierRiderName" className={classes.label}>Courier Name *</Label>
                                    <Input
                                        type="text"
                                        name="courierRiderName"
                                        id="courierRiderName"
                                        value={manifestData.courierRiderName}
                                        onChange={handleChange}
                                        className={classes.input}
                                    />

                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                    <Label for="courierContact" className={classes.label}>Courier Contact *</Label>
                                    <Input
                                        type="text"
                                        name="courierContact"
                                        value={manifestData.courierContact}
                                        id="courierContact"
                                        onChange={handleChange}
                                        className={classes.input}
                                    />
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                    <Label for="samplePackagedBy" className={classes.label}>Sample Packaged By</Label>
                                    <Input
                                        type="text"
                                        name="samplePackagedBy"
                                        value={manifestData.samplePackagedBy}
                                        id="samplePackagedBy"
                                        onChange={handleChange}
                                        className={classes.input}
                                    />
                                </FormGroup>
                            </div>
                        <h3>
                          Manifest Details
                        </h3>
                        <br />
                        <br />
                        <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                                <Label for="manifest_id" className={classes.label}>Manifest Id</Label>
                                <Input
                                    type="text"
                                    name="manifestID"
                                    id="manifestID"
                                    value={manifestData.manifestID}
                                    onChange={handleChange}
                                    disabled={true}
                                    className={classes.input}
                                />

                            </FormGroup>
                        </div>
                         <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                                <Label for="temperatureAtPickup" className={classes.label}>Tempaerature at pickup</Label>
                                <Input
                                    type="text"
                                    name="temperatureAtPickup"
                                    id="temperatureAtPickup"
                                    value={manifestData.temperatureAtPickup}
                                    onChange={handleChange}
                                    disabled={false}
                                    className={classes.input}
                                />

                            </FormGroup>
                        </div>

                         <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                                <Label for="total_sample" className={classes.label}>Total Sample</Label>
                                <Input
                                    type="text"
                                    name="total_sample"
                                    id="total_sample"
                                    value={sampleObj.length}
                                    onChange={handleChange}
                                    disabled={true}
                                    className={classes.input}
                                />

                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                                <Label for="test_type" className={classes.label}>Test type</Label>
                                <Input
                                    type="text"
                                    name="test_type"
                                    id="test_type"
                                    value="VL"
                                    onChange={handleChange}
                                    disabled={true}
                                    className={classes.input}
                                />

                            </FormGroup>
                        </div>

                            { saved !== true ?
                            <div>
                               <h3>
                                  Samples collected for PCR Lab
                                </h3>
                                <br />

                                <br />
                                 <Table striped bordered hover size="sm">
                                    <thead>
                                      <tr>
                                        <th>Facility</th>
                                        <th>Patient ID</th>
                                        <th>Sample ID</th>
                                        <th>Sample Type</th>
                                        <th>Date Collected</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                    { sampleObj && sampleObj.map((data, i) => (
                                         <tr key={i}>
                                            <th scope="row">{data.FacilityName}</th>
                                            <td>{data.patientID[0].idNumber}</td>
                                            <td>{data.sampleID}</td>
                                            <td>{data.sampleType}</td>
                                            <td>{data.sampleCollectionDate}</td>
                                          </tr>
                                    ))}

                                    </tbody>
                                  </Table>
                            </div>
                            : ""}

                        <br />
                        <hr />
                        <div>
                        </div>
                    </div>
                    <MatButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        startIcon={<SaveIcon />}
                        onClick={handleSubmit}
                        disabled={!saved ? false : true}
                    >
                        Save
                    </MatButton>

                    <MatButton
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        startIcon={<SendIcon />}
                        onClick={sendManifest}
                        disabled={saved ? false : true}
                    >
                        Send
                    </MatButton>

                    <Link color="inherit"
                    to={{pathname: "/"}}
                     >
                    <MatButton
                        variant="contained"
                        color="default"
                        //onClick={toggle}
                        className={classes.button}
                        startIcon={<CancelIcon />}>
                        Cancel
                    </MatButton>
                   </Link>
                </form>
          </CardBody>
         </Card>
       { saved ? <div>
                  <MatButton
                     variant="contained"
                     color="success"
                     className={classes.button}
                     startIcon={<PrintIcon />}
                     disabled={saved ? false: true}
                     onClick={handlePrint}
                 >
                     Print
                 </MatButton>
                 <ManifestPrint sampleObj={manifestData} ref={componentRef}/>

              </div> : ""}
    </Container>


  </>
  );
}

export default CreateManifest;