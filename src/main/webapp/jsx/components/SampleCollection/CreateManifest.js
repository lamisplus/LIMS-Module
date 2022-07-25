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
    Label,Card, CardBody, Table
} from 'reactstrap';

import "./sample.css";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import SendIcon from '@mui/icons-material/Send';
import PrintIcon from '@mui/icons-material/Print';

import { forwardRef } from 'react';
import axios from "axios";
import { toast } from 'react-toastify';
import {token, url } from "../../../api";

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
    const [manifestData, setManifestData] =  useState({
        dateScheduledForPickup: "",
        receivingLabName: "",
        receivingLabID: "",
        courierRiderName: "",
        courierContact: "",
        result_status: "Pending",
        manifest_id: `DATA.FI-${Math.random().toString(36).slice(2)}`,
        total_sample: sampleObj.length,
        test_type: "VL",
        comment: "",
        samples: sampleObj,
        samplePackagedBy: "",
        sendingFacilityID: "",
        sendingFacilityName: "",
        temperatureAtPickup: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
          const { name, value } = event.target
          setManifestData({ ...manifestData, [name]: value })
    }

     const validate = () => {
            let temp = { ...errors }
            setErrors({
                ...temp
            })
            return Object.values(temp).every(x => x == "")
        }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(`manifest created...${JSON.stringify(manifestData)}`)
        setSaved(true);
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
              <h2 className="text-center">Create Manifest Form</h2>
              <br />
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
                                <Label for="receivingLabName" className={classes.label}>Destination *</Label>
                                <Input
                                    type="text"
                                    name="receivingLabName"
                                    value={manifestData.receivingLabName}
                                    id="receivingLabName"
                                    onChange={handleChange}
                                    className={classes.input}
                                />

                            </FormGroup>
                        </div>
                         <div className="form-group mb-3 col-md-3">
                            <FormGroup>
                                <Label for="receivingLabID" className={classes.label}>PCR Lab number *</Label>
                                <Input
                                    type="text"
                                    name="receivingLabID"
                                    value={manifestData.receivingLabID}
                                    id="receivingLabID"
                                    onChange={handleChange}
                                    className={classes.input}

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
                                    <Label for="samplePackagedBy" className={classes.label}>Packaged By</Label>
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
                                <Label for="result_status" className={classes.label}>Result status</Label>
                                <Input
                                    type="text"
                                    name="result_status"
                                    id="result_status"
                                    value={manifestData.result_status}
                                    onChange={handleChange}
                                    disabled={true}
                                    className={classes.input}
                                />

                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                                <Label for="manifest_id" className={classes.label}>Manifest Id</Label>
                                <Input
                                    type="text"
                                    name="manifest_id"
                                    id="manifest_id"
                                    value={manifestData.manifest_id}
                                    onChange={handleChange}
                                    disabled={true}
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
                                    value={manifestData.total_sample}
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
                                    value={manifestData.test_type}
                                    onChange={handleChange}
                                    disabled={true}
                                    className={classes.input}
                                />

                            </FormGroup>
                        </div>
                             <div className="form-group mb-3 col-md-12">
                                <FormGroup>
                                    <Label for="comment" className={classes.label}>Comments</Label>
                                    <Input
                                        type="textarea"
                                        name="comment"
                                        id="comment"
                                        row="40"
                                        style={{ minHeight: 100, fontSize: 14 }}
                                        value={manifestData.comment}
                                        onChange={handleChange}
                                        className={classes.input}
                                    ></Input>
                                </FormGroup>
                            </div>
                            <br />
                            { saved !== true ?
                            <div>
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
                                    { sampleObj && sampleObj.map((data) => (
                                         <tr>
                                            <th scope="row">{data.FacilityName}</th>
                                            <td>{data.patientId}</td>
                                            <td>{data.sampleId}</td>
                                            <td>{data.sampleType}</td>
                                            <td>{data.datecollected}</td>
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
                        type="submit"
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        startIcon={<SendIcon />}

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