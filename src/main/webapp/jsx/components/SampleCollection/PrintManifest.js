import React, {useEffect, useCallback, useState, useRef} from 'react';
import Container from '@mui/material/Container';
import { Link, useHistory } from 'react-router-dom'
import { connect } from "react-redux";
import { Row, Col, Card } from "react-bootstrap";
import Alert from 'react-bootstrap/Alert';

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
import SendIcon from '@mui/icons-material/Send';

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
    const [send, setSend] = useState(false);

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

     const sendManifest = async (e) => {
        e.preventDefault()
         await axios.get(`${url}lims/ready-manifests/${localStore.id}`, { headers: {"Authorization" : `Bearer ${token}`} })
            .then((resp) => {
                console.log("sending manifest", resp)
                if (resp.data.errors.length > 0) {
                    toast.error(resp.data.errors[0].reasons, {
                        position: toast.POSITION.TOP_RIGHT
                     });
                     setSend(true)
                }
                else {
                     toast.success("Sample manifest sent successfully to PCR Lab.", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    setSend(true)
                }

            })
     }

  return (
      <div>
      <Card>
         <Card.Body>
         { Object.keys(localStore).length === 0 ?
               <Alert variant='danger' style={{width:'100%',fontSize:'18px', textAlign: 'center'}}>
                 <b>Sample Manifest</b> not created yet. pls complete the manifest form.
               </Alert>
             :
            <>
            <p style={{textAlign: 'right'}}>
            { localStore.manifestStatus === "Ready" ?
                <MatButton
                     variant="contained"
                     color="success"
                     className={classes.button}
                     startIcon={<SendIcon />}
                     disabled={!send ? false : true}
                     onClick={sendManifest}
                 >
                     Send Manifest
                 </MatButton> : " "
            }

            <MatButton
                 variant="contained"
                 color="success"
                 className={classes.button}
                 startIcon={<PrintIcon />}
                 disabled={!send ? false : true}
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
                  <Link color="inherit"
                     to={{pathname: "/result", state: { manifestObj: localStore }}}
                      >
                     <MatButton
                         variant="contained"
                         color="secondary"
                         className={classes.button}
                         startIcon={<HomeIcon />}>
                         Results
                     </MatButton>
                    </Link>
               </p>
            <ManifestPrint sampleObj={localStore} ref={componentRef}/>
            </>
            }
         </Card.Body>
       </Card>
    </div>
  );
}

export default PrintManifest;