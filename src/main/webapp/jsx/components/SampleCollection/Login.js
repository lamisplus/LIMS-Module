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

const Login = (props) => {
    let history = useHistory();
    const manifestObj = history.location && history.location.state ? history.location.state.manifestObj : {}
    //console.log("maniObj",manifestObj)
    const permissions = history.location && history.location.state ? history.location.state.permissions : []

    const classes = useStyles();
    const [loading, setLoading] = useState(true)
    const [login, setLogin] = useState({
        configName: "",
        serverUrl: "",
        configEmail: "",
        configPassword: ""
    })

    const [logins, setLogins] = useState([])

    const loadResults = useCallback(async () => {
        try {
            const response = await axios.get(`${url}lims/configs`, { headers: {"Authorization" : `Bearer ${token}`} });
            console.log("configs", response);
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
           setLogin({ ...login, [name] : value})
     }

     const handleSubmit = async (e) => {
         e.preventDefault()
         try {
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
                         configPassword: ""
                     })
                });

            loadResults()

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
                                   <Input
                                       type="select"
                                       name="configName"
                                       id="configName"
                                       className={classes.input}
                                       onChange={handleChange}
                                       value={login.configName}
                                   >
                                    <option hidden>
                                        Select Configuration Name
                                    </option>
                                    <option value="Demo Server">
                                        Demo Server
                                    </option>
                                    <option value="Live Server">
                                        Live Server
                                    </option>
                                   </Input>
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
                              </FormGroup>
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
                                        <th>Created Date</th>
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
                                        <td>09/09/2022</td>
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