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

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

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

const DownloadManifest = (props) => {
    const classes = useStyles();
    const [loading, setLoading] = useState('')
    const [collectedSamples, setCollectedSamples] = useState([])

       const loadManifestData = useCallback(async () => {
                try {
                    //const response = await axios.get(`${url}laboratory/orders/pending-sample-collection`, { headers: {"Authorization" : `Bearer ${token}`} });
                    //console.log("lab test", response);
                    setCollectedSamples([{
                        "manifestId": "FADF-12323",
                        "manifestDate": "2022-07-20",
                        "manifestTime": "16:15:21",
                        "createdBy": "Admin",
                        "status": "Approved"
                    },
                    {
                        "manifestId": "pADF-12323",
                        "manifestDate": "2022-07-20",
                        "manifestTime": "16:15:21",
                        "createdBy": "Mike M",
                        "status": "Available"
                    },{
                      "manifestId": "hADF-00001",
                      "manifestDate": "2022-07-20",
                      "manifestTime": "17:15:21",
                      "createdBy": "Hanna .N",
                      "status": "Available"
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

             loadManifestData();

         }, [loadManifestData]);

  return (
    <>
       <div>
           <Stack direction="row" spacing={2}
           m={1}
           display="flex"
           justifyContent="flex-end"
           alignItems="flex-end">
                <Link color="inherit"
                    to={{pathname: "/samples"}}
                     >
                    <Button variant="outlined" color="success">
                       Create Manifest
                    </Button>
                </Link>

            </Stack>
           <br />
       </div>
       <div>
              <MaterialTable
               icons={tableIcons}
                  title="Existing Manifest List"
                  columns={[
                      { title: "Manifest Id", field: "manifestId" },
                      { title: "Created By", field: "createdby" },
                      { title: "Created Date", field: "manifest_date" },
                      {
                        title: "Status",
                        field: "status",
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
                          manifestId: row.manifestId,
                          createdby: row.createdBy,
                          manifest_date: row.manifestDate + '@' + row.manifestTime,
                          status: row.status,

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
                            backgroundColor: "#9F9FA5",
                            color: "#000",
                        },
                        searchFieldStyle: {
                            width : '300%',
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
       </div>
    </>
  );
}

export default DownloadManifest;