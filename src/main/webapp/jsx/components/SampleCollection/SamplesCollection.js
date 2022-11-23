import React, {useEffect, useCallback, useState} from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SampleOrderLists from './SampleOrderLists';
import CreateAManifest from './CreateAManifest';
import PrintManifest from './PrintManifest';
import Stack from '@mui/material/Stack';
import axios from "axios";
import {token, url } from "../../../api";

function SampleCollection() {
const [activeStep, setActiveStep] = React.useState(0)
const [permissions, setPermissions] = useState([]);
const [config, setConfig] = useState([]);
const [submitted, setSubmitted] = useState(0);

const loadConfig = useCallback(async () => {
        try {
            const response = await axios.get(`${url}lims/configs`, { headers: {"Authorization" : `Bearer ${token}`} });
            //console.log("configs", response);
            setConfig(response.data)
        } catch (e) {
            console.log(e)
        }
    }, []);

      useEffect(() => {
        userPermission();
        loadConfig();
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

const nextStep = () => {
    if (activeStep < 2)
        setActiveStep((currentStep) => currentStep + 1)
}

const previousStep = () => {
    if (activeStep !== 0)
       setActiveStep((currentStep) => currentStep - 1)
}

const submitStatus = (status) => {

}


const renderContent = (step) => {
     switch (step) {
        case 0:
          return <SampleOrderLists setSubmitted={setSubmitted}/>;
        case 1:
          return <CreateAManifest setSubmitted={setSubmitted} />;
        case 2:
          return <PrintManifest />;
        default:
          return <div>Not Found</div>;
      }
}
return(
    <div>
        <Stepper activeStep={activeStep}>
            <Step>
                <StepLabel>Select Collected Samples</StepLabel>
            </Step>
            <Step>
                <StepLabel>Complete & Send Manifest Form</StepLabel>
            </Step>
            <Step>
                <StepLabel>Print Manifest</StepLabel>
            </Step>

        </Stepper>
        <br />
        <>

                { permissions.includes("all_permission") ?
                    <Stack direction="row" spacing={2}
                           m={1}
                           display="flex"
                           justifyContent="flex-end"
                           alignItems="flex-end">
                           <Button variant="outlined" color="primary" onClick={() => previousStep()}
                           disabled={config.length === 0 ? true : false || activeStep == 0 ? true : false}>Previous Page</Button>
                           {" "}
                           <Button variant="outlined" color="primary" onClick={() => nextStep()}
                           disabled={config.length === 0 ? true : false || activeStep == submitted ? true : false}>Next Page</Button>
                    </Stack> : " " }
              {renderContent(activeStep)}
        </>
    </div>
);
}

export default SampleCollection