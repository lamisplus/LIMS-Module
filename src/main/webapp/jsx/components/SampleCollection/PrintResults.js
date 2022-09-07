import React, {useEffect, useCallback, useState} from 'react';
import { Link, useHistory } from 'react-router-dom'
import { Badge, Spinner } from 'reactstrap';
import { Row, Col } from "react-bootstrap";

import {  Modal, ModalHeader, ModalBody,
    Input,
    FormGroup,
    Label,Card, CardBody, Table
} from 'reactstrap';

let today = new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})


class PrintResults extends React.Component {

  render() {
    const { manifestObj } = this.props;
    //console.log(manifestObj)
    return (
             <Card>
              <CardBody>
                <h3 style={{ textAlign: 'center'}}>NISRN SAMPLE RESULTS</h3>
                <hr/>
                <Row>
                <Table bordered size="sm" responsive>
                   <tbody>
                        <tr>
                           <th scope="row">ManifestID:</th>
                           <td>{manifestObj.manifestID}</td>
                           <th scope="row">Facility Name:</th>
                           <td>{manifestObj.sendingFacilityName}</td>
                           <th scope="row">Facility Id:</th>
                           <td>{manifestObj.sendingFacilityID}</td>
                         </tr>

                          <tr>
                           <th scope="row">Test Type:</th>
                           <td>{<p><Badge  color="primary">Viral Load</Badge></p>}</td>
                           <th scope="row">Receiving Lab Name:</th>
                           <td>{manifestObj.receivingLabName}</td>
                           <th scope="row">Receiving Lab Number:</th>
                           <td>{manifestObj.receivingLabID}</td>
                         </tr>
                   </tbody>
                 </Table>
                  <br/>
                    <Table striped bordered size="sm">
                     <tbody>
                               <tr style={{  backgroundColor:'#014d88', color:'#fff' }}>
                                <th>Sample ID</th>
                                <th>Approval Date</th>
                                {/*<th>Assay Date</th>
                                <th>Date Received at PCR Lab</th>*/}
                                <th>Date Result Dispatched</th>
                                <th>PCR Sample Number</th>
                                 {/*<th>Result Date</th>*/}
                                <th>Sample Status</th>
                                <th>Sample Testable</th>
                                <th>Test Result</th>
                                 {/*<th>Visit Date</th>*/}
                              </tr>
                               <tr>
                                  <td>0005</td>
                                  <td scope="row">--:--:--</td>
                                    {/*<td>{data.assayDate}</td>
                                  <td>{data.dateSampleReceivedAtPCRLab}</td>*/}
                                  <td>--:--:--</td>
                                  <td>----</td>
                                   {/*<td>{data.resultDate}</td>*/}

                                  <td><p><Badge  color="dark">Result Pending</Badge></p></td>
                                  <td>True</td>
                                  <td>Not Ready</td>
                                   {/*<td>{data.visitDate}</td>*/}
                               </tr>
                     </tbody>
                   </Table>
                   <span>LAMISPlus 2.0: {today}</span>
                 </Row>
                 <hr />
              </CardBody>
             </Card>
      );
  }
}

export default PrintResults;