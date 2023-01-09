import React from "react";
import { logo } from "../SampleCollection/pcr";

import {
  Row,
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

class ManifestPrint extends React.Component {
  render() {
    //console.log(this.props.sampleObj)
    return (
      <Card>
        <CardBody>
          <Row>
            <span>{today}</span>
            <Table size="sm">
              <tbody>
                <tr>
                  <th scope="row"></th>

                  <th scope="row"></th>

                  <th scope="row" className="text-center">
                    <img src={logo} style={{ width: "80px", height: "80px" }} alt=""/>
                  </th>
                </tr>
                <tr>
                  <th scope="row"></th>

                  <th scope="row">
                    <h2 className="text-center">
                      NISRN TRANSPORTATION MANIFEST
                    </h2>
                  </th>

                  <th scope="row"></th>
                </tr>
              </tbody>
            </Table>
          </Row>
          <br />
          <br />
          <Row>
            <Table bordered size="sm">
              <tbody>
                <tr>
                  <th scope="row">Pick Up Date:</th>
                  <td>
                    {this.props.sampleObj.dateScheduledForPickup === null
                      ? " "
                      : this.props.sampleObj.dateScheduledForPickup?.replace(
                          "T",
                          " "
                        )}
                  </td>
                  <th scope="row">Destination:</th>
                  <td>{this.props.sampleObj.receivingLabName}</td>
                  <th scope="row">PCR Lab Number:</th>
                  <td>{this.props.sampleObj.receivingLabID}</td>
                </tr>
                <tr>
                  <th scope="row">Status:</th>
                  <td>{this.props.sampleObj.manifestStatus}</td>
                  <th scope="row">Manifest Id:</th>
                  <td>{this.props.sampleObj.manifestID}</td>
                  <th scope="row">Sample Temperature:</th>
                  <td>{this.props.sampleObj.temperatureAtPickup}</td>
                </tr>
                <tr>
                  <th scope="row">Courier Name:</th>
                  <td>{this.props.sampleObj.courierRiderName}</td>
                  <th scope="row">Courier Contact:</th>
                  <td>{"+" + this.props.sampleObj.courierContact}</td>
                  <th scope="row">Test Type:</th>
                  <td>VL</td>
                </tr>
              </tbody>
            </Table>
          </Row>
          <br />
          <Row>
            <Table striped bordered size="sm">
              <thead style={{ backgroundColor: "#014d88", color: "#fff" }}>
                <tr>
                  <th>Facility</th>
                  <th>Patient ID</th>
                  <th>Sample ID</th>
                  <th>Sample Type</th>
                  <th>Date Collected</th>
                </tr>
              </thead>
              <tbody>
                {this.props.sampleObj.sampleInformation &&
                  this.props.sampleObj.sampleInformation.map((data, i) => (
                    <tr key={i}>
                      <td>
                        {this.props.sampleObj.sendingFacilityName}
                      </td>
                      <td>{data.patientID[0].idNumber}</td>
                      <td>{data.sampleID}</td>
                      <td>{data.sampleType}</td>
                      <td>{data.sampleCollectionDate}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Row>
          <br />
          <span>LAMISPlus 2.0</span>
        </CardBody>
      </Card>
    );
  }
}

export default ManifestPrint;
