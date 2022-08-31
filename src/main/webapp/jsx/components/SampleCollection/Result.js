import React, {useEffect, useCallback, useState, useRef, forwardRef} from 'react';
import Container from '@mui/material/Container';
import { Link, useHistory } from 'react-router-dom'
import { Row, Col, Card, Table } from "react-bootstrap";
import MaterialTable from 'material-table';
import MatButton from '@material-ui/core/Button';
import HomeIcon from '@mui/icons-material/Home';
import { Badge, Spinner } from 'reactstrap';

import "./sample.css";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import axios from "axios";
import { toast } from 'react-toastify';
import {token, url } from "../../../api";

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { makeStyles } from '@material-ui/core/styles'

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

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

const tableIcons = {
Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const Result = (props) => {
    let history = useHistory();
    const manifestObj = history.location && history.location.state ? history.location.state.manifestObj : {}
    console.log("maniObj",manifestObj)
    const classes = useStyles();
    const [loading, setLoading] = useState(true)
    const [results, setResults] = useState([])

     const loadResults = useCallback(async () => {
        try {
            const response = await axios.get(`${url}lims/manifest-results/${manifestObj.id}`, { headers: {"Authorization" : `Bearer ${token}`} });
            console.log("results", response);

            setResults(response.data);
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

    const sampleStatus = e =>{
        if(parseInt(e)===1){
            return <p><Badge  color="success">Completed</Badge></p>
        }else if(parseInt(e)===2){
            return <p><Badge  color="danger">Rejected</Badge></p>
        }else if(parseInt(e)===3){
            return <p><Badge  color="info">In-Progress</Badge></p>
        }else if(parseInt(e)===4){
            return <p><Badge  color="warning">Re-Run</Badge></p>
        }else{
            return <p><Badge  color="dark">Result Pending</Badge></p>
        }
    }

    const resultTestType = e => {
        if(parseInt(e)===2){
            return <p><Badge  color="primary">Viral Load</Badge></p>
        }else if(parseInt(e)===1){
            return <p><Badge  color="info">EID</Badge></p>
        }
    }

  return (
    <div>
      <Card>
         <Card.Body>
           <p style={{textAlign: 'right'}}>
             <Link color="inherit"
               to={{pathname: "/"}}
                >
               <MatButton
                   variant="contained"
                   color="primary"
                   className={classes.button}
                   startIcon={<HomeIcon />}>
                   back Home
               </MatButton>
              </Link>
             </p>
             <hr />
              { results.length  === 0 ? <p> <Spinner color="primary" /> Loading Please Wait</p> :
                <>
                  <h2>PCR Sample Results</h2>
                  <br/>
                  <Table bordered size="sm">
                               <tbody>
                                    <tr>
                                       <th scope="row">ManifestID:</th>
                                       <td>{manifestObj.manifestID}</td>
                                       <th scope="row">Facility Name:</th>
                                       <td>{manifestObj.sendingFacilityName}</td>
                                       <th scope="row">PCR Lab Number:</th>
                                       <td>{manifestObj.receivingLabID}</td>
                                     </tr>
                                     <tr>
                                       <th scope="row"></th>
                                       <td></td>
                                       <th scope="row"></th>
                                       <td></td>
                                       <th scope="row"></th>
                                       <td></td>
                                     </tr>
                                      <tr>
                                       <th scope="row">Test Type:</th>
                                       <td>{ results.testType !== null ? resultTestType(results.testType) : <p><Badge  color="primary">Viral Load</Badge></p>}</td>
                                       <th scope="row">Facility Id:</th>
                                       <td>{manifestObj.sendingFacilityID}</td>
                                       <th scope="row">PCR Lab Name:</th>
                                       <td>{manifestObj.receivingLabName}</td>
                                     </tr>
                               </tbody>
                             </Table>
                              <br/>
                               <div>
                                        <Table striped bordered size="sm">
                                         <thead style={{  backgroundColor:'#014d88', color:'#fff' }}>
                                           <tr>
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
                                         </thead>
                                         <tbody>
                                         {
                                            results.manifestID === null ?
                                              manifestObj.sampleInformation.length > 0 && manifestObj.sampleInformation.map((data, i) => (
                                                   <tr key={i}>
                                                      <td>{data.sampleID}</td>
                                                      <td scope="row">--:--:--</td>
                                                        {/*<td>{data.assayDate}</td>
                                                      <td>{data.dateSampleReceivedAtPCRLab}</td>*/}
                                                      <td>--:--:--</td>
                                                      <td>----</td>
                                                       {/*<td>{data.resultDate}</td>*/}

                                                      <td>{sampleStatus(data.sampleStatus)}</td>
                                                      <td>Not Available</td>
                                                      <td>Not Ready</td>
                                                       {/*<td>{data.visitDate}</td>*/}
                                                   </tr>
                                              ))
                                             :
                                             results.viralLoadTestReport.length > 0 && results.viralLoadTestReport.map((data, i) => (
                                                  <tr key={i}>
                                                     <td scope="row">{data.approvalDate}</td>
                                                       {/*<td>{data.assayDate}</td>
                                                     <td>{data.dateSampleReceivedAtPCRLab}</td>*/}
                                                     <td>{data.dateResultDispatched}</td>
                                                     <td>{data.pcrLabSampleNumber}</td>
                                                      {/*<td>{data.resultDate}</td>*/}
                                                     <td>{data.sampleID}</td>
                                                     <td>{sampleStatus(data.sampleStatus)}</td>
                                                     <td>{data.sampleTestable}</td>
                                                     <td>{data.testResult}</td>
                                                      {/*<td>{data.visitDate}</td>*/}
                                                  </tr>
                                             ))
                                         }
                                         </tbody>
                                       </Table>
                                 </div>
                </>
              }

         </Card.Body>
       </Card>
    </div>
  );
}

export default Result;