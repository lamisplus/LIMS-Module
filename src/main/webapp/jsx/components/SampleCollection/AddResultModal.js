import React, { useState, useEffect } from "react";
import {Modal,ModalHeader, ModalBody,Form,FormFeedback,Row,Alert,Col,Input,FormGroup,Label,Card,CardBody,} from "reactstrap";
import axios from "axios";

import MatButton from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { connect } from "react-redux";
import Chip from "@material-ui/core/Chip";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/styles.css";
import { DateTimePicker } from "react-widgets";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import moment from "moment";
import {token, url } from "../../../api";
import { Spinner } from "reactstrap";
import { toast} from "react-toastify";
import { useHistory } from 'react-router-dom';

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

const AddResultModal = (props) => {

    const history = useHistory();

    const classes = useStyles()
    const { manifestObj} = props

    const [results, setResults] = useState({
             manifestID: manifestObj.manifestID,
             receivingFacilityID: manifestObj.receivingLabID,
             receivingFacilityName: manifestObj.receivingLabName,
             sendingPCRLabID: manifestObj.sendingFacilityID,
             sendingPCRLabName: manifestObj.sendingFacilityName,
             testType: "Viral Load",
             samples: []
        })

    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(true);
    const onDismiss = () => setVisible(false);
    const [samples, setSamples] = useState({});
    const [optionsample, setOptionsample] = useState([]);
    const [saveButtonStatus, setSaveButtonStatus] = useState(false);

    const [errors, setErrors] = useState({});
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

    useEffect(() => {

    }, []);

    const handleChange = (event) => {

           const { name, value } = event.target
           setInputFields({ ...inputFields, [name]: value})
     }

    const saveSample = async (e) => {
        e.preventDefault();

         try {
             console.log(inputFields)
             history.push("/");
         } catch (e) {
            toast.error("An error occurred during sample collection", {
                 position: toast.POSITION.TOP_RIGHT
             });
         }
    };

    return (
        <div >
            <Card >
                <CardBody>
                    <Modal isOpen={props.modalstatus} toggle={props.togglestatus} className={props.className} size="lg">
                        <Form onSubmit={saveSample}>
                            <ModalHeader toggle={props.togglestatus}>Add PCR Sample Results </ModalHeader>
                            <ModalBody>
                                <Row>
                                    <Col>  <FormGroup>
                                         <Label for="sampleID" className={classes.label}>Sample ID *</Label>
                                         <Input
                                             type="text"
                                             name="sampleID"
                                             id="sampleID"
                                             placeholder="Sample ID"
                                             className={classes.input}
                                             value={inputFields.sampleID}
                                             onChange={handleChange}
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
                                             onChange={handleChange}
                                             value={inputFields.sampleStatus}
                                         />
                                     </FormGroup></Col>

                                  </Row>
                                <Row>
                                     <Col><FormGroup>
                                         <Label for="surName" className={classes.label}>Sample Testable *</Label>

                                         <Input
                                             type="text"
                                             name="sampleTestable"
                                             id="sampleTestable"
                                             placeholder="Sample Testable"
                                             className={classes.input}
                                             onChange={handleChange}
                                             value={inputFields.sampleTestable}
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
                                             onChange={handleChange}
                                             value={inputFields.assayDate}
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
                                             onChange={handleChange}
                                             value={inputFields.approvalDate}
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
                                         onChange={handleChange}
                                         value={inputFields.pcrLabSampleNumber}
                                     />
                                 </FormGroup></Col>
                                </Row>
                                <Row>
                                        <Col><FormGroup>
                                            <Label for="resultDate" className={classes.label}>Result Date *</Label>

                                            <Input
                                                type="date"
                                                name="resultDate"
                                                id="resultDate"
                                                placeholder="result Date"
                                                className={classes.input}
                                                onChange={handleChange}
                                                value={inputFields.resultDate}
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
                                            onChange={handleChange}
                                            value={inputFields.testResult}
                                        />
                                    </FormGroup></Col>
                                </Row>
                                <MatButton
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    startIcon={<SaveIcon />}
                                    disabled={loading}
                                >
                                    Save
                                </MatButton>

                                <MatButton
                                    variant="contained"
                                    color="default"
                                    onClick={props.togglestatus}
                                    className={classes.button}
                                    startIcon={<CancelIcon />}
                                >
                                    Cancel
                                </MatButton>
                            </ModalBody>
                        </Form>
                    </Modal>
                </CardBody>
            </Card>
        </div>
    );
};

export default AddResultModal;