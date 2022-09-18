import React, { useState, useEffect, useCallback } from "react";
import {Modal,ModalHeader, ModalBody,Form,FormFeedback,Row,Alert,Col,Input,FormGroup,Label,Card,CardBody,} from "reactstrap";
import axios from "axios";

import MatButton from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import SendIcon from '@mui/icons-material/Send';
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

const ConfigModal = (props) => {
    const {manifestsId} = props;
    const history = useHistory();

    const classes = useStyles()
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(true);
    const onDismiss = () => setVisible(false);
    const [config, setConfig] = useState({
        config: ""
    });

    const [saveButtonStatus, setSaveButtonStatus] = useState(false);

    const [errors, setErrors] = useState({});

    const [logins, setLogins] = useState([])

    const [configId, setConfigId] = useState(0);

    const loadResults = useCallback(async () => {
        try {
            const response = await axios.get(`${url}lims/configs`, { headers: {"Authorization" : `Bearer ${token}`} });
            //console.log("configs", response);
            setLogins(response.data)
            setLoading(false)
        } catch (e) {
            toast.error("An error occurred while fetching config details", {
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
       setConfigId(parseInt(value));
       //setConfig({ ...config, [name]: value})
       //console.log("config",config)
     }

    const saveSample = async (e) => {
        e.preventDefault();
         console.log(configId)
         setSaved(true);
    };

    const sendManifest = async (e) => {
        e.preventDefault()
        //for now
        toast.success("Sample manifest sent to PCR Lab.", {
            position: toast.POSITION.TOP_RIGHT
        });
        props.togglestatus();
         await axios.get(`${url}lims/ready-manifests/${manifestsId}/${configId}`, { headers: {"Authorization" : `Bearer ${token}`} })
            .then((resp) => {
                console.log("sending manifest", resp)
                //setSend(true)
                toast.success("Sample manifest sent successfully to PCR Lab.", {
                    position: toast.POSITION.TOP_RIGHT
                });

//                if (resp.data.errors.length > 0) {
//                    toast.error(resp.data.errors[0].reasons, {
//                        position: toast.POSITION.TOP_RIGHT
//                     });
//                     setSend(true)
//                }
//                else {
//                     toast.success("Sample manifest sent successfully to PCR Lab.", {
//                        position: toast.POSITION.TOP_RIGHT
//                    });
//                    setSend(true)
//                    setStatus("Manifest Sent");
//                }
            })
    }

    return (
        <div >
            <Card >
                <CardBody>
                    <Modal isOpen={props.modalstatus} toggle={props.togglestatus} className={props.className} size="lg">
                        <Form onSubmit={saveSample}>
                            <ModalHeader toggle={props.togglestatus}>Select PCR Server </ModalHeader>
                            <ModalBody>
                                 <Row>
                                    <Col>
                                        <FormGroup>
                                           <Label for="configName" className={classes.label}>Configuration Setting</Label>
                                           <Input
                                               type="select"
                                               name="config"
                                               id="config"
                                               className={classes.input}
                                               onChange={handleChange}
                                           >
                                            <option hidden>
                                                Which server are you sending to?
                                            </option>
                                            { logins && logins.map((data, i) => (
                                                <option key={i} value={data.id}>
                                                    {data.configName}
                                                </option>
                                            ))}
                                           </Input>
                                       </FormGroup>
                                    </Col>
                                    <Col></Col>
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

                                {" "}
                                <MatButton variant="contained" color="secondary" startIcon={<SendIcon />}
                                type="submit" onClick={sendManifest} disabled={saved ? false : true}>
                                  Send
                                </MatButton>

                            </ModalBody>
                        </Form>
                    </Modal>
                </CardBody>
            </Card>
        </div>
    );
};

export default ConfigModal;