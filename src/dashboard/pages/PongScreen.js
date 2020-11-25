import React, { useState, useEffect } from "react";
import Body from "../components/Body";
import { API_URL } from "../../utils/globals";
import api from "../../utils/api";
import { useHistory } from "react-router-dom";
import { Card, Row, Col, Button, Tabs, Tab } from "react-bootstrap";
import InputText from "../components/InputText";
import InputSelect from "../components/InputSelect";
import Python from "../components/Pong/Examples/Python";
import Node from "../components/Pong/Examples/Node";
import Java from "../components/Pong/Examples/Java";
import CSharp from "../components/Pong/Examples/CSharp";
import Headers from "../components/Headers";
import DisableButton from "../components/Ping/DisableButton";
import EnableButton from "../components/Ping/EnableButton";
import DeleteButton from "../components/Ping/DeleteButton";

const PongScreen = (props) => {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [exampleTab, setExampleTab] = useState("python");
  const [showExamples, setShowExamples] = useState(false);

  const [showBasic, setShowBasic] = useState(false);
  const [showCallbackBasic, setShowCallbackBasic] = useState(false);

  const [pongId, setPongId] = useState(null);
  const [pongKey, setPongKey] = useState("");
  const [pongName, setPongName] = useState("");
  const [incidentInterval, setIncidentInterval] = useState("");
  const [incidentMethod, setIncidentMethod] = useState("");
  const [incidentEmail, setIncidentEmail] = useState("");
  const [incidentEndpoint, setIncidentEndpoint] = useState("");
  const [incidentEndpointUser, setIncidentEndpointUser] = useState("");
  const [incidentEndpointPass, setIncidentEndpointPass] = useState("");
  const [showHeaderModal, setShowHeaderModal] = useState(false);
  const [headerType, setHeaderType] = useState("endpoint");
  const [active, setActive] = useState(true);

  const [formErrors, setFormErrors] = useState([""]);

  let history = useHistory();
  useEffect(() => {
    const id = props.match.params.id;

    if (id !== "0") {
      fetchPong(parseInt(id));
      setPongId(parseInt(id));
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [props.match.params]);

  const fetchPong = async (id) => {
    const { data = null, error = null } = await api(`pingpong/${id}/`);

    if (data) {
      setPongName(data.name);

      setIncidentInterval(data.incident_interval || "");
      setIncidentEmail(data.callback_email || "");
      setIncidentEndpoint(data.callback_url || "");
      setIncidentEndpointUser(data.callback_userame || "");
      setIncidentEndpointPass(data.callback_password || "");
      setActive(data.active);

      if (data.callback_email) {
        setIncidentMethod("email");
      } else {
        setIncidentMethod(`callback`);
      }
    }

    if (error) {
      alert("Something went wrong, we cannot find your ping");
    }

    setLoading(false);
  };

  const setValue = (method, value) => {
    if (method === setIncidentMethod) {
      if (value === "email") {
        setIncidentEndpoint(null);
        setIncidentEndpointPass("");
        setIncidentEndpointUser("");
      } else {
        setIncidentEmail(null);
      }
    }
    method(value);
  };

  const deletePong = () => {};

  const savePong = async (pingActive) => {
    const errors = valdidateForm();

    if (pingActive === null) {
      pingActive = active;
    }

    if (errors.length === 0) {
      const payload = {
        name: pongName,
        callback_url: incidentEndpoint,
        callback_userame: incidentEndpointUser,
        callback_password: incidentEndpointPass,
        callback_email: incidentEmail,
        incident_interval: incidentInterval,
        active: pingActive,
        pingpong_type: "pong",
        pong_key: pongKey,
      };

      let data = null;
      if (pongId) {
        payload["id"] = pongId;
        const res = await api(`pingpong/${pongId}/`, "PUT", payload);
        data = res.data;
      } else {
        const res = await api(`pingpong/`, "POST", payload);
        data = res.data;
      }

      if (data) {
        history.push(`/pong/${data.id}/`);
        setSaved(true);
      }
    }
  };

  const valdidateForm = () => {
    const errors = [];

    if (pongName.trim().length === 0) {
      errors.push("name");
    }
    if (incidentInterval.toString().trim().length === 0) {
      errors.push("incidentinterval");
    }
    if (incidentMethod.trim().length === 0) {
      errors.push("incidentmethod");
    } else if (incidentMethod === "email") {
      if (incidentEmail.length === 0) {
        errors.push("incidentemail");
      }
    } else if (incidentMethod === "callback") {
      if (incidentEndpoint.trim().length === 0) {
        errors.push("incidentendpoint");
      } else {
        if (
          incidentEndpointUser.trim().length > 0 &&
          incidentEndpointPass.trim().length === 0
        ) {
          setShowCallbackBasic(true);
          errors.push("callbackpassword");
        }
        if (
          incidentEndpointPass.trim().length > 0 &&
          incidentEndpointUser.trim().length === 0
        ) {
          setShowCallbackBasic(true);
          errors.push("callbackusername");
        }
      }
    }

    setFormErrors(errors);
    return errors;
  };

  const generatePongKey = () => {
    if (pongKey.length !== 0) {
      return pongKey;
    }
    let keyParts = [];

    for (let i = 0; i < 4; i++) {
      let part = "";
      for (let j = 0; j < 6; j++) {
        part = `${part}${Math.floor(Math.random() * 10)}`;
      }
      keyParts.push(part);
    }

    const key = keyParts.join("-");
    setPongKey(key);

    return key;
  };

  return (
    <Body
      title="Pong Management"
      selectedMenu="pong"
      {...props}
      loading={loading}
    >
      <Card>
        <Card.Body>
          <Card.Title>Pong Details</Card.Title>
          <Card.Subtitle>
            Below is the information that you'll need to send onErrorLog a pong
          </Card.Subtitle>
          <Row>
            <Col xs={12} lg={6}>
              <InputText
                label={`Your Pong URL`}
                value={`${API_URL}pongme`}
                helperText={`Use this Pong URL to send data to onErrorLog`}
                disabled={true}
                copy={true}
                id="api-url"
              />
            </Col>
            <Col xs={12} lg={6}>
              <InputText
                label={`Your Pong Key`}
                value={generatePongKey()}
                helperText={`Use your Pong key in your HTTP Headers.  Header Name: X-Auth`}
                disabled={true}
                copy={true}
                id="pong-key"
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <Button
                variant="link"
                className="m-0 p-0"
                onClick={() => setShowExamples(!showExamples)}
              >
                {!showExamples && (
                  <div className="card-title h5">[+] Show Examples</div>
                )}
                {showExamples && (
                  <div className="card-title h5">[-] Hide Examples</div>
                )}
              </Button>
              {!showExamples && (
                <div className="pl-1">
                  <small>
                    Show examples of how to use a Pong with your programming
                    language.
                  </small>
                </div>
              )}
              {showExamples && (
                <Tabs
                  id="example-code-tabs"
                  activeKey={exampleTab}
                  onSelect={(k) => setExampleTab(k)}
                  className="pl-3 pr-3"
                >
                  <Tab eventKey="python" title="Python">
                    <Python />
                  </Tab>
                  <Tab eventKey="node" title="Node.js">
                    <Node />
                  </Tab>
                  <Tab eventKey="java" title="Java">
                    <Java />
                  </Tab>
                  <Tab eventKey="csharp" title="C#">
                    <CSharp />
                  </Tab>
                </Tabs>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title>Notification Settings</Card.Title>
          <Card.Subtitle>
            Tell us what to do when we get a request from your pong
          </Card.Subtitle>
          <Row className="mt-3">
            <Col>
              <InputText
                id="name"
                label="Ping Name"
                value={pongName}
                isInvalid={formErrors.indexOf("name") > -1}
                onChange={(e) => setValue(setPongName, e.target.value)}
              />
            </Col>
          </Row>
          <Row className="pt-3">
            <Col xs={12} sm={12} lg={6}>
              <InputSelect
                id="incidentmethod"
                label="How would your link to be contacted"
                defaultValue={incidentMethod}
                defaultText="Select a contact method"
                helperText="The method that onErrorLog will contact you if we get a request from your pong"
                showDefault={true}
                values={[
                  { value: "email", text: "Email" },
                  { value: "callback", text: "HTTP Callback" },
                ]}
                onChange={(e) => setValue(setIncidentMethod, e.target.value)}
                isInvalid={formErrors.indexOf("incidentmethod") > -1}
              />
            </Col>
            <Col xs={12} sm={12} lg={6}>
              <InputSelect
                id="incidentinternal"
                label="Minimum Incident Count"
                defaultValue={incidentInterval}
                defaultText="Select an incident count"
                helperText="onErrorLog will contact you have this many pings have failed"
                showDefault={true}
                values={[
                  { value: "1", text: "Tell us right away" },
                  { value: "2", text: "2 Incidents" },
                  { value: "5", text: "5 Incidents" },
                  { value: "10", text: "10 Incidents" },
                ]}
                isInvalid={formErrors.indexOf("incidentinterval") > -1}
                onChange={(e) => setValue(setIncidentInterval, e.target.value)}
              />
            </Col>
          </Row>

          {incidentMethod === "email" && (
            <Row className="pt-3 pl-2">
              <Col xs={12} sm={12} lg={6}>
                <InputText
                  id="incidentemail"
                  label="Contact Email"
                  value={incidentEmail}
                  placeholder="incident-report@mydomain.com"
                  helperText="The email address onErrorLog will contact when it finds an incident"
                  isInvalid={formErrors.indexOf("incidentemail") > -1}
                  onChange={(e) => {
                    setValue(setIncidentEmail, e.target.value);
                  }}
                />
              </Col>
            </Row>
          )}
          {incidentMethod === "callback" && (
            <Row className="pt-3">
              <Col xs={12} sm={12} lg={6}>
                <InputText
                  id="incidentenpoint"
                  label="HTTP Callback URL"
                  value={incidentEndpoint}
                  placeholder="https://www.mydomain.com/callback"
                  helperText={
                    <>
                      <span>
                        The callback that onErrorLog will hit when it finds an
                        incident (only POSTs are supported)
                      </span>
                      <Row>
                        <Col>
                          <Button
                            variant="link"
                            className="p-0 m-0 btn-link"
                            onClick={() =>
                              setValue(setShowCallbackBasic, !showCallbackBasic)
                            }
                          >
                            <small>
                              {showBasic
                                ? ` [-] basic authentication`
                                : ` [+] show basic authentication`}
                            </small>
                          </Button>
                        </Col>
                        <Col className="text-right">
                          {pongId !== null && (
                            <Button
                              variant="link"
                              className="p-2 m-0 btn-link"
                              onClick={() => {
                                setShowHeaderModal(true);
                                setHeaderType("callback");
                              }}
                            >
                              <small>My endpoint needs headers</small>
                            </Button>
                          )}
                        </Col>
                      </Row>
                    </>
                  }
                  isInvalid={formErrors.indexOf("incidentendpoint") > -1}
                  onChange={(e) => {
                    setValue(setIncidentEndpoint, e.target.value);
                  }}
                />
              </Col>
              <Col>
                <strong>About Callbacks</strong>
                <small>
                  <div>
                    Callbacks will be sent in the case that an incident is
                    triggered. If everything is working properly, the callback
                    will be not initiated.
                  </div>
                  <Row className="mt-2">
                    <Col>
                      <strong>Method</strong>: POST
                    </Col>
                    <Col>
                      <strong>Body Content Type</strong>: application/json
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <strong>Body Fields:</strong> http_status_code, reason,
                      response_time
                    </Col>
                  </Row>
                </small>
              </Col>
            </Row>
          )}
          {showCallbackBasic && (
            <Row className="pt-2 pl-2">
              <Col xs={12} sm={12} lg={6}>
                <InputText
                  id="callbackusenrame"
                  label="Username (OPTIONAL)"
                  value={incidentEndpointUser}
                  placeholder=""
                  helperText="The username if your BASIC authentication for your callback endpoint."
                  isInvalid={formErrors.indexOf("callbackusername") > -1}
                  onChange={(e) =>
                    setValue(setIncidentEndpointUser, e.target.value)
                  }
                />
              </Col>
              <Col xs={12} sm={12} lg={6}>
                <InputText
                  id="callbackpassword"
                  label="Password (OPTIONAL)"
                  value={incidentEndpointPass}
                  placeholder=""
                  helperText="The password if your BASIC authentication for your callback endpoint."
                  type="password"
                  isInvalid={formErrors.indexOf("callbackpassword") > -1}
                  onChange={(e) =>
                    setValue(setIncidentEndpointPass, e.target.value)
                  }
                />
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      <Row>
        <Col className="text-left">
          <DeleteButton
            pingId={pongId}
            active={active}
            deleteAction={() => deletePong()}
          />
          {saved && (
            <strong className="text-success">Your pong has been saved.</strong>
          )}
        </Col>
        <Col className="text-right">
          <EnableButton
            pingId={pongId}
            active={active}
            enableAction={() => {
              setActive(true);
              savePong(true);
            }}
          />
          <DisableButton
            pingId={pongId}
            active={active}
            disableAction={() => {
              setActive(false);
              savePong(false);
            }}
          />{" "}
          <Button
            variant="primary"
            onClick={() => savePong(null)}
            className="btn-rounded"
          >
            Save Pong
          </Button>
        </Col>
      </Row>

      <Headers
        showModal={showHeaderModal}
        setShowModal={setShowHeaderModal}
        headerType={headerType}
        pingId={pongId}
      />

      {/* <Card>
        <Card.Body>
          <Card.Title>Notification Condition</Card.Title>
          <Card.Subtitle>this should be somehting here</Card.Subtitle>
          <Row>
            <Col>
              <Condition />
            </Col>
          </Row>
        </Card.Body>
      </Card> */}
    </Body>
  );
};

export default PongScreen;
