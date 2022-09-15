import React, {useEffect, useCallback, useState, useRef, forwardRef} from 'react';
import Container from '@mui/material/Container';
import { Link, useHistory } from 'react-router-dom'
import { Row, Col, Card, Table } from "react-bootstrap";
import MaterialTable from 'material-table';
import MatButton from '@material-ui/core/Button';
import HomeIcon from '@mui/icons-material/Home';
import { Badge, Spinner } from 'reactstrap';
import Alert from 'react-bootstrap/Alert';
import AddResultModal from './AddResultModal';

import "./sample.css";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CachedIcon from '@mui/icons-material/Cached';

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
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import AddIcon from '@mui/icons-material/Add';
import PrintResults from './PrintResults';

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
    //console.log("maniObj",manifestObj)
    const permissions = history.location && history.location.state ? history.location.state.permissions : []

    const classes = useStyles();
    const [loading, setLoading] = useState(true)
    const [results, setResults] = useState([])

    const [open, setOpen] = useState(false)

    const handleOpen = () => setOpen(true);

    const toggleModal = () => setOpen(!open)

    const componentRef = useRef();

    const loadResults = useCallback(async () => {
        try {
            const response = await axios.get(`${url}lims/results/manifests/${manifestObj.id}`, { headers: {"Authorization" : `Bearer ${token}`} });
            console.log("results", response.data);

            if ( typeof response.data.results !== 'undefined') {
                   setResults(response.data.results);
                   setLoading(false)
            }
        } catch (e) {
//            toast.error("An error occurred while getting manifest results", {
//                position: toast.POSITION.TOP_RIGHT
//            });
            setLoading(false)
        }
    }, []);

    useEffect(() => {
        loadResults()
    }, [loadResults]);



    const resultTestType = e => {
        if(parseInt(e)===2){
            return <p><Badge  color="primary">Viral Load</Badge></p>
        }else if(parseInt(e)===1){
            return <p><Badge  color="info">EID</Badge></p>
        }
    }

    const reload = e => {
        console.log("reload results");
        loadResults();
    }

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
      });

  return (
    <div>
      <Card>
         <Card.Body>
           <p style={{textAlign: 'right'}}>
             <MatButton
                   variant="contained"
                   color="dark"
                   className={classes.button}
                   startIcon={<AddIcon />}
                   onClick={handleOpen}
               >
                   Add Result
               </MatButton>
             <MatButton
              variant="contained"
              color="success"
              className={classes.button}
              startIcon={<CachedIcon />}
              onClick={reload}>
              Refresh
            </MatButton>
              <MatButton
                  variant="contained"
                  color="success"
                  className={classes.button}
                  startIcon={<PrintIcon />}

                  onClick={handlePrint}
              >
                  Print
              </MatButton>

             <Link color="inherit"
               to={{pathname: "/"}}
                >
               <MatButton
                   variant="contained"
                   color="primary"
                   className={classes.button}
                   startIcon={<HomeIcon />}
                   >
                   back Home
               </MatButton>
              </Link>

             </p>
             <hr />
              {

                <>
                   <Alert style={{width:'100%',fontSize:'20px', backgroundColor: '#014d88', color: "#fff", textAlign: 'center'}}>
                          <Alert.Heading>PCR Sample Results</Alert.Heading>
                   </Alert>
                  <br/>
                  <PrintResults manifestObj={manifestObj} results={results} ref={componentRef}/>

                </>
              }

         </Card.Body>
       </Card>
       { open ?
        <AddResultModal modalstatus={open} togglestatus={toggleModal} manifestObj={manifestObj} results={results}/> : " "}
    </div>
  );
}

export default Result;