import React, { useState, useEffect } from "react";
import Body from "../components/Body";
import { Card, Row, Col, ProgressBar, Table, Button } from "react-bootstrap";
import moment from "moment";
import api from "../../utils/api";
import AlertCard from "../components/AlertCard";
import useAuth from "../../auth/useAuth";
import { REASONS } from "../../utils/globals";
import { Link } from "react-router-dom";
import FailureStatus from "../components/FailureStatus";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useParams } from 'react-router-dom';

const PingSummary = ({ currentUser }) => {
  const [summary, setSummary] = useState(null);
  const [hours, setHours] = useState(24);
  const [responseTimeData, setResponseTimeData] = useState(null);
  const [failureCounts, setFailureCounts] = useState([]);
  const [failures, setFailures] = useState([]);
  const [otherPings, setOtherPings] = useState([]);
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

  const fetchSummary = async (id) => {
    const { data = null, error = null } = await api(`alert_summary/ping/${id}/?hours=${hours}`);

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
      alert("Something went wrong, we cannot find your ping");
    }
  };

  const fetchFailreCounts = async (id) => {
    const { data = null, error = null } = await api(`failure/counts/${id}/`);

    setFailureCounts(data);

    if (error) {
      alert("Something went wrong, we cannot find your ping");
    }
  };

  const fetchFailures = async (id) => {
    const { data = null, error = null } = await api(`failure/?alert=${id}&ordering=-created_on&offset=0&limit=20`);

    setFailures(data.results);

    if (error) {
      alert("Something went wrong, we cannot find your ping");
    }
  };

  const getOtherPings = async () => {
    const { data = null, error = null } = await api(`ping/`);

    if (data) {
      setOtherPings(data.results);
    }
    if (error) {
      alert("Someting went wrong");
    }
  };

  const fetchAll = async () => {

    fetchSummary(id);
    getOtherPings();

    setLoading(false);
  };

  // Fetch content every 5 mins
  useFetchInterval(1000 * 60 * 5);

  useEffect(() => {
    fetchAll();

    // eslint-disable-next-line
  }, [hours]);

  useEffect(() => {
    if (!loading) {

      fetchSummary(id);
    }

    // eslint-disable-next-line
  }, [refresh]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload[0]) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Hour of day (UTC)${label} : ${payload[0].value} ms`}</p>
          <p className="desc">{`The average response time was ${payload[0].value} ms`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <Body title="Uptime Monitor Summary" selectedMenu="ping" currentUser={currentUser} loading={loading}>
      {summary && (
        <AlertCard m={summary} showEdit={true && currentUser.role.role === "admin"} showSummary={false} showOther={true} otherPath="ping" otherObjects={otherPings} showResponseView={true} />
      )}
      <Card>
        <Card.Body>
          <Card.Title>
            <Row>
              <Col xs={12} xl={4}>
                <h3>Average Response Time (ms)</h3>
              </Col>
              <Col className="text-center" xs={12} xl={4}>
                {summary && `${(summary.avg_resp * 1000).toFixed(0)}ms`}
              </Col>
              <Col className="text-center text-xl-end text-xxl-end" xs={12} xl={4}>
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
          <Row>
            <Col>
              {responseTimeData && (
                <>
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
                </>
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
          {failures.length > 0 && (
            <Row style={{ width: "100%" }}>
              <Col xs={12} lg={3}>
                {failureCounts.map((f, i) => (
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
          {failures.length === 0 && (
            <Row>
              <Col className="text-center pb-3">
                <h2>This ping has not yet experienced any incidents. Yay!</h2>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>
    </Body>
  );
};

export default PingSummary;
