import React, {useState, Fragment, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Row, Col, Card,  Tab, Tabs, } from "react-bootstrap";
import SampleCollection from './SampleCollection/SamplesCollection';
import ManifestList from './SampleCollection/ManifestList';
import {labObj} from './sampleObj'

const divStyle = {
  borderRadius: "2px",
  fontSize: 14,
};

const Home = (props) => {
    const [key, setKey] = useState('manifest-list');

    const urlTabs = props.location && props.location.state ? props.location.state : null ;

  useEffect ( () => {
    switch(urlTabs){
      case "existing-manifest": return setKey('manifest-list')
      case "collect-sample": return setKey('collection')
      case "sample-manifest": return setKey('manifest')
      default: return setKey('manifest-list')
    }
  }, [urlTabs]);


  return (
    <Fragment>
      <Row>
        <Col xl={12}>
          <Card style={divStyle}>
            <Card.Body>
              {/* <!-- Nav tabs --> */}
              <div className="custom-tab-1">
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3"
                    >
                       <Tab eventKey="manifest-list" title="Existing Manifest">
                         <ManifestList />
                        </Tab>
                        <Tab eventKey="collection" title="Create Manifest">
                         <SampleCollection />
                        </Tab>
                        {/*<Tab eventKey="manifest" title="Create Manifest">
                          <CreateManifest />
                        </Tab>*/}

                    </Tabs>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
      </Row>
    </Fragment>
  );
};

export default Home;
