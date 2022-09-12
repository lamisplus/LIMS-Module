import React, {useEffect, useCallback, useState} from 'react';
import Container from '@mui/material/Container';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom'
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { MdDashboard, MdDeleteForever, MdModeEdit, MdPerson } from "react-icons/md";
import {Menu,MenuList,MenuButton,MenuItem,} from "@reach/menu-button";
import { alpha } from '@material-ui/core/styles'
import SplitActionButton from './SplitActionButton';

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
import "@reach/menu-button/styles.css";
import {FaEye, FaUserPlus} from "react-icons/fa";

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
    },
    error: {
        color: "#f85032",
        fontSize: "11px",
    },
    success: {
        color: "#4BB543 ",
        fontSize: "11px",
    },
}));

const DownloadManifest = (props) => {
    const classes = useStyles();
    const [loading, setLoading] = useState('')
    const [collectedSamples, setCollectedSamples] = useState([])
    const [permissions, setPermissions] = useState([]);

     useEffect(() => {
            userPermission();
          }, []);

        const userPermission =()=>{
            axios
                .get(`${url}account`,
                    { headers: {"Authorization" : `Bearer ${token}`} }
                )
                .then((response) => {
                    //console.log("permission", response.data.permissions)
                    setPermissions(response.data.permissions);

                })
                .catch((error) => {
                });
        }

         const loadManifestData = useCallback(async () => {
            try {
                const response = await axios.get(`${url}lims/manifests`, { headers: {"Authorization" : `Bearer ${token}`} });
                //console.log("manifest", response);
                setCollectedSamples(response.data);
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

             loadManifestData();

         }, [loadManifestData]);

     const actionItems = row => {
          return  [
          {...(permissions.includes('view_manifest') || permissions.includes("all_permission") &&
              {
                  name:'View',
                  type:'link',
                  icon:<FaEye  size="22"/>,
                  to:{
                      pathname: "/print-manifest",
                      state: { sampleObj: row, permissions:permissions  }
                  }
              }
          )},
//              {...(permissions.includes('view_patient') || permissions.includes("all_permission")&&
//                      {
//                          name:'Print Manifest',
//                          type:'link',
//                          icon:<MdPerson size="20" color='rgb(4, 196, 217)' />,
//                          to:{
//                              pathname: "/print-manifest",
//                              state: { sampleObj: row, permissions:permissions  }
//                          }
//                      }
//              )},

              {...(permissions.includes('view_result') || permissions.includes("all_permission") &&
                      {
                          name:' Results',
                          type:'link',
                          icon:<FaEye size="20" color='rgb(4, 196, 217)' />,
                          to:{
                              pathname: "/result",
                              state: { manifestObj: row, permissions:permissions }
                          }
                      }
                  )},
              {...(permissions.includes('add_result') || permissions.includes("all_permission") &&
                      {
                          name:'Add Result',
                          type:'link',
                          icon:<MdModeEdit size="20" color='rgb(4, 196, 217)'  />,
                          to:{
                              pathname: "/add-result",
                              state: { manifestObj: row, permissions:permissions }
                          }
                      }
                  )}
           ]
       }

  return (
    <>
       <div>
           {/*<Stack direction="row" spacing={2}
           m={1}
           display="flex"
           justifyContent="flex-end"
           alignItems="flex-end">
                <Link color="inherit"
                    to={{pathname: "/create-manifest"}}
                     >
                    <Button variant="outlined" color="primary">
                       Create Manifest
                    </Button>
                </Link>

            </Stack>
           <br />*/}
       </div>
       <div>
              <MaterialTable
               icons={tableIcons}
                  title="Previous Manifests"
                  columns={[
                      { title: "Manifest Id", field: "manifestId" },
                      { title: "Pickup Date", field: "pickupDate" },
                      { title: "Created Date", field: "createDate" },
                      { title: "Receiving Lab", field: "lab" },
                       { title: "Packaged By", field: "packaged_by" },
                       { title: "Total Samples", field: "samples" },
                      {
                        title: "Status",
                        field: "status",
                      },
                      {
                        title: "Action",
                        field: "actions",
                        filtering: false,
                      },
                  ]}
                  isLoading={loading}
                  data={ collectedSamples.map((row) => (
                        {
                          manifestId: row.manifestID,
                          pickupDate: row.dateScheduledForPickup.replace('T', ' '),
                          createDate: row.createDate.replace('T', ' '),
                          lab: row.receivingLabName,
                          packaged_by: row.samplePackagedBy,
                          samples: row.sampleInformation.length,
                          status: row.manifestStatus,

                          actions:
                            <div>
                               <SplitActionButton actions={actionItems(row)} />
                            </div>

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
       </div>
    </>
  );
}

export default DownloadManifest;