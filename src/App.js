import React from "react";
import {
  MemoryRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./main/webapp/vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
import "./../src/main/webapp/css/style.css";

import Home from './main/webapp/jsx/components/Home'
import SampleCollection from './main/webapp/jsx/components/SampleCollection/SamplesCollection';
import PrintManifest from './main/webapp/jsx/components/SampleCollection/PrintManifest';
import SampleSearch from './main/webapp/jsx/components/SampleCollection/SampleOrderLists';

export default function App() {
  return (
      <div>
      <ToastContainer />
        <Switch>
         <Route path="/print-manifest">
             <PrintManifest />
           </Route>
         <Route path="/create-manifest">
            <SampleCollection />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
  );
}




