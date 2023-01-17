import React from "react";
import { Link } from "react-router-dom";
import { Badge, Spinner } from "reactstrap";
import { Row } from "react-bootstrap";
import PrintIcon from "@mui/icons-material/Print";
import MatButton from "@material-ui/core/Button";
import HomeIcon from "@mui/icons-material/Home";

import {
  Card,
  CardBody,
  Table,
} from "reactstrap";

let today = new Date().toLocaleDateString("en-us", {
  weekday: "long",
  year: "numeric",
  month: "short",
  day: "numeric",
});

class PatientResult extends React.Component {
  render() {
    const { results, samples } = this.props;

    return (
      <Card>
        <CardBody>
          <h3 style={{ textAlign: "center" }}>HIV-1 Viral Load Result</h3>
          <hr />
          <Row>
            <Table bordered size="sm" responsive>
              <tbody>
                 <tr>
                  <th scope="row">Lab Report:</th>
                  <td></td>
                  <th scope="row">Patient Name:</th>
                  <td>{samples.sampleInformation[0].firstName + " " + samples.sampleInformation[0].surName}</td>
                  <th scope="row">Gender:</th>
                  <td>{samples.sampleInformation[0].sex}</td>
                </tr>
                 <tr>
                  <th scope="row">Age:</th>
                  <td>{samples.sampleInformation[0].age}</td>
                  <th scope="row">Client Unique No:</th>
                  <td>{samples.sampleInformation[0].patientID[0].idNumber}</td>
                  <th scope="row">Facility Name:</th>
                  <td>{samples.sendingFacilityName}</td>
                </tr>
                <tr>
                  <th scope="row">Address\Location:</th>
                  <td></td>
                  <th scope="row">Date Collected:</th>
                  <td>{samples.sampleInformation[0].sampleCollectionDate}</td>
                  <th scope="row">Sample Id:</th>
                  <td>{results.sampleID}</td>
                </tr>
                <tr>
                  <th scope="row">Sample Type:</th>
                  <td>{samples.sampleInformation[0].sampleType}</td>
                  <th scope="row">Date Ordered:</th>
                  <td>{samples.sampleInformation[0].sampleOrderDate}</td>
                  <th scope="row">Date Received at PCR:</th>
                  <td>{results.visitDate}</td>
                </tr>

                <tr>
                  <th scope="row">Test Type:</th>
                  <td>
                    {
                      <p>
                        <Badge color="primary">Viral Load</Badge>
                      </p>
                    }
                  </td>
                  <th scope="row">Receiving Lab Name:</th>
                  <td>{samples.receivingLabName}</td>
                  <th scope="row">Receiving Lab Number:</th>
                  <td>{samples.receivingLabID}</td>
                </tr>
              </tbody>
            </Table>
            <br />
            <Table striped bordered size="sm">
              <tbody>
                <tr style={{ backgroundColor: "#014d88", color: "#fff" }}>
                  <th>Assay Date</th>
                  <th>Approval Date</th>
                  <th>Date Result Dispatched</th>
                  <th>PCR Sample Number</th>
                  <th>Test Result</th>
                </tr>
                {
                  <tr>
                    <td>{results.approvalDate}</td>
                    <td>{results.assayDate}</td>
                    <td>{results.dateResultDispatched}</td>
                    <td>{results.pcrLabSampleNumber}</td>
                    <td>{results.testResult} Copies/mL</td>
                  </tr>
                }
              </tbody>
            </Table>
            <br />
            <br />
            <br />
            <br />
            <Table bordered size="sm" responsive>
              <tbody>
                 <tr>
                  <th scope="row">Report by:<br />
                  Date: </th>
                  <th scope="row">Signature</th>
                  <th scope="row">Reviewed by:<br />
                    Date: </th>
                  <th scope="row">Signature</th>
                </tr>
              </tbody>
            </Table>

            <br />
            <span>LAMISPlus 2.0: {today}</span>
          </Row>
          <hr />
        </CardBody>
      </Card>
    );
  }
}

export default PatientResult;
