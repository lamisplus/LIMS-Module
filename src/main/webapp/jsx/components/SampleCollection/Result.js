import React, {useEffect, useCallback, useState, useRef, forwardRef} from 'react';
import Container from '@mui/material/Container';
import { Link, useHistory } from 'react-router-dom'
import { Row, Col, Card } from "react-bootstrap";
import MaterialTable from 'material-table';
import MatButton from '@material-ui/core/Button';
import HomeIcon from '@mui/icons-material/Home';

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
    console.log("manifestObj",manifestObj)
    const classes = useStyles();
    const [loading, setLoading] = useState(true)
    const [results, setResults] = useState([])
    const [requestData, setRequestData] = useState({
        token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvbGltcy5uZyIsImF1ZCI6Imh0dHBzOmxpbXMubmciLCJpYXQiOjEzNTY5OTk1MjQsIm5iZiI6MTM1NzAwMDAwMCwiZGF0YSI6eyJpZCI6IjEiLCJmaXJzdG5hbWUiOiJNUlMiLCJsYXN0bmFtZSI6Ik5pZ2VyaWEiLCJlbWFpbCI6Im5tcnNAbGltcy5uZyIsImFjY2Vzc19sZXZlbCI6IiJ9fQ.9QSnCgsVC-IktzNfM3oBsY2ZhG5Xil1kXvBN9497I5U",
        manifestID: manifestObj.manifestID,
        sendingFacilityID: manifestObj.sendingFacilityID,
        sendingFacilityName: manifestObj.sendingFacilityName,
        testType: "VL",
        receivingLabID: manifestObj.receivingLabID,
        receivingLabName: manifestObj.receivingLabName
    })

     const loadResults = useCallback(async () => {
        try {
            console.log("requests", requestData)
            await axios.post(`${url}lims/manifests`, requestData,
            { headers: {"Authorization" : `Bearer ${token}`}}).then(resp => {
                 console.log("results", resp)
                toast.success("Sample Results Available!!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            });
            setLoading(false)

        } catch (e) {
            toast.error("An error occurred while loading results", {
                position: toast.POSITION.TOP_RIGHT
            });
            setLoading(false)
        }
    }, []);

    useEffect(() => {
        loadResults()
    }, [loadResults]);

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
              <MaterialTable
               icons={tableIcons}
                  title="PCR Sample Results"
                  columns={[
                      { title: "Sample Id", field: "sampleId" },
                      { title: "Pickup Date", field: "pickupDate" },
                      { title: "Created Date", field: "createDate" },
                      { title: "Receiving Lab", field: "lab" },
                       { title: "Packaged By", field: "packaged_by" },
                      {
                        title: "Status",
                        field: "status",
                      },
                    /*  {
                        title: "Action",
                        field: "actions",
                        filtering: false,
                      }, */
                  ]}
                  isLoading={loading}
                  data={ results.map((row) => (
                        {
                          sampleId: row.manifestID,
                          pickupDate: row.dateScheduledForPickup.replace('T', ' '),
                          createDate: row.createDate.replace('T', ' '),
                          lab: row.receivingLabName,
                          packaged_by: row.samplePackagedBy,
                          status: row.manifestStatus,

                         /* actions:
                            <div>
                               <SplitActionButton actions={actionItems(row)} />
                            </div>*/

                        }))}

                      options={{
                        headerStyle: {
                            backgroundColor: "#014d88",
                            color: "#fff",
                            fontSize:'16px',
                            padding:'10px'
                        },
                        searchFieldStyle: {
                            width : '200%',
                            margingLeft: '250px',
                        },
                        selection: false,
                        filtering: false,
                        exportButton: false,
                        searchFieldAlignment: 'left',
                        pageSizeOptions:[10,20,100],
                        pageSize:10,
                        debounceInterval: 400
                    }}

              />
         </Card.Body>
       </Card>
    </div>
  );
}

export default Result;