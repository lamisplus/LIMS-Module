import React, {useEffect, useCallback, useState, useRef, forwardRef} from 'react';
import Container from '@mui/material/Container';
import { Link, useHistory } from 'react-router-dom'
import { Row, Col, Card, Table } from "react-bootstrap";
import MaterialTable from 'material-table';
import MatButton from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save'
import HomeIcon from '@mui/icons-material/Home';

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
        email: "",
        password: ""
    })

    const loadResults = useCallback(async () => {
        try {
            //const response = await axios.get(`${url}lims/manifest-results/${manifestObj.id}`, { headers: {"Authorization" : `Bearer ${token}`} });
            //console.log("results", response);
           //setResults([]);
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
           //console.log(value)
           setLogin({ ...login, [name] : value})
     }

     const handleSubmit = async (e) => {
         e.preventDefault()
        console.log(login)
        history.push("/");
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
                        <Col>

                            <Form>
                                <FormGroup>
                                   <Label for="email" className={classes.label}>Email</Label>

                                   <Input
                                       type="text"
                                       name="email"
                                       id="email"
                                       placeholder="E-Mail"
                                       className={classes.input}
                                       onChange={handleChange}
                                       value={login.email}
                                       disabled
                                   />
                               </FormGroup>

                               <FormGroup>
                                  <Label for="password" className={classes.label}>Password</Label>

                                  <Input
                                      type="text"
                                      name="password"
                                      id="password"
                                      placeholder="password"
                                      className={classes.input}
                                      onChange={handleChange}
                                      value={login.password}
                                      disabled
                                  />
                              </FormGroup>
                              <Button variant="contained" color="primary" type="submit"
                                 startIcon={<SaveIcon />} onClick={handleSubmit} >
                               Login
                             </Button>
                            </Form>
                        </Col>
                        <Col>
                            <Table bordered size="sm" responsive>
                                <thead style={{  backgroundColor:'#014d88', color:'#fff', textAlign: 'center' }}>
                                    <tr>
                                        <th>S/N</th>
                                        <th>Email</th>
                                        <th>Login Date</th>
                                    </tr>
                                </thead>
                                <tbody style={{ textAlign: 'center' }}>
                                    <tr>
                                        <td>1</td>
                                        <td>nmrs@lims.ng</td>
                                        <td>20:12:2022</td>
                                    </tr>
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