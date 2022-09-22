import React, { useState, useEffect } from "react";
import {Modal,ModalHeader, ModalBody,Form,FormFeedback,Row,Alert,Col,Input,FormGroup,Label,Card,CardBody,} from "reactstrap";
import axios from "axios";
import {format} from "date-fns";
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
    const { manifestObj, reload } = props

    const sampleIDs = []
    manifestObj.sampleInformation.map((e) => {
        sampleIDs.push(e.sampleID)
    })

    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(true);
    const onDismiss = () => setVisible(false);
    const [samples, setSamples] = useState({});
    const [optionsample, setOptionsample] = useState([]);
    const [saveButtonStatus, setSaveButtonStatus] = useState(false);

    const [errors, setErrors] = useState({});
    const [inputFields, setInputFields] = useState({
            manifestRecordID: manifestObj.id,
            //id: 0,
            dateResultDispatched: "",
            dateSampleReceivedAtPcrLab: "",
            testResult: "",
            resultDate: "",
            pcrLabSampleNumber: "",
            approvalDate: "",
            assayDate: "",
            sampleTestable: "",
            sampleStatus: "",
            sampleID: "",
            uuid: "",
            visitDate: format(new Date(), 'yyyy-MM-dd'),
    })

    useEffect(() => {

    }, []);

    const handleChange = (event) => {
           const { name, value } = event.target
           setInputFields({ ...inputFields, [name]: value})
     }

    const saveSample = async (e) => {
        e.preventDefault();

         try {
             //console.log(inputFields)

              await axios.post(`${url}lims/results`, [inputFields],
                 { headers: {"Authorization" : `Bearer ${token}`}}).then(resp => {
                     console.log("results", resp)

                     toast.success("PCR Sample results added successfully!!", {
                         position: toast.POSITION.TOP_RIGHT
                     });

                      setInputFields({
                          dateResultDispatched: "",
                          dateSampleReceivedAtPcrLab: "",
                          testResult: "",
                          resultDate: "",
                          pcrLabSampleNumber: "",
                          approvalDate: "",
                          assayDate: "",
                          sampleTestable: "",
                          sampleStatus: "",
                          sampleID: "",
                          uuid: "",
                          visitDate: format(new Date(), 'yyyy-MM-dd'),
                      })
                 });
             //history.push("/");
             props.togglestatus();
             reload();
         } catch (e) {
            toast.error("An error occurred while adding PCR Sample results", {
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
                                        <Col><FormGroup>
                                            <Label for="dateResultDispatched" className={classes.label}>Date Result Dispatched *</Label>

                                            <Input
                                                type="date"
                                                name="dateResultDispatched"
                                                id="dateResultDispatched"
                                                max={new Date().toISOString().slice(0, 10)}
                                                className={classes.input}
                                                onChange={handleChange}
                                                value={inputFields.dateResultDispatched}
                                            />
                                        </FormGroup></Col>
                                       <Col><FormGroup>
                                        <Label for="dateSampleReceivedAtPcrLab" className={classes.label}>Date Sample Received at PCR Lab *</Label>

                                        <Input
                                            type="date"
                                            name="dateSampleReceivedAtPcrLab"
                                            id="dateSampleReceivedAtPcrLab"
                                            max={new Date().toISOString().slice(0, 10)}
                                            className={classes.input}
                                            onChange={handleChange}
                                            value={inputFields.dateSampleReceivedAtPcrLab}
                                        />
                                    </FormGroup></Col>
                                </Row>
                                <Row>
                                    <Col>
                                      <FormGroup>
                                            <Label for="sampleID" className={classes.label}>Sample ID *</Label>
                                            <Input
                                                type="select"
                                                name="sampleID"
                                                id="sampleID"
                                                className={classes.input}
                                                onChange={ e => handleChange(e)}
                                                value={inputFields.sampleID}
                                            >
                                             <option hidden>
                                                 Select Sample Id
                                             </option>
                                             { sampleIDs && sampleIDs.map((sample, i) =>
                                             <option key={i} value={sample} >{sample}</option>)}
                                            </Input>
                                        </FormGroup>
                                     </Col>
                                    <Col>
                                       <FormGroup>
                                             <Label for="sampleStatus" className={classes.label}>Sample Status *</Label>
                                             <Input
                                                 type="select"
                                                 name="sampleStatus"
                                                 id="sampleStatus"
                                                 className={classes.input}
                                                 onChange={ e => handleChange(e)}
                                                 value={inputFields.sampleStatus}
                                             >
                                              <option hidden>
                                                  Select Sample status
                                              </option>
                                              <option value="1" >Completed</option>
                                              <option value="2" >Rejected</option>
                                              <option value="3" >In-Progress</option>
                                              <option value="4" >Re-run</option>
                                             </Input>
                                         </FormGroup>
                                      </Col>
                                  </Row>
                                <Row>
                                   <Col>
                                    <FormGroup>
                                          <Label for="surName" className={classes.label}>Sample Testable *</Label>
                                          <Input
                                              type="select"
                                              name="sampleTestable"
                                              id="sampleTestable"
                                              className={classes.input}
                                              onChange={ e => handleChange(e)}
                                              value={inputFields.sampleTestable}
                                          >
                                           <option hidden>
                                               Is Sample Testable ?
                                           </option>
                                           <option value="true" >True</option>
                                           <option value="false" >False</option>
                                          </Input>
                                      </FormGroup>
                                   </Col>
                                    <Col> <FormGroup>
                                         <Label for="assayDate" className={classes.label}>Assay Date *</Label>

                                         <Input
                                             type="date"
                                             name="assayDate"
                                             id="assayDate"
                                             placeholder="Assay Date"
                                             max={new Date().toISOString().slice(0, 10)}
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
                                             max={new Date().toISOString().slice(0, 10)}
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
                                                max={new Date().toISOString().slice(0, 10)}
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