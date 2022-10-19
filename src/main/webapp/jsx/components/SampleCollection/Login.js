import React, {useEffect, useCallback, useState, useRef, forwardRef} from 'react';
import Container from '@mui/material/Container';
import { Link, useHistory } from 'react-router-dom'
import { Row, Col, Card, Table } from "react-bootstrap";
import MaterialTable from 'material-table';
import MatButton from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save'
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';

import Alert from 'react-bootstrap/Alert';
import AddResultModal from './AddResultModal';

import { CardBody,
    Form, FormFeedback, FormGroup, FormText,
    Input,
    Label, Badge, Spinner
} from 'reactstrap';

import "./sample.css";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CachedIcon from '@mui/icons-material/Cached';

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

const Login = (props) => {
    let history = useHistory();
    const manifestObj = history.location && history.location.state ? history.location.state.manifestObj : {}
    //console.log("maniObj",manifestObj)
    const permissions = history.location && history.location.state ? history.location.state.permissions : []
    const [errors, setErrors] = useState({});
    const [demo, setDemo] = useState(false);

    const classes = useStyles();
    const [loading, setLoading] = useState(true)
    const [login, setLogin] = useState({
        configName: "",
        serverUrl: "",
        configEmail: "",
        configPassword: "",
        facilityId: "",
        receivingPCRLabId: ""
    })

    const [logins, setLogins] = useState([])

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
           //console.log(name, value)
           if (name === 'configName' && value === 'Demo Server') {
               setDemo(true)
           }else if (name === 'configName' && value === 'Live Server') {
               setDemo(false)
           }
           setLogin({ ...login, [name] : value})
     }

    const validateInputs = () => {
       let temp = { ...errors }
       temp.configName = login.configName ? "" : "Server Name is required."
       temp.serverUrl = login.serverUrl ? "" : "Server URL is required."
       temp.configEmail = login.configEmail ? "" : "Email is required."
       temp.configPassword = login.configPassword ? "" : "Configuration password URL is required."

        setErrors({
             ...temp
         })
         return Object.values(temp).every(x => x == "")
    }

    const handleSubmit = async (e) => {
         e.preventDefault()
         try {

           if (validateInputs()) {
             await axios.post(`${url}lims/configs`, login,
                { headers: {"Authorization" : `Bearer ${token}`}}).then(resp => {
                    console.log("login details", resp)

                    toast.success("LIMS Credentials saved successfully!!", {
                        position: toast.POSITION.TOP_RIGHT
                    });

                     setLogin({
                         configName: "",
                         serverUrl: "",
                         configEmail: "",
                         configPassword: "",
                         facilityId: "",
                         receivingPCRLabId: ""
                     })
                });

            loadResults()

           }

        } catch (e) {
            toast.error("An error occurred while saving LIMS Credentials", {
                position: toast.POSITION.TOP_RIGHT
            });
            setLoading(false)
        }
        history.push("/");
     }

    const deleteConfig = async (e, id) => {
      e.preventDefault();
        try {
            const response = await axios.delete(`${url}lims/configs/${id}`, { headers: {"Authorization" : `Bearer ${token}`} });
            console.log(" delete config", response);
            loadResults()
            toast.success("LIMS Credentials deleted successfully!!", {
                position: toast.POSITION.TOP_RIGHT
            });

        } catch (e) {
            toast.error("An error occurred while deleting a config", {
                position: toast.POSITION.TOP_RIGHT
            });
            setLoading(false)
        }
     }

  return (
    <div>
      <Card>
         <Card.Body>
             <hr />
              {
                <>
                   <Alert style={{width:'100%',fontSize:'16px', backgroundColor: '#014d88', color: "#fff", textAlign: 'center'}}>
                           <Alert.Heading>LIMS Configuration Details</Alert.Heading>
                    </Alert>

                   <Row>
                        <Col xs={6} md={4}>

                            <Form>
                                 <FormGroup>
                                   <Label for="configName" className={classes.label}>Configuration Name</Label>
                                   <select
                                       className="form-control"
                                      style={{
                                        border: "1px solid #014d88",
                                        borderRadius:'0px',
                                        fontSize:'14px',
                                        color:'#000'
                                        }}
                                       name="configName"
                                       value={login.configName}
                                       id="configName"
                                       onChange={handleChange}
                                   >
                                    <option hidden>
                                        Select Configuration Server
                                    </option>
                                    <option value="Demo Server">
                                        Demo Server
                                    </option>
                                    <option value="Live Server">
                                        Live Server
                                    </option>
                                   </select>

                                 {errors.configName !="" ? (
                                      <span className={classes.error}>{errors.configName}</span>
                                    ) : "" }
                               </FormGroup>
                               <FormGroup>
                                  <Label for="serverUrl" className={classes.label}>URL</Label>
                                  <Input
                                      type="text"
                                      name="serverUrl"
                                      id="serverUrl"
                                      placeholder="Server URL"
                                      className={classes.input}
                                      onChange={handleChange}
                                      value={login.serverUrl}
                                  />
                                  {errors.serverUrl !="" ? (
                                    <span className={classes.error}>{errors.serverUrl}</span>
                                  ) : "" }
                              </FormGroup>
                                <FormGroup>
                                   <Label for="configEmail" className={classes.label}>Email</Label>

                                   <Input
                                       type="text"
                                       name="configEmail"
                                       id="configEmail"
                                       placeholder="E-Mail"
                                       className={classes.input}
                                       onChange={handleChange}
                                       value={login.configEmail}
                                   />
                                    {errors.configEmail !="" ? (
                                       <span className={classes.error}>{errors.configEmail}</span>
                                     ) : "" }
                               </FormGroup>

                               <FormGroup>
                                  <Label for="configPassword" className={classes.label}>Password</Label>

                                  <Input
                                      type="password"
                                      name="configPassword"
                                      id="configPassword"
                                      placeholder="configuration password"
                                      className={classes.input}
                                      onChange={handleChange}
                                      value={login.configPassword}
                                  />

                                  {errors.configPassword !="" ? (
                                     <span className={classes.error}>{errors.configPassword}</span>
                                   ) : "" }
                              </FormGroup>
                               { demo === true ?
                               <>
                                <FormGroup>
                                    <Label for="facilityId" className={classes.label}>Testing Facility ID</Label>

                                    <Input
                                        type="text"
                                        name="facilityId"
                                        id="facilityId"
                                        placeholder="Sending Facility ID"
                                        className={classes.input}
                                        onChange={handleChange}
                                        value={login.facilityId}
                                    />
                                </FormGroup>

                                  <FormGroup>
                                      <Label for="receivingPCRLabId" className={classes.label}>Test PCR Lab ID</Label>

                                      <Input
                                          type="text"
                                          name="receivingPCRLabId"
                                          id="receivingPCRLabId"
                                          placeholder="Receiving PCR Lab ID"
                                          className={classes.input}
                                          onChange={handleChange}
                                          value={login.receivingPCRLabId}
                                      />
                                  </FormGroup>
                                </>
                                : "" }
                              <Button variant="contained" color="primary" type="submit"
                                 startIcon={<SaveIcon />} onClick={handleSubmit} >
                               Save
                             </Button>
                            </Form>
                        </Col>
                        <Col xs={6} md={8}>
                            <Table bordered size="sm" responsive>
                                <thead style={{  backgroundColor:'#014d88', color:'#fff', textAlign: 'center' }}>
                                    <tr>
                                        <th>S/N</th>
                                        <th>Configuration Name</th>
                                        <th>URL</th>
                                        <th>Email</th>
                                        {/*<th>Created Date</th>*/}
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody style={{ textAlign: 'center' }}>
                                { logins && logins.map((data, i) => (
                                     <tr key={i}>
                                        <td>{++i}</td>
                                        <td>{data.configName}</td>
                                        <td>{data.serverUrl}</td>
                                        <td>{data.configEmail}</td>
                                        {/*<td>09/09/2022</td>*/}
                                        <td>
                                        <Button variant="contained" color="error"
                                             startIcon={<DeleteIcon />} onClick={ e => deleteConfig( e, data.id)}>
                                         </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Col>
                   </Row>
                </>
              }

         </Card.Body>
       </Card>
    </div>
  );
}

export default Login;