import React, { useState, useEffect } from "react";
import Body from "../components/Body";
import { Card, Row, Col, ProgressBar, Table, Button } from "react-bootstrap";
import moment from "moment";
import api from "../../utils/api";
import AlertCard from "../components/AlertCard";
import useAuth from "../../auth/useAuth";
import { Link } from "react-router-dom";
import FailureStatus from "../components/FailureStatus";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { REASONS } from "../../utils/globals";
import { useParams } from 'react-router-dom';


const trigger_desc = {
  complete_not_triggered_in: "Complete endpoint has not been requested in",
  start_not_triggered_in: "Start endpoint has not been requested in",
  runs_less_than: "Task runs in less than",
  runs_more_than: "Task runs for more than",
  heartbeat_triggered: "Your heartbeat fail was triggered",
};

const PongSummary = ({ currentUser }) => {
  const [summary, setSummary] = useState(null);
  const [pong, setPong] = useState(null);
  const [hours, setHours] = useState(24);
  const [responseTimeData, setResponseTimeData] = useState(null);
  const [failureCounts, setFailureCounts] = useState([]);
  const [failures, setFailures] = useState([]);
  const [otherPongs, setOtherPongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  const { refresh } = useAuth();

  const useFetchInterval = (delay) => {
    const [doFetch, setDoFetch] = useState(true);
    useEffect(() => {
      const handler = setInterval(() => {
        fetchAll();
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [delay, setDoFetch]);
    return doFetch;
  };

  const fetchPong = async (id) => {
    const { data = null, error = null } = await api(`pong/${id}/`);

    if (data) {
      console.log(data);
      setPong(data);
    }

    if (error) {
      alert("Something went wrong, we cannot find your pong");
    }
  };

  const fetchSummary = async (id) => {
    const { data = null, error = null } = await api(`alert_summary/pong/${id}/?direction=push&hours=${hours}`);

    if (data) {
      setSummary(data.objects[0]);

      const resData = [];

      for (let i = 0; i < data.objects[0].snapshot.length; i++) {
        const ss = data.objects[0].snapshot[i];
        let name = `${moment(ss.date).format("H")}:00`;

        if (data.objects[0].snapshot.length > 24) {
          name = `${moment(ss.date).format("MM-DD")}`;
        }
        const row = {
          name: name,
          response_ms: null,
        };
        if (ss.status) {
          row.response_ms = parseInt(ss.avg_res * 1000);
        }

        resData.push(row);
      }

      setResponseTimeData(resData);

      fetchFailreCounts(data.objects[0].object.alert.id);
      fetchFailures(data.objects[0].object.alert.id);
    }
    if (error) {
      alert("Something went wrong, we cannot find your pong");
    }
  };

  const fetchFailreCounts = async (id) => {
    const { data = null, error = null } = await api(`failure/counts/${id}/`);

    setFailureCounts(data);

    if (error) {
      alert("Something went wrong, we cannot find your pong");
    }
  };

  const fetchFailures = async (id) => {
    const { data = null, error = null } = await api(`failure/?alert=${id}&ordering=-created_on&offset=0&limit=100`);

    setFailures(data.results);

    if (error) {
      alert("Something went wrong, we cannot find your pong");
    }
  };

  // Fetch content every 5 mins
  useFetchInterval(1000 * 60 * 1);

  const fetchAll = async () => {

    fetchPong(id);
    fetchSummary(id);
    getOtherPongs();

    setLoading(false);
  };

  useEffect(() => {
    fetchAll();

    // eslint-disable-next-line
  }, [refresh]);

  useEffect(() => {
    if (!loading) {
      fetchSummary(id);
    }

    // eslint-disable-next-line
  }, [hours]);

  const getOtherPongs = async () => {
    const { data = null, error = null } = await api(`pong/`);

    if (data) {
      setOtherPongs(data.results);
    }
    if (error) {
      alert("Someting went wrong");
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload[0]) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Hour of day (UTC)${label} : ${payload[0].value} ms`}</p>
          <p className="desc">{`The task time time was ${payload[0].value} ms`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <Body title="Pong Summary" selectedMenu="pong" currentUser={currentUser} loading={loading}>
      {summary && <AlertCard m={summary} showEdit={true && currentUser.role.role === "admin"} showSummary={false} otherObjects={otherPongs} otherPath="pong" />}

      <Card>
        <Card.Body>
          <Row>
            <Col xs={12} xl={6}>
              <Row>
                <Col xs={12} xl={6}>
                  <Card.Title>
                    <Row>
                      <Col>
                        <h3>Pong Details</h3>
                      </Col>
                    </Row>
                  </Card.Title>
                  {pong && (
                    <Table borderless size="sm" striped>
                      <thead>
                        <tr>
                          <th>Info</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td width="1%" nowrap="nowrap">
                            <label className="form-label mb-0">Cron Desc:</label>
                          </td>
                          <td>{pong.cron_desc ? pong.cron_desc : "n/a"}</td>
                        </tr>
                        <tr>
                          <td width="1%" nowrap="nowrap">
                            <label className="form-label mb-0">Last Start:</label>
                          </td>
                          <td>{pong.last_start_on ? moment(pong.last_start_on).format("YYYY-MM-DD HH:mm:ss") : "n/a"}</td>
                        </tr>
                        <tr>
                          <td width="1%" nowrap="nowrap">
                            <label className="form-label mb-0">Last End:</label>
                          </td>
                          <td>{pong.last_complete_on ? moment(pong.last_complete_on).format("YYYY-MM-DD HH:mm:ss") : "n/a"}</td>
                        </tr>
                        <tr>
                          <td width="1%" nowrap="nowrap">
                            <label className="form-label mb-0">Task Last Run:</label>
                          </td>
                          <td>{pong.task.last_run_at ? moment(pong.task.last_run_at).format("YYYY-MM-DD HH:mm:ss") : "n/a"}</td>
                        </tr>
                      </tbody>
                    </Table>
                  )}
                </Col>
                <Col xs={12} xl={6}>
                  <Card.Title>
                    <Row>
                      <Col>
                        <h3>Notification Rules</h3>
                      </Col>
                    </Row>
                  </Card.Title>
                  {pong && (
                    <Table borderless size="sm" striped>
                      <thead>
                        <tr>
                          <th>Trigger</th>
                          <th>Dur</th>
                          <th>Unit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pong.triggers.map((t, i) => (
                          <tr key={i}>
                            <td>
                              <label className="form-label mb-0">{trigger_desc[t.trigger_type]}</label>
                            </td>
                            <td>{t.interval_value}</td>
                            <td>{t.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Col>
              </Row>
            </Col>
            <Col xs={12} xl={6}>
              <Card.Title>
                <Row>
                  <Col>
                    <h3>Average Task Time (ms)</h3>
                  </Col>
                  <Col className="text-end">
                    <Button variant="link" className="p-0 m-0" onClick={() => setHours(24)} style={{ color: hours === 24 ? "red" : "" }}>
                      <small>24h</small>
                    </Button>
                    <small> | </small>
                    <Button variant="link" className="p-0 m-0" onClick={() => setHours(48)} style={{ color: hours === 48 ? "red" : "" }}>
                      <small>48h</small>
                    </Button>
                    <small> | </small>
                    <Button variant="link" className="p-0 m-0" onClick={() => setHours(72)} style={{ color: hours === 72 ? "red" : "" }}>
                      <small>72h</small>
                    </Button>
                    <small> | </small>
                    <Button variant="link" className="p-0 m-0" onClick={() => setHours(168)} style={{ color: hours === 168 ? "red" : "" }}>
                      <small>7d</small>
                    </Button>
                    <small> | </small>
                    <Button variant="link" className="p-0 m-0" onClick={() => setHours(336)} style={{ color: hours === 336 ? "red" : "" }}>
                      <small>14d</small>
                    </Button>
                    <small> | </small>
                    <Button variant="link" className="p-0 m-0" onClick={() => setHours(720)} style={{ color: hours === 720 ? "red" : "" }}>
                      <small>30d</small>
                    </Button>
                  </Col>
                </Row>
              </Card.Title>
              {responseTimeData && (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart
                    data={responseTimeData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <XAxis dataKey="name" tick={true} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="response_ms" stroke="#1e3e70" fill="#1e3e70" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
              <div className="pt-1 text-center">
                <small>Hour of day (UTC)</small>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title>
            <Row>
              <Col>
                <h3>Incidents</h3>
              </Col>
            </Row>
          </Card.Title>
          {failures && failures.length > 0 && (
            <Row>
              <Col xs={12} lg={3}>
                {failureCounts &&
                  failureCounts.map((f, i) => (
                    <Row key={i} className="mt-2">
                      <Col xs={4} lg={12}>
                        {f.reason}
                      </Col>
                      <Col>
                        <ProgressBar label={f.count} now={f.percentage * 100} />
                      </Col>
                    </Row>
                  ))}
              </Col>
              <Col xs={12} lg={9}>
                <div className="table-responsive">
                  <Table striped borderless hover>
                    <thead>
                      <tr>
                        <th>Received On</th>
                        <th>Who</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {failures.map((f, i) => (
                        <tr key={i}>
                          <td className="hide-small">{moment(f.created_on).format("LLLL")}</td>
                          <td className="show-small">{moment(f.created_on).format("MM/DD")}</td>
                          <td>
                            {" "}
                            {f.notify_org_user && (
                              <>
                                <div>
                                  {f.notify_org_user.first_name} {f.notify_org_user.last_name}
                                </div>
                              </>
                            )}
                          </td>
                          <td>{REASONS[f.reason]}</td>
                          <td>
                            <FailureStatus failure={f} />
                          </td>
                          <td className="text-righ" width="1%" nowrap="nowrap">
                            <Link to={`/failure/${f.id}/pong/${id}`}>
                              <img src="https://onerrorlog.s3.amazonaws.com/images/details.png" alt={`Failure Details for ${f.id}`} className="icon" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
          )}
          {!failures ||
            (failures.length === 0 && (
              <Row>
                <Col className="text-center pb-3">
                  <h2>This pong has not yet experienced any incidents. Yay!</h2>
                </Col>
              </Row>
            ))}
        </Card.Body>
      </Card>
    </Body>
  );
};

export default PongSummary;
