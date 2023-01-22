import React from "react";
import { Link } from "react-router-dom";
import { Badge, Spinner } from "reactstrap";
import { Row } from "react-bootstrap";
import PrintIcon from "@mui/icons-material/Print";
import MatButton from "@material-ui/core/Button";
import HomeIcon from "@mui/icons-material/Home";
import "./result.css";

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

const print = {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: "Arial",
}

class PatientResult extends React.Component {
  render() {
    const { samples } = this.props;
    console.log(samples);

    return (
      <Card>
        <CardBody>
          <h3 style={{ textAlign: "center", border: "1px solid", padding: "15px" }}>Patient Viral Load Result</h3>
          <hr />
          <Row>
            <Table bordered size="sm" responsive style={ print }>
              <tbody>
                 <tr>
                  <th scope="row">Manifest Id:</th>
                  <td>{samples.manifestID}</td>
                  <th scope="row">Patient Name:</th>
                  <td>{samples.firstName + " " + samples.surName}</td>
                  <th scope="row">Gender:</th>
                  <td>{samples.sex === "M" ? "Male" : "Female"}</td>
                </tr>
                 <tr>
                  <th scope="row">Age:</th>
                  <td>{samples.age}</td>
                  <th scope="row">Client Unique No:</th>
                  <td>{Object.keys(samples).length !== 0 ? samples.patientID[0].idNumber : ""}</td>
                  <th scope="row">Facility Name:</th>
                  <td>{samples.sendingFacilityName}</td>
                </tr>
                <tr>
                  <th scope="row">Sample Collected by:</th>
                  <td>{samples.sampleCollectedBy}</td>
                  <th scope="row">Date\Time Collected:</th>
                  <td>{samples.sampleCollectionDate}</td>
                  <th scope="row">Sample Id:</th>
                  <td>{samples.sampleID}</td>
                </tr>
                <tr>
                  <th scope="row">Sample Type:</th>
                  <td>{samples.sampleType}</td>
                  <th scope="row">Date\Time Ordered:</th>
                  <td>{samples.sampleOrderDate}</td>
                  <th scope="row">Date Received at PCR:</th>
                  <td>{samples.visitDate}</td>
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
            <Table striped bordered size="sm" style={ print }>
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
                    <td>{samples.approvalDate}</td>
                    <td>{samples.assayDate}</td>
                    <td>{samples.dateResultDispatched}</td>
                    <td>{samples.pcrLabSampleNumber}</td>
                    <td>{samples.testResult} Copies/mL</td>
                  </tr>
                }
              </tbody>
            </Table>
            <br />
            <br />
            <br />
            <br />
            <Table bordered size="sm" responsive style={ print }>
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
            <span style={{ fontSize: "10px" }}>LAMISPlus 2.0: {today}</span>
          </Row>
          <hr />
        </CardBody>
      </Card>
    );
  }
}

export default PatientResult;
