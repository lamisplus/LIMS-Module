import React, {useEffect, useCallback, useState} from 'react';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import { Row, Col, Card } from "react-bootstrap";

import "./sample.css";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import { forwardRef } from 'react';
import axios from "axios";
import { toast } from 'react-toastify';
import {token, url } from "../../../api";

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import MaterialTable from 'material-table';
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
import { makeStyles } from '@material-ui/core/styles'

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

const SampleSearch = (props) => {
    const classes = useStyles();
    const [loading, setLoading] = useState('')
    const [collectedSamples, setCollectedSamples] = useState([])
    const samples = []

     const loadLabTestData = useCallback(async () => {
            try {
                const response = await axios.get(`${url}lims/collected-samples/`, { headers: {"Authorization" : `Bearer ${token}`} });
                console.log("samples", response);
                setCollectedSamples([{
                    "facilityName": "FMC Abuja",
                    "facilityId": "FMC-1113",
                    "patientHospitalNumber": "001",
                    "sampleId": "sp-001",
                    "orderDate": "2022-07-20",
                    "orderTime": "16:15:21",
                    "dateSampleCollected": "2022-07-20",
                    "timeSampleCollected": "16:15:57",
                    "sampleTypeId": 186,
                    "sampleTypeName": "Blood",
                },
                {
                                    "facilityName": "FMC Abuja",
                                    "facilityId": "FMC-0113",
                                    "patientHospitalNumber": "021",
                                    "sampleId": "sp-301",
                                    "orderDate": "2022-07-21",
                                    "orderTime": "16:15:21",
                                    "dateSampleCollected": "2022-07-20",
                                    "timeSampleCollected": "16:15:57",
                                    "sampleTypeId": 188,
                                    "sampleTypeName": "Urine",
                                },{
                                                      "facilityName": "FMC Abuja",
                                                      "facilityId": "FMC-14413",
                                                      "patientHospitalNumber": "0089",
                                                      "sampleId": "sp-4001",
                                                      "orderDate": "2022-07-20",
                                                      "orderTime": "17:15:21",
                                                      "dateSampleCollected": "2022-07-21",
                                                      "timeSampleCollected": "17:15:57",
                                                      "sampleTypeId": 180,
                                                      "sampleTypeName": "Blood",
                                                  }]);
            } catch (e) {
                toast.error("An error occurred while fetching lab", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }, []);

     useEffect(() => {
     setLoading('true');
         const onSuccess = () => {
             setLoading(false)
         }
         const onError = () => {
             setLoading(false)
         }

         loadLabTestData();

     }, [loadLabTestData]);

     const handleSampleChanges = (sample) => {
        sample.filter((item) => {
            var i = samples.findIndex(x => (x.patientId == item.patientId && x.sampleId == item.sampleId && x.sampleType == item.sampleType));
            if(i <= -1){
                    samples.push(item);
              }
             return null;
        })

        //sample.map((data) => { samples.push(data) })
     }

  return (
      <div>
      <Card>
         <Card.Body>
            <form className="row gy-2 gx-3 align-items-center">
              <div className="col-auto">
                <div className="form-outline">
                  <label className="form-label" for="form11Example1">Patient Id</label>
                  <input type="text" id="form11Example1" class="form-control" />
                </div>
              </div>
              <div className="col-auto">
                <div className="form-outline">
                  <label className="form-label" for="form11Example3">Sample Id</label>
                  <input type="text" id="form11Example3" class="form-control" />
                </div>
              </div>
               <div className="col-auto">
                  <div className="form-outline">
                    <label className="form-label" for="form11Example3">Start Date</label>
                    <input type="text" id="form11Example3" class="form-control" />
                  </div>
                </div>
                <div className="col-auto">
                 <div className="form-outline">
                   <label className="form-label" for="form11Example3">End Date</label>
                   <input type="text" id="form11Example3" class="form-control" />
                 </div>
               </div>
              <div class="col-auto">
                <Button variant="outlined" color="primary">
                     Search...
                  </Button>
              </div>
            </form>
          <br />
          <MaterialTable
           icons={tableIcons}
              title="Sample Collection List"
              columns={[
                  { title: "Facility Name", field: "FacilityName" },
                  { title: "Patient ID", field: "patientId" },
                  { title: "Sample ID", field: "sampleId" },
                  {
                    title: "Sample Type",
                    field: "sampleType",
                  },
                  { title: "Date Order", field: "date", type: "date" , filtering: false},

                  {
                    title: "Date Collected ",
                    field: "datecollected",
                    filtering: false
                  },
//                  {
//                    title: "Action",
//                    field: "actions",
//                    filtering: false,
//                  },
              ]}
              //isLoading={loading}
              data={ collectedSamples.map((row) => (
                    {
                      FacilityName: row.facilityName,
                      patientId: row.patientHospitalNumber,
                      sampleId: row.sampleId,
                      sampleType: row.sampleTypeName,
                      date: row.orderDate + '@' + row.orderTime,
                      datecollected: row.dateSampleCollected + '@' + row.timeSampleCollected,
//                      actions:  <Link to ={{
//                                      pathname: "/samples-collection",
//                                      state: row
//                                  }}
//                                      style={{ cursor: "pointer", color: "blue", fontStyle: "bold"}}
//                                >
//                                    <Tooltip title="Collect Sample">
//                                        <IconButton aria-label="Collect Sample" >
//                                            <VisibilityIcon color="primary"/>
//                                        </IconButton>
//                                    </Tooltip>
//                                </Link>
                    })
              )}

                  options={{
                    headerStyle: {
                        backgroundColor: "#014d88",
                        color: "#fff",
                        fontSize:'16px',
                        padding:'10px'
                    },
                    searchFieldStyle: {
                        width : '300%',
                        margingLeft: '250px',
                    },
                    selection: true,
                    filtering: false,
                    exportButton: false,
                    searchFieldAlignment: 'left',
                    pageSizeOptions:[10,20,100],
                    pageSize:5,
                    debounceInterval: 400
                }}
                 onSelectionChange={(rows) => handleSampleChanges(rows)}

          />
          <br />
            <div>
                 <Stack direction="row" spacing={2}
                 m={1}
                 display="flex"
                 justifyContent="flex-end"
                 alignItems="flex-end">
                      <Link color="inherit"
                          to={{pathname: "/"}}
                           >
                          <Button variant="outlined" color="primary">
                             PrevPage
                          </Button>
                      </Link>
                      {" "}
                      { <Link color="inherit"
                             to={{
                             pathname: "/create-manifest",
                             state:{ sampleObj: samples }
                             }}

                              >
                             <Button variant="outlined" color="success">
                                NextPage
                             </Button>
                         </Link>
                         }

                  </Stack>
                 <br />
             </div>
         </Card.Body>
       </Card>
    </div>
  );
}

export default SampleSearch;