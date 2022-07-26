import React, {useEffect, useCallback, useState} from 'react';
import { Link, useHistory } from 'react-router-dom'
//import nglogo from './assets/images/nglogo.png'

import {  Modal, ModalHeader, ModalBody,
    Col,Input,
    FormGroup,
    Label,Card, CardBody, Table
} from 'reactstrap';

let today = new Date().toLocaleDateString()


class ManifestPrint extends React.Component {
  render() {
    return (
             <Card>
              <CardBody>
                  <div>
                  <span>{today}</span>
                         <Table size="sm">
                              <tbody>
                                   <tr>
                                      <th scope="row"></th>

                                      <th scope="row"></th>

                                      <th scope="row" className="text-center">
                                        <img src={`${process.env.PUBLIC_URL}/assets/images/nglogo.png`} style={{width: "80px", height: "80px"}}/>
                                      </th>

                                    </tr>
                                    <tr>
                                      <th scope="row"></th>

                                      <th scope="row"><h2 className="text-center">NISRN TRANSPORTATION MANIFEST</h2></th>

                                      <th scope="row"></th>

                                    </tr>
                              </tbody>
                            </Table>
                      </div>
                <br/>
              <br />
            <div>
                   <Table bordered size="sm">
                      <tbody>
                           <tr>
                              <th scope="row">Date/Time:</th>
                              <td>{this.props.sampleObj.dateScheduledForPickup}</td>
                              <th scope="row">Destination:</th>
                              <td>{this.props.sampleObj.receivingLabName}</td>
                              <th scope="row">PCR Lab Number:</th>
                              <td>{this.props.sampleObj.receivingLabID}</td>
                            </tr>
                            <tr>
                              <th scope="row">Status:</th>
                              <td>{this.props.sampleObj.result_status}</td>
                              <th scope="row">Manifest Id:</th>
                              <td>{this.props.sampleObj.manifest_id}</td>
                              <th scope="row">Total Samples:</th>
                              <td>{this.props.sampleObj.total_sample}</td>
                            </tr>
                             <tr>
                              <th scope="row">Courier Name:</th>
                              <td>{this.props.sampleObj.courierRiderName}</td>
                              <th scope="row">Courier Contact:</th>
                              <td>{this.props.sampleObj.courierContact}</td>
                              <th scope="row">Test Type:</th>
                              <td>{this.props.sampleObj.test_type}</td>
                            </tr>
                      </tbody>
                    </Table>
              </div>
              <br/>
              <div>
                     <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>Facility</th>
                            <th>Patient ID</th>
                            <th>Sample ID</th>
                            <th>Sample Type</th>
                            <th>Date Collected</th>
                          </tr>
                        </thead>
                        <tbody>
                        { this.props.sampleObj && this.props.sampleObj.samples.map((data, i) => (
                             <tr key={i}>
                                <td scope="row">{data.FacilityName}</td>
                                <td>{data.patientId}</td>
                                <td>{data.sampleId}</td>
                                <td>{data.sampleType}</td>
                                <td>{data.datecollected}</td>
                              </tr>
                        ))}

                        </tbody>
                      </Table>
                </div>
                <br />
                <span>LAMISPlus 2.0</span>
              </CardBody>
             </Card>
      );
  }
}

export default ManifestPrint;