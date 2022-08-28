import React, {useEffect, useCallback, useState, useRef, forwardRef} from 'react';
import Container from '@mui/material/Container';
import { Link, useHistory } from 'react-router-dom'
import { Row, Col, Card, Table } from "react-bootstrap";
import MaterialTable from 'material-table';
import MatButton from '@material-ui/core/Button';
import HomeIcon from '@mui/icons-material/Home';
import SaveIcon from '@material-ui/icons/Save'

import { CardBody,
    Form, FormFeedback, FormGroup, FormText,
    Input,
    Label, Badge
} from 'reactstrap';

import "./sample.css";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import axios from "axios";
import { toast } from 'react-toastify';
import {token, url } from "../../../api";

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { makeStyles } from '@material-ui/core/styles'

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

const AddResult = (props) => {
    let history = useHistory();
    const manifestObj = history.location && history.location.state ? history.location.state.manifestObj : {}
    console.log("maniObj",manifestObj)
    const classes = useStyles();
    const [loading, setLoading] = useState(true)
    const [results, setResults] = useState({})

     const loadResults = useCallback(async () => {
        try {

            setLoading(false)

        } catch (e) {
            toast.error("An error occurred while fetching lab", {
                position: toast.POSITION.TOP_RIGHT
            });
            setLoading(false)
        }
    }, []);

    useEffect(() => {
        loadResults()
    }, [loadResults]);

     const handleChange = (event) => {
           const { name, value } = event.target
           setResults({ ...results, [name]: value})
     }

     const handleSubmit = async (e) => {
         e.preventDefault()

     }

  return (
    <div>
      <Card>
         <Card.Body>
         <h2>Add PCR Sample Results</h2>
          <p style={{textAlign: 'right'}}>
          <Link color="inherit"
            to={{pathname: "/"}}
             >
            <MatButton
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<HomeIcon />}>
                back Home
            </MatButton>
           </Link>
          </p>
         <br/>
           <hr />
            <form>
                <Table bordered size="sm">
                    <tbody>
                      <tr>
                        <td>
                            <FormGroup>
                                <Label for="manifestID" className={classes.label}>Manifest Id</Label>

                                <Input
                                    type="text"
                                    name="manifestID"
                                    id="manifestID"
                                    placeholder="manifest ID"
                                    className={classes.input}
                                    onChange={handleChange}
                                    value={manifestObj.manifestID}
                                    disabled
                                />
                            </FormGroup>
                        </td>

                         <td>
                            <FormGroup>
                                <Label for="receivingFacilityID" className={classes.label}>Receiving Facility ID</Label>

                                <Input
                                    type="text"
                                    name="receivingFacilityID"
                                    id="receivingFacilityID"
                                    placeholder="Receiving Facility ID"
                                    className={classes.input}
                                    onChange={handleChange}
                                    value={manifestObj.receivingLabID}
                                    disabled
                                />
                            </FormGroup>
                        </td>
                         <td>
                            <FormGroup>
                                <Label for="receivingFacilityName" className={classes.label}>Receiving Facility</Label>

                                <Input
                                    type="text"
                                    name="receivingFacilityName"
                                    id="receivingFacilityName"
                                    placeholder="Receiving Facility Name"
                                    className={classes.input}
                                    onChange={handleChange}
                                    value={manifestObj.receivingLabName}
                                    disabled
                                />
                            </FormGroup>
                        </td>

                         <td>
                            <FormGroup>
                                <Label for="sendingPCRLabID" className={classes.label}>Sending PCR Lab ID</Label>

                                <Input
                                    type="text"
                                    name="sendingPCRLabID"
                                    id="sendingPCRLabID"
                                    placeholder="Sending PCR Lab ID"
                                    className={classes.input}
                                    onChange={handleChange}
                                    value={manifestObj.sendingFacilityID}
                                    disabled
                                />
                            </FormGroup>
                        </td>
                          <td>
                            <FormGroup>
                                <Label for="sendingPCRLabName" className={classes.label}>Sending PCR Lab</Label>

                                <Input
                                    type="text"
                                    name="sendingPCRLabName"
                                    id="sendingPCRLabName"
                                    placeholder="Sending PCR LabName"
                                    className={classes.input}
                                    onChange={handleChange}
                                    value={manifestObj.sendingFacilityName}
                                    disabled
                                />
                            </FormGroup>
                        </td>

                         <td>
                            <FormGroup>
                                <Label for="testType" className={classes.label}>Test Type *</Label>

                                <Input
                                    type="text"
                                    name="testType"
                                    id="testType"
                                    placeholder="Test Type"
                                    className={classes.input}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </td>
                      </tr>
                      {manifestObj.sampleInformation && manifestObj.sampleInformation.map((data) => (
                        <tr>
                             <td>
                                <FormGroup>
                                    <Label for="sampleID" className={classes.label}>Sample ID</Label>

                                    <Input
                                        type="text"
                                        name="sampleID"
                                        id="sampleID"
                                        placeholder="Sample ID"
                                        className={classes.input}
                                        onChange={handleChange}
                                        value={data.sampleID}
                                        disabled
                                    />
                                </FormGroup>
                            </td>
                             <td>
                                <FormGroup>
                                    <Label for="sampleStatus" className={classes.label}>Sample Status *</Label>

                                    <Input
                                        type="text"
                                        name="sampleStatus"
                                        id="sampleStatus"
                                        placeholder="Sample Status"
                                        className={classes.input}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </td>
                            <td>
                                <FormGroup>
                                    <Label for="surName" className={classes.label}>Sample Testable *</Label>

                                    <Input
                                        type="text"
                                        name="sampleTestable"
                                        id="sampleTestable"
                                        placeholder="Sample Testable"
                                        className={classes.input}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </td>
                            <td>
                                <FormGroup>
                                    <Label for="assayDate" className={classes.label}>Assay Date *</Label>

                                    <Input
                                        type="text"
                                        name="assayDate"
                                        id="assayDate"
                                        placeholder="Assay Date"
                                        className={classes.input}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </td>
                             <td>
                                <FormGroup>
                                    <Label for="approvalDate" className={classes.label}>Approval Date *</Label>

                                    <Input
                                        type="text"
                                        name="approvalDate"
                                        id="approvalDate"
                                        placeholder="Approval Date"
                                        className={classes.input}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </td>
                             <td>
                                <FormGroup>
                                    <Label for="pcrLabSampleNumber" className={classes.label}>Pcr Lab Sample No *</Label>

                                    <Input
                                        type="text"
                                        name="pcrLabSampleNumber"
                                        id="pcrLabSampleNumber"
                                        placeholder="Pcr Lab Sample Number"
                                        className={classes.input}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </td>
                             <td>
                                <FormGroup>
                                    <Label for="resultDate" className={classes.label}>Result Date *</Label>

                                    <Input
                                        type="text"
                                        name="resultDate"
                                        id="resultDate"
                                        placeholder="result Date"
                                        className={classes.input}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </td>
                              <td>
                                <FormGroup>
                                    <Label for="testResult" className={classes.label}>Test result *</Label>

                                    <Input
                                        type="text"
                                        name="testResult"
                                        id="testResult"
                                        placeholder="Test result"
                                        className={classes.input}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </td>
                          </tr>
                      ))}

                    </tbody>
                </Table>
                <hr />
                <Button variant="contained" color="primary" type="submit"
                    startIcon={<SaveIcon />} onClick={handleSubmit} >
                  Save Result
                </Button>
            </form>
         </Card.Body>
       </Card>
    </div>
  );
}

export default AddResult;