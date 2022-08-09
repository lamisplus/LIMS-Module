import React, {useEffect, useCallback, useState, useRef} from 'react';
import Container from '@mui/material/Container';
import { Link, useHistory } from 'react-router-dom'
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

import { makeStyles } from '@material-ui/core/styles'
import ManifestPrint from './ManifestPrint';
import MatButton from '@material-ui/core/Button'
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import HomeIcon from '@mui/icons-material/Home';

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

const PrintManifest = (props) => {
    let history = useHistory();
    const sampleObj = history.location && history.location.state ? history.location.state.sampleObj : {}
    console.log("props",sampleObj)
    const classes = useStyles();
    const [loading, setLoading] = useState('')
    const [collectedSamples, setCollectedSamples] = useState([])
    const manifestData = []
    const [saved, setSaved] = useState(false);
    const [localStore, SetLocalStore] = useState([]);

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
      });

    useEffect(() => {
      const manifests = JSON.parse(localStorage.getItem('manifest'));
      if (manifests) {
        SetLocalStore(manifests);
        localStorage.clear();
      }else {
        SetLocalStore(sampleObj)
      }
    }, []);

  return (
      <div>
      <Card>
         <Card.Body>

            <p style={{textAlign: 'right'}}>
            <MatButton
                 variant="contained"
                 color="success"
                 className={classes.button}
                 startIcon={<PrintIcon />}
                 //disabled={saved ? false: true}
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
                     startIcon={<HomeIcon />}>
                     back Home
                 </MatButton>
                </Link>
               </p>
            <ManifestPrint sampleObj={localStore} ref={componentRef}/>
         </Card.Body>
       </Card>
    </div>
  );
}

export default PrintManifest;