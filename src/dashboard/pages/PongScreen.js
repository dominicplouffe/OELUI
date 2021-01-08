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
import PongCard from "../components/PongCard";
import useAuth from "../../auth/useAuth";

const generatePongKey = () => {
  let keyParts = [];

  for (let i = 0; i < 4; i++) {
    let part = "";
    for (let j = 0; j < 6; j++) {
      part = `${part}${Math.floor(Math.random() * 10)}`;
    }
    keyParts.push(part);
  }

  const key = keyParts.join("-");

  return key;
};

const PongScreen = (props) => {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [exampleTab, setExampleTab] = useState("python");

  const [showCallbackBasic, setShowCallbackBasic] = useState(false);

  const [pongId, setPongId] = useState(null);
  const [pongKey, setPongKey] = useState();
  const [pongName, setPongName] = useState("");
  const [docLink, setDocLink] = useState("");
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

  const [summary, setSummary] = useState(null);

  const { refresh } = useAuth();

  let history = useHistory();
  useEffect(() => {
    const id = props.match.params.id;

    if (id !== "0") {
      fetchPong(parseInt(id));
      setPongId(parseInt(id));
    } else {
      setPongKey(generatePongKey());
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [props.match.params, refresh]);

  const fetchPong = async (id) => {
    const { data = null, error = null } = await api(`pong/${id}/`);

    if (data) {
      setPongName(data.name);
      setDocLink(data.alert.doc_link);
      setIncidentMethod(data.alert.notification_type);
      setIncidentEndpoint(data.alert.callback_url || "");
      setIncidentEndpointUser(data.alert.callback_username || "");
      setIncidentEndpointPass(data.alert.callback_password || "");
      setIncidentInterval(data.alert.incident_interval || "");
      setActive(data.active);
      setPongKey(data.push_key);

      fetchSummary(id);
    }

    if (error) {
      alert("Something went wrong, we cannot find your pong");
    }

    setLoading(false);
  };

  const setValue = (method, value) => {
    if (method === setIncidentMethod) {
      if (value === "team") {
        setIncidentEndpoint(null);
        setIncidentEndpointPass("");
        setIncidentEndpointUser("");
      }
    }
    method(value);
  };

  const deletePong = async () => {
    await api(`pong/${pongId}/`, "DELETE");

    history.push("/pongs");
  };

  const savePong = async (pongActive) => {
    const errors = validateForm();

    if (pongActive === null) {
      pongActive = active;
    }
    if (errors.length === 0) {
      const payload = {
        name: pongName,
        doc_link: docLink,
        direction: "pull",
        notification_type: incidentMethod,
        callback_url: incidentEndpoint,
        callback_username: incidentEndpointUser,
        callback_password: incidentEndpointPass,
        incident_interval: incidentInterval,
        active: pongActive,
        push_key: pongKey,
      };

      let data = null;
      if (pongId) {
        payload["id"] = pongId;
        const res = await api(`pong/${pongId}/`, "PUT", payload);
        data = res.data;
      } else {
        const res = await api(`pong/`, "POST", payload);
        data = res.data;
      }

      if (data) {
        history.push(`/pong/${data.id}/`);
        setSaved(true);
      }
    }
  };

  const validateForm = () => {
    const errors = [];

    if (pongName.trim().length === 0) {
      errors.push("name");
    }
    if (incidentInterval.toString().trim().length === 0) {
      errors.push("incidentinterval");
    }

    if (incidentMethod.trim().length === 0) {
      errors.push("incidentmethod");
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

  const fetchSummary = async (id) => {
    const { data = null, error = null } = await api(
      `pong/summary/${id}/?direction=push`
    );

    if (data) {
      setSummary(data.pongs[0]);
    }
    if (error) {
      alert("Something went wrong, we cannot find your pong");
    }
  };

  return (
    <Body
      title="Pong Management"
      selectedMenu="pong"
      {...props}
      loading={loading}
    >
      {summary && <PongCard m={summary} showSummary={false} showEdit={false} />}
      <Card>
        <Card.Body>
          <Card.Title>Notification Settings</Card.Title>
          <Card.Subtitle>
            Tell us what to do when we get a request from your pong
          </Card.Subtitle>
          <Row className="mt-3">
            <Col>
              <Row className="mt-3">
                <Col xs={12} sm={12} lg={6}>
                  <InputText
                    id="name"
                    label="Pong Name"
                    value={pongName}
                    isInvalid={formErrors.indexOf("name") > -1}
                    onChange={(e) => setValue(setPongName, e.target.value)}
                  />
                </Col>
                <Col xs={12} sm={12} lg={6}>
                  <InputText
                    id="doc_link"
                    label="Documentation URL"
                    value={docLink}
                    onChange={(e) => setValue(setDocLink, e.target.value)}
                    helperText={
                      <>
                        <span>
                          If you want to send a URL to your on-call team with
                          some documenation on the procedures to confirm and
                          resolve a failure, you enter it here. The URL will be
                          sent along with all failure notifications.
                        </span>
                      </>
                    }
                  />
                </Col>
              </Row>
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
                  {
                    value: "team",
                    text: "Notify your team (email or text message)",
                  },
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
                helperText="onErrorLog will contact you have this many pongs have failed"
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
                              {showCallbackBasic
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

      <Card className="hide-small">
        <Card.Body>
          <Card.Title>How To Send a Pong</Card.Title>
          <Card.Subtitle>
            Below is the information that you'll need to send onErrorLog a pong
          </Card.Subtitle>
          <Row className="mt-3">
            <Col xs={12} lg={6}>
              <InputText
                label={`Your Pong URL`}
                value={`${API_URL}pongme/${pongKey}`}
                helperText={`Use this Pong URL to send data to onErrorLog`}
                disabled={true}
                copy={true}
                id="api-url"
              />
            </Col>
            <Col xs={12} lg={6}></Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <div className="card-title h5 pb-0 mb-0">Examples</div>
              <div className="pl-1 pb-3">
                <small>
                  Show examples of how to use a Pong with your programming
                  language.
                </small>
              </div>

              <Tabs
                id="example-code-tabs"
                activeKey={exampleTab}
                onSelect={(k) => setExampleTab(k)}
                className="pl-3 pr-3"
              >
                <Tab eventKey="python" title="Python">
                  <Python pongKey={pongKey} />
                </Tab>
                <Tab eventKey="node" title="Node.js">
                  <Node pongKey={pongKey} />
                </Tab>
                <Tab eventKey="java" title="Java">
                  <Java pongKey={pongKey} />
                </Tab>
                <Tab eventKey="csharp" title="C#">
                  <CSharp pongKey={pongKey} />
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row>
        <Col className="text-left" xs={12} lg={6}>
          <DeleteButton
            pongId={pongId}
            active={active}
            deleteAction={() => deletePong()}
            isPong={true}
          />
          {saved && (
            <strong className="text-success">Your pong has been saved.</strong>
          )}
        </Col>
        <Col className="text-right" xs={12} lg={6}>
          <EnableButton
            objectId={pongId}
            active={active}
            isPong={true}
            enableAction={() => {
              setActive(true);
              savePong(true);
            }}
          />
          <DisableButton
            objectId={pongId}
            active={active}
            isPong={true}
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

      {/* <Headers
        showModal={showHeaderModal}
        setShowModal={setShowHeaderModal}
        headerType={headerType}
        pongId={pongId}
      /> */}

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
