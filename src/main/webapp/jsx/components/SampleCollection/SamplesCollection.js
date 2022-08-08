import * as React from 'react';
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

function SampleCollection() {
const [activeStep, setActiveStep] = React.useState(0)

const nextStep = () => {
    if (activeStep < 2)
        setActiveStep((currentStep) => currentStep + 1)
}

const previousStep = () => {
    if (activeStep !== 0)
       setActiveStep((currentStep) => currentStep - 1)
}

const renderContent = (step) => {
     switch (step) {
        case 0:
          return <SampleOrderLists />;
        case 1:
          return <CreateAManifest />;
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
                <StepLabel>Complete Manifest Form</StepLabel>
            </Step>
            <Step>
                <StepLabel>Print Manifest</StepLabel>
            </Step>

        </Stepper>
        <br />
        <>
            {renderContent(activeStep)}
            <br />
            <br />

                    <Stack direction="row" spacing={2}
                           m={1}
                           display="flex"
                           justifyContent="flex-end"
                           alignItems="flex-end">
                           <Button variant="outlined" color="primary" onClick={() => previousStep()}
                           >Previous Step</Button>
                           {" "}
                           <Button variant="outlined" color="primary" onClick={() => nextStep()}
                           disabled={activeStep == 2 ? true : false}>Next Step</Button>
                    </Stack>



        </>
    </div>
);
}

export default SampleCollection