import React, {useEffect, useCallback, useState, useRef, forwardRef} from 'react';
import Container from '@mui/material/Container';
import { Link, useHistory } from 'react-router-dom'
import { Row, Col, Card, Table } from "react-bootstrap";
import MaterialTable from 'material-table';
import MatButton from '@material-ui/core/Button';
import HomeIcon from '@mui/icons-material/Home';
import SaveIcon from '@material-ui/icons/Save'
import Alert from 'react-bootstrap/Alert';

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
    const permissions = history.location && history.location.state ? history.location.state.permissions : []
    //console.log("maniObj",manifestObj)
    //console.log("permissions",permissions)
    const classes = useStyles();
    const [loading, setLoading] = useState(true)
    const [results, setResults] = useState({
         manifestID: manifestObj.manifestID,
         receivingFacilityID: manifestObj.receivingLabID,
         receivingFacilityName: manifestObj.receivingLabName,
         sendingPCRLabID: manifestObj.sendingFacilityID,
         sendingPCRLabName: manifestObj.sendingFacilityName,
         testType: "Viral Load",
         samples: []
    })

    const [inputFields, setInputFields] = useState([{
        testResult: "",
        resultDate: "",
        pcrLabSampleNumber: "",
        approvalDate: "",
        assayDate: "",
        sampleTestable: "",
        sampleStatus: "",
        sampleID: ""
    }])

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

     const handleChange = (i, event) => {
           let data = [...inputFields]
           const { name, value } = event.target
           //console.log(value)
           data[i][name] = value
           setResults({ ...results, samples: data})
     }

     const handleSubmit = async (e) => {
         e.preventDefault()
        console.log(results)
        history.push("/");
     }

  return (
    <div>
      <Card>
         <Card.Body>

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
           <hr />
           <Form>
                 <Alert style={{width:'100%',fontSize:'16px', backgroundColor: '#014d88', color: "#fff", textAlign: 'center'}}>
                        <Alert.Heading>Basic Manifest Information</Alert.Heading>
                 </Alert>
                <Row>
                  <Col> <FormGroup>
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
                   </FormGroup></Col>
                  <Col><FormGroup>
                   <Label for="testType" className={classes.label}>Test Type</Label>

                   <Input
                       type="text"
                       name="testType"
                       id="testType"
                       placeholder="Test Type"
                       className={classes.input}
                       onChange={handleChange}
                       value="Viral Load  "
                   />
               </FormGroup></Col>
                  <Col></Col>
                  <Col></Col>
                </Row>
              <Row>
                <Col><FormGroup>
                     <Label for="sendingPCRLabName" className={classes.label}>Facility</Label>

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
                 </FormGroup></Col>
                <Col><FormGroup>
                     <Label for="sendingPCRLabID" className={classes.label}>Facility ID</Label>

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
                 </FormGroup></Col>
                <Col> <FormGroup>
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
                 </FormGroup></Col>
                <Col><FormGroup>
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
                 </FormGroup></Col>
              </Row>
              <br />
                <Alert style={{width:'100%',fontSize:'16px', backgroundColor: '#992E62', color: "#fff", textAlign: 'center'}}>
                  <Alert.Heading>PCR Sample Details</Alert.Heading>
               </Alert>
               {
                    inputFields.map((data, i) => (
                    <>
                          <Row>
                            <Col>  <FormGroup>
                                 <Label for="sampleID" className={classes.label}>Sample ID *</Label>
                                 <Input
                                     type="text"
                                     name="sampleID"
                                     id="sampleID"
                                     placeholder="Sample ID"
                                     className={classes.input}
                                     //value={data.sampleID}
                                     onChange={ e => handleChange(i, e)}
                                     //disabled
                                 />
                             </FormGroup></Col>
                            <Col><FormGroup>
                                 <Label for="sampleStatus" className={classes.label}>Sample Status *</Label>
                                 <Input
                                     type="text"
                                     name="sampleStatus"
                                     id="sampleStatus"
                                     placeholder="Sample Status"
                                     className={classes.input}
                                     onChange={e => handleChange(i, e)}
                                 />
                             </FormGroup></Col>
                            <Col><FormGroup>
                                 <Label for="surName" className={classes.label}>Sample Testable *</Label>

                                 <Input
                                     type="text"
                                     name="sampleTestable"
                                     id="sampleTestable"
                                     placeholder="Sample Testable"
                                     className={classes.input}
                                     onChange={e => handleChange(i, e)}
                                 />
                             </FormGroup></Col>
                            <Col> <FormGroup>
                                 <Label for="assayDate" className={classes.label}>Assay Date *</Label>

                                 <Input
                                     type="date"
                                     name="assayDate"
                                     id="assayDate"
                                     placeholder="Assay Date"
                                     className={classes.input}
                                     onChange={e => handleChange(i, e)}
                                 />
                             </FormGroup></Col>
                          </Row>
                        <Row>
                          <Col>
                             <FormGroup>
                                 <Label for="approvalDate" className={classes.label}>Approval Date *</Label>

                                 <Input
                                     type="date"
                                     name="approvalDate"
                                     id="approvalDate"
                                     placeholder="Approval Date"
                                     className={classes.input}
                                     onChange={e => handleChange(i, e)}
                                 />
                             </FormGroup></Col>
                          <Col><FormGroup>
                             <Label for="pcrLabSampleNumber" className={classes.label}>Pcr Lab Sample No *</Label>

                             <Input
                                 type="text"
                                 name="pcrLabSampleNumber"
                                 id="pcrLabSampleNumber"
                                 placeholder="Pcr Lab Sample Number"
                                 className={classes.input}
                                 onChange={e => handleChange(i, e)}
                             />
                         </FormGroup></Col>
                          <Col><FormGroup>
                             <Label for="resultDate" className={classes.label}>Result Date *</Label>

                             <Input
                                 type="date"
                                 name="resultDate"
                                 id="resultDate"
                                 placeholder="result Date"
                                 className={classes.input}
                                 onChange={e => handleChange(i, e)}
                             />
                         </FormGroup></Col>
                          <Col><FormGroup>
                             <Label for="testResult" className={classes.label}>Test result *</Label>

                             <Input
                                 type="text"
                                 name="testResult"
                                 id="testResult"
                                 placeholder="Test result"
                                 className={classes.input}
                                 onChange={e => handleChange(i, e)}
                             />
                         </FormGroup></Col>
                        </Row>
                    </>
                    ))
               }
                <hr />
                { permissions.includes("all_permission") ? <Button variant="contained" color="primary" type="submit"
                                                                               startIcon={<SaveIcon />} onClick={handleSubmit} >
                                                                             Save Result
                                                                           </Button> : " "}
           </Form>

         </Card.Body>
       </Card>
    </div>
  );
}

export default AddResult;