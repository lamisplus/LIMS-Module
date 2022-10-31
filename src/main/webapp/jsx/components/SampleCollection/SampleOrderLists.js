import React, {useEffect, useCallback, useState} from 'react';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import { Row, Col, Card } from "react-bootstrap";
import {Label, Input, FormGroup} from "reactstrap"
import Grid from "@material-ui/core/Grid";
import "./sample.css";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import {format} from "date-fns";

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

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

const SampleSearch = (props) => {
    const classes = useStyles();
    const [loading, setLoading] = useState('')
    const [collectedSamples, setCollectedSamples] = useState([])
    const [manifestData, setManifestData] = useState([])
    let samples = [];
    const [ dateFilter, setDateFilter] = useState({
        startDate: null,
        endDate: null
    })

    const [value, setValue] = React.useState([null, null]);

     let start_date = value[0] != null ? value[0].$d : null;
     let end_date = value[1] != null ? value[1].$d : null;

    const handleChange = e => {
        const {name, value} = e.target;
        setDateFilter({...dateFilter, [name]: value})
    }

     const loadLabTestData = useCallback(async () => {
            try {
                const response = await axios.get(`${url}lims/collected-samples/`, { headers: {"Authorization" : `Bearer ${token}`} });
                console.log("samples", response);
                setCollectedSamples(response.data);
                setLoading(false)
                localStorage.clear();

            } catch (e) {
                toast.error("An error occurred while fetching lab", {
                    position: toast.POSITION.TOP_RIGHT
                });
                setLoading(false)
            }
        }, []);

     const loadManifestData = useCallback(async () => {
        try {
            const response = await axios.get(`${url}lims/manifests`, { headers: {"Authorization" : `Bearer ${token}`} });
            let arr = [];
            response.data.map((x) => {
                x.sampleInformation.map((y) => {arr.push(y)})
            })
             setManifestData(arr);
            setLoading(false)

        } catch (e) {
            toast.error("An error occurred while fetching lab", {
                position: toast.POSITION.TOP_RIGHT
            });
            setLoading(false)
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
         loadManifestData();
         loadLabTestData();

     }, [loadLabTestData]);

     const calculate_age = dob => {
             var today = new Date();
             var birthDate = new Date(dob);
             var age_now = today.getFullYear() - birthDate.getFullYear();
             return age_now

           };

     const handleSampleChanges = (sample) => {
        //console.log("sample clicked", sample);
        sample.filter((item) => {
            var i = samples.findIndex(x => (x.sampleId !== item.sampleId && x.sampleType === item.sampleType));

            if(i === -1){
                  samples.push({
                      patientID: [{
                          idNumber: item.patientId,
                          idTypeCode: item.typecode
                      }],
                      firstName: item.firstname,
                      surName: item.surname,
                      sex: item.sex,
                      pregnantBreastFeedingStatus: "",
                      age: 0,
                      dateOfBirth: item.dob,
                      age: item.age,
                      sampleID: item.sampleId,
                      sampleType: item.sampleType,
                      indicationVLTest: 1,
                      artCommencementDate: "",
                      drugRegimen: "",
                      sampleOrderedBy: item.orderby,
                      sampleOrderDate: item.orderbydate,
                      sampleCollectedBy: item.collectedby,
                      sampleCollectionDate: item.datecollected,
                      sampleCollectionTime: item.timecollected,
                      dateSampleSent: format(new Date(), 'yyyy-MM-dd'),
                      id: 0,
                      manifestID: 0,
                      pid: 0,
                      priority: 0,
                  });

                  localStorage.setItem('samples', JSON.stringify(samples));
              }
             return null;
        })
        console.log(samples)
     }

     const sampleFilter = (collectedSamples, manifestData) => {
        if (collectedSamples && manifestData) {
            return collectedSamples.filter(x => {
                return !manifestData.some(y => {
                    return x.sampleID === y.sampleID
                })
            })
        }
     }

     const values = sampleFilter(collectedSamples, manifestData)

  return (
      <div>
      <Card>
         <Card.Body>
            <Grid container spacing={2}>
                 <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  localeText={{ start: 'Start-Date', end: 'End-Date' }}
                >
                  <DateRangePicker
                    value={value}
                    onChange={(newValue) => {
                      setValue(newValue);
                    }}
                    renderInput={(startProps, endProps) => (
                      <React.Fragment>
                        <TextField {...startProps} />
                        <Box sx={{ mx: 2 }}> to </Box>
                        <TextField {...endProps} />
                      </React.Fragment>
                    )}
                  />
                </LocalizationProvider>

           {/*   <Grid item xs={2}>
                   <FormGroup>
                       <Label for="startDate" className={classes.label}>Start date</Label>

                       <Input
                           type="date"
                           name="startDate"

                           id="startDate"
                           placeholder="Start Date"
                           onChange={handleChange}
                           className={classes.input}
                       />
                   </FormGroup>
              </Grid>
              <Grid item xs={2}>
                    <FormGroup>
                      <Label for="endDate" className={classes.label}>End date</Label>

                      <Input
                          type="date"
                          name="endDate"

                          id="endDate"
                          placeholder="End Date"
                          onChange={handleChange}
                          className={classes.input}
                      />
                  </FormGroup>
              </Grid>

              <Grid item xs={2}>

              </Grid>
              */}
            </Grid>
          <br />
          <MaterialTable
           icons={tableIcons}
              title="Sample Collection List"
              columns={[
                  { title: "Type code", field: "typecode" },
                  { title: "Hospital ID", field: "patientId" },
                  { title: "First Name", field: "firstname" },
                  { title: "Surname", field: "surname" },
                  { title: "Sex", field: "sex" },
                  { title: "DOB", field: "dob" },
                  { title: "Age", field: "age" },
                  {
                    title: "Test Type",
                    field: "testType",
                  },
                  { title: "Sample ID", field: "sampleId" },
                  {
                    title: "Sample Type",
                    field: "sampleType",
                  },
                  { title: "Sample Orderby", field: "orderby" },
                  { title: "Orderby Date", field: "orderbydate", type: "date" , filtering: false },
                  { title: "Collected By", field: "collectedby" },
                  { title: "Date Collected", field: "datecollected", type: "date" , filtering: false},
                  { title: "Time Collected", field: "timecollected", type: "time" , filtering: false},

              ]}
              isLoading={loading}
              data={ values.filter( row => {
                   let filterPass = true

                   const date = new Date(row.sampleCollectionDate)

                   if (start_date != null) {
                     filterPass = filterPass && (new Date(start_date) <= date)
                   }
                   if (end_date != null) {
                     filterPass = filterPass && (new Date(end_date) >= date)
                   }
                   return filterPass
              }).map((row) => (
                    {
                      typecode: row.patientID.idTypeCode,
                      patientId: row.patientID.idNumber,
                      firstname: row.firstName,
                      surname: row.surName,
                      sex: row.sex,
                      dob: row.dateOfBirth,
                      age: calculate_age(row.dateOfBirth),
                      testType: "VL",
                      sampleId: row.sampleID,
                      sampleType: row.sampleType,
                      orderby: row.sampleOrderedBy,
                      orderbydate: row.sampleOrderDate,
                      collectedby: row.sampleCollectedBy,
                      datecollected: row.sampleCollectionDate,
                      timecollected: row.sampleCollectionTime
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
         </Card.Body>
       </Card>
    </div>
  );
}

export default SampleSearch;