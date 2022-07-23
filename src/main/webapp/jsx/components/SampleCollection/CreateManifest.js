import React, {useEffect, useCallback, useState} from 'react';
import Container from '@mui/material/Container';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom'
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

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
        display: 'none'
    }
}))

const CreateManifest = (props) => {
    const classes = useStyles();
    const [loading, setLoading] = useState('')
    const [collectedSamples, setCollectedSamples] = useState([])
    const [saved, setSaved] = useState(false);
    const [manifestData, setManifestData] =  useState({
        dateTimeCreated: "",
        destination: "",
        pcr_lab_number: "",
        courier_name: "",
        courier_contact: "",
        result_status: "",
        manifest_id: "",
        total_sample: "",
        test_type: "",
        comment: "",
        samples: []
    })

    const handleChange = (event) => {
          const { name, value } = event.target
          setManifestData({ ...manifestData, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(`manifest created...${manifestData}`)
        setSaved(true);
    }

  return (
    <Container>
         <Card>
          <CardBody>
              <h2>Create Manifest Form</h2>
              <br />
              <br />
              <form>
               <h3>
                  PCR Details
               </h3>
               <hr />
                <div className="row">
                        <div className="form-group mb-3 col-md-3">
                            <FormGroup>
                                <Label for="dateTimeCreated">Date & Time</Label>

                                <Input
                                    type="datetime-local"
                                    name="dateTimeCreated"
                                    value={manifestData.dateTimeCreated}
                                    id="dateTimeCreated"
                                    placeholder="Date & Time Created"
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </div>
                         <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                                <Label for="destination">Destination</Label>
                                <Input
                                    type="text"
                                    name="destination"
                                    value={manifestData.destination}
                                    id="destination"
                                    onChange={handleChange}

                                />

                            </FormGroup>
                        </div>
                         <div className="form-group mb-3 col-md-3">
                            <FormGroup>
                                <Label for="pcr_lab_number">PCR Lab number</Label>
                                <Input
                                    type="text"
                                    name="pcr_lab_number"
                                    value={manifestData.pcr_lab_number}
                                    id="pcr_lab_number"
                                    onChange={handleChange}

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
                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                    <Label for="courier_name">Courier Name</Label>
                                    <Input
                                        type="text"
                                        name="courier_name"
                                        id="courier_name"
                                        value={manifestData.courier_name}
                                        onChange={handleChange}

                                    />

                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                    <Label for="courier_contact">Courier Contact</Label>
                                    <Input
                                        type="text"
                                        name="courier_contact"
                                        value={manifestData.courier_contact}
                                        id="courier_contact"
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </div>
                        <h3>
                          Manifest Details
                        </h3>
                        <hr />
                         <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                                <Label for="result_status">Result status</Label>
                                <Input
                                    type="text"
                                    name="result_status"
                                    id="result_status"
                                    value={manifestData.result_status}
                                    onChange={handleChange}

                                />

                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                                <Label for="manifest_id">Manifest Id</Label>
                                <Input
                                    type="text"
                                    name="manifest_id"
                                    id="manifest_id"
                                    value={manifestData.manifest_id}
                                    onChange={handleChange}

                                />

                            </FormGroup>
                        </div>
                         <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                                <Label for="total_sample">Total Sample</Label>
                                <Input
                                    type="text"
                                    name="total_sample"
                                    id="total_sample"
                                    value={manifestData.total_sample}
                                    onChange={handleChange}

                                />

                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                                <Label for="test_type">Test type</Label>
                                <Input
                                    type="text"
                                    name="test_type"
                                    id="test_type"
                                    value={manifestData.test_type}
                                    onChange={handleChange}

                                />

                            </FormGroup>
                        </div>
                             <div className="form-group mb-3 col-md-12">
                                <FormGroup>
                                    <Label for="comment">Comments</Label>
                                    <Input
                                        type="textarea"
                                        name="comment"
                                        id="comment"
                                        row="40"
                                        style={{ minHeight: 100, fontSize: 14 }}
                                        value={manifestData.comment}
                                        onChange={handleChange}
                                    ></Input>
                                </FormGroup>
                            </div>
                        <div>
                             <Table striped bordered hover size="sm">
                                <thead>
                                  <tr>
                                    <th>Facility</th>
                                    <th>Patient ID</th>
                                    <th>Sample ID</th>
                                    <th>Sample Type</th>
                                    <th>Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <th scope="row">FMC Abuja</th>
                                    <td>001</td>
                                    <td>Sp-001</td>
                                    <td>Blood</td>
                                    <td>2022-07-20@16:15:21</td>
                                  </tr>
                                    <tr>
                                      <th scope="row">FMC Abuja</th>
                                      <td>001</td>
                                      <td>Sp-001</td>
                                      <td>Blood</td>
                                      <td>2022-07-20@16:15:21</td>
                                    </tr>
                                </tbody>
                              </Table>
                        </div>
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
                    <MatButton
                        type="submit"
                        variant="contained"
                        color="success"
                        className={classes.button}
                        startIcon={<PrintIcon />}

                        disabled={saved ? false: true}
                    >
                        Print
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
    </Container>
  );
}

export default CreateManifest;