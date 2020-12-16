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
import HeartbeatCard from "../components/HeartbeatCard";
import useAuth from "../../auth/useAuth";
import generatePongKey from "../components/Pong/utils/generatePongKey";



const HeartbeatScreen = (props) => {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [exampleTab, setExampleTab] = useState("python");

  const [showCallbackBasic, setShowCallbackBasic] = useState(false);

  const [heartbeatId, setHeartbeatId] = useState(null);
  const [heartbeatKey, setHeartbeatKey] = useState();
  const [heartbeatName, setHeartbeatName] = useState("");
  const [docLink, setDocLink] = useState("");
  const [incidentInterval, setIncidentInterval] = useState("");
  const [interval, setInterval] = useState("");
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
      fetchHeartbeat(parseInt(id));
      setHeartbeatId(parseInt(id));
    } else {
      setHeartbeatKey(generatePongKey());
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [props.match.params, refresh]);

  const fetchHeartbeat = async (id) => {
    const { data = null, error = null } = await api(`heartbeat/${id}/`);

    if (data) {
      setHeartbeatName(data.name);
      setDocLink(data.doc_link);
      setInterval(data.interval || "");
      setIncidentMethod(data.notification_type);
      setIncidentEndpoint(data.callback_url || "");
      setIncidentEndpointUser(data.callback_userame || "");
      setIncidentEndpointPass(data.callback_password || "");
      setIncidentInterval(data.incident_interval || "");
      setActive(data.active);
      setHeartbeatKey(data.push_key);

      fetchSummary(id);
    }

    if (error) {
      alert("Something went wrong, we cannot find your ping");
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

  const deleteHeartbeat = () => {};

  const saveHeartbeat = async (pingActive) => {
    const errors = validateForm();

    if (pingActive === null) {
      pingActive = active;
    }
    if (errors.length === 0) {
      const payload = {
        name: heartbeatName,
        doc_link: docLink,
        direction: "pull",
        notification_type: incidentMethod,
        callback_url: incidentEndpoint,
        callback_userame: incidentEndpointUser,
        callback_password: incidentEndpointPass,
        interval: interval,
        incident_interval: incidentInterval,
        active: pingActive,
        push_key: heartbeatKey,
      };

      let data = null;
      if (heartbeatId) {
        payload["id"] = heartbeatId;
        const res = await api(`heartbeat/${heartbeatId}/`, "PUT", payload);
        data = res.data;
      } else {
        const res = await api(`heartbeat/`, "POST", payload);
        data = res.data;
      }

      if (data) {
        history.push(`/heartbeat/${data.id}/`);
        setSaved(true);
      }
    }
  };

  const validateForm = () => {
    const errors = [];

    if (heartbeatName.trim().length === 0) {
      errors.push("name");
    }
    if (interval.toString().trim().length === 0) {
      errors.push("interval");
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
      `ping/summary/${id}/?direction=both`
    );

    if (data) {
      setSummary(data.pings[0]);
    }
    if (error) {
      alert("Something went wrong, we cannot find your ping");
    }
  };

  return (
    <Body
      title="Heartbeat Management"
      selectedMenu="heartbeat"
      {...props}
      loading={loading}
    >
      {summary && <HeartbeatCard m={summary} showSummary={false} showEdit={false} />}
      <Card>
        <Card.Body>
          <Card.Title>Heartbeat Details</Card.Title>
          <Card.Subtitle>
            onErrorLog will listen for heartbeat from your application within the specfied window.
            If your application does not send any heartbeat, it would trigger alert you or trigger
            a callback.
          </Card.Subtitle>
          <Row className="mt-3">
            <Col>
              <Row className="mt-3">
                <Col xs={12} sm={12} lg={6}>
                  <InputText
                    id="name"
                    label="Heartbeat Name"
                    value={heartbeatName}
                    isInvalid={formErrors.indexOf("name") > -1}
                    onChange={(e) => setValue(setHeartbeatName, e.target.value)}
                    helperText="Descriptive name to identify the heartbeats"
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
                id="interval"
                label="Heartbeat Window"
                defaultValue={interval}
                defaultText="Select an heartbeat window"
                helperText="The time window in hours, we should expect a heartbeat pong"
                showDefault={true}
                values={[
                  { value: "1", text: "1 Hours" },
                  { value: "3", text: "3 Hours" },
                  { value: "5", text: "5 Hours" },
                  { value: "10", text: "10 Hours" },
                  { value: "24", text: "24 Hours" },
                ]}
                isInvalid={formErrors.indexOf("interval") > -1}
                onChange={(e) => setValue(setInterval, e.target.value)}
              />
            </Col>
            {/* <Col xs={12} sm={12} lg={6}>
              <InputSelect
                id="frequency"
                label="Frequency"
                defaultValue={true}
                defaultText="Run frequency"
                helperText="onErrorLog will listen within the specified window (on_off) or will repeat every window"
                showDefault={true}
                values={[
                  { value: true, text: "On-off" },
                  { value: false, text: "Forever" },
                ]}
                isInvalid={formErrors.indexOf("incidentinterval") > -1}
                onChange={(e) => setValue(setIncidentInterval, e.target.value)}
              />
            </Col> */}
          </Row>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Notification Settings</Card.Title>
          <Card.Subtitle>
            Tell us what to do if we don't get a heartbeat request from your application
          </Card.Subtitle> 
          <Row className="pt-3">
            <Col xs={12} sm={12} lg={6}>
              <InputSelect
                id="incidentmethod"
                label="How would your link to be contacted"
                defaultValue={incidentMethod}
                defaultText="Select a contact method"
                helperText="The method that onErrorLog will contact you if we get a request from your heartbeat"
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
                              {showCallbackBasic
                                ? ` [-] basic authentication`
                                : ` [+] show basic authentication`}
                            </small>
                          </Button>
                        </Col>
                        <Col className="text-right">
                          {heartbeatId !== null && (
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
          <Card.Title>How To Send a Heartbeat</Card.Title>
          <Card.Subtitle>
            Below is the information that you'll need to send onErrorLog a heartbeat
          </Card.Subtitle>
          <Row className="mt-3">
            <Col xs={12} lg={6}>
              <InputText
                label={`Your Heartbeat URL`}
                value={`${API_URL}keepalive/${heartbeatKey}`}
                helperText={`Use this Heartbeat URL to send data to onErrorLog`}
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
                  Show examples of how to use a Heartbeat with your programming
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
                  <Python pongKey={heartbeatKey} api_url={API_URL} endpoint="keepalive"/>
                </Tab>
                <Tab eventKey="node" title="Node.js">
                  <Node pongKey={heartbeatKey} api_url={API_URL} endpoint="keepalive"/>
                </Tab>
                <Tab eventKey="java" title="Java">
                  <Java pongKey={heartbeatKey} api_url={API_URL} endpoint="keepalive"/>
                </Tab>
                <Tab eventKey="csharp" title="C#">
                  <CSharp pongKey={heartbeatKey} api_url={API_URL} endpoint="keepalive"/>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row>
        <Col className="text-left" xs={12} lg={6}>
          <DeleteButton
            pingId={heartbeatId}
            active={active}
            deleteAction={() => deleteHeartbeat()}
          />
          {saved && (
            <strong className="text-success">Your heartbeat has been saved.</strong>
          )}
        </Col>
        <Col className="text-right" xs={12} lg={6}>
          <EnableButton
            pingId={heartbeatId}
            active={active}
            isPong={true}
            enableAction={() => {
              setActive(true);
              saveHeartbeat(true);
            }}
          />
          <DisableButton
            pingId={heartbeatId}
            active={active}
            isPong={true}
            disableAction={() => {
              setActive(false);
              saveHeartbeat(false);
            }}
          />{" "}
          <Button
            variant="primary"
            onClick={() => saveHeartbeat(null)}
            className="btn-rounded"
          >
            Save Heartbeat
          </Button>
        </Col>
      </Row>

      <Headers
        showModal={showHeaderModal}
        setShowModal={setShowHeaderModal}
        headerType={headerType}
        pingId={heartbeatId}
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

export default HeartbeatScreen;
