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
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

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

  return (
    <Container>
         <p>Create Manifest Form</p>
         <Card>
          <CardBody>
              <form>
                <div className="row">
                        <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                                <Label for="maritalStatus">Date & Time</Label>

                                <Input
                                    type="datetime-local"
                                    name="dateTimeDispensed"

                                    id="dateTimeDispensed"
                                    placeholder="Date Dispensed"

                                />
                            </FormGroup>
                        </div>
                        </div>
                        <div className="row">
                        <div className="form-group mb-3 col-md-5">
                            <FormGroup>
                                <Label for="exampleNumber">Created By</Label>
                                <Input
                                    type="text"
                                    name="brand"

                                    id="brand"
                                    //placeholder="brand name"

                                />

                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-3">
                            <FormGroup>
                                <Label>Contact Phone</Label>
                                <Input
                                    type="number"
                                    name="quantity"

                                    id="quantity"

                                />
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-3">
                            <FormGroup>
                                <Label>Lab Number</Label>
                                <Input
                                    type="number"
                                    name="quantity"

                                    id="quantity"

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
                                      <th scope="row">GH Wuse</th>
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
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        startIcon={<SaveIcon />}

                        // disabled={loading}
                    >
                        Save
                    </MatButton>

                    <MatButton
                        type="submit"
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        startIcon={<ArrowForwardIcon />}

                        // disabled={loading}
                    >
                        Send
                    </MatButton>

                    <MatButton
                        variant="contained"
                        color="default"
                        //onClick={toggle}
                        className={classes.button}
                        startIcon={<CancelIcon />}>
                        Cancel
                    </MatButton>
                </form>
          </CardBody>
         </Card>
    </Container>
  );
}

export default CreateManifest;