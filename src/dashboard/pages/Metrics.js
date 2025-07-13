import React, { useState, useEffect } from "react";
import Body from "../components/Body";
import api from "../../utils/api";
import { Card, Row, Col, Table, Button } from "react-bootstrap";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import moment from "moment";

const Metrics = ({ currentUser }) => {
  const [loading, setLoading] = useState(true);
  const [metricLoading, setMetricLoading] = useState(false);
  const [metrics, setMetrics] = useState([]);
  const [chosenMetric, setChosenMetric] = useState(null);
  const [metricData, setMetricData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [period, setPeriod] = useState("3h"); // Default to 3 hours
  const [fetchDate, setFetchDate] = useState(null);

  const fetchMetricNames = async () => {
    const { data = null, error = null } = await api(`metrics/tags`);

    if (data) {
      setMetrics(data.metrics);
      setLoading(false);
    }

    if (error) {
      console.error("Error fetching metrics:", error);
      setLoading(false);
    }
  };

  const fetchMetricGraph = async (metric) => {
    setMetricLoading(true);
    const { data = null, error = null } = await api(`metrics/tags/${metric}?period=${period}`);

    const graphData = [];
    if (data) {
      data?.values.forEach((element) => {
        graphData.push({
          name: element.time,
          value: element.value,
        });
      });

      setMetricData(graphData);
      setMetricLoading(false);
      setFetchDate(new Date());
    }
    if (error) {
      console.error("Error fetching metrics:", error);
      setMetricLoading(false);
    }
  };

  const handleMetricClick = (metric) => {
    setChosenMetric(metric);
    fetchMetricGraph(metric);
  };

  useEffect(() => {
    fetchMetricNames();

    if (chosenMetric) {
      fetchMetricGraph(chosenMetric);
    }

    // eslint-disable-next-line
  }, [refresh, chosenMetric, period]);

  return (
    <Body title="Metrics" selectedMenu="metrics" currentUser={currentUser} loading={loading}>
      <Card>
        <Card.Title> </Card.Title>
        <Card.Body>
          <Row>
            <Col xs={12} xl={4}>
              <p>Monitor and analyze your system metrics.</p>

              <p className="pt-4">Current Metrics</p>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Metric</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric, index) => (
                    <tr key={index}>
                      <td>
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            handleMetricClick(metric);
                          }}
                        >
                          {metric}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
            <Col xs={12} xl={8}>
              {chosenMetric && (
                <>
                  <Row>
                    <Col xs={12} lg={6}>
                      <div>
                        <h3 className="fw-bold">
                          {chosenMetric}
                          {/* <span className="text-muted"> </span> */}
                        </h3>
                      </div>
                    </Col>
                    <Col xs={12} lg={6} className="text-end">
                      <Button
                        variant="warning"
                        onClick={() => {
                          setRefresh(!refresh);
                        }}
                        className="mb-3"
                      >
                        Refresh Metrics
                      </Button>
                    </Col>
                  </Row>

                  <Row>
                    <Col className="text-left">
                      <Button
                        variant="link"
                        className="p-0 m-0"
                        onClick={() => setPeriod("1h")}
                        style={{ color: period === "1h" ? "red" : "" }}
                      >
                        <small>1h</small>
                      </Button>
                      <small> | </small>
                      <Button
                        variant="link"
                        className="p-0 m-0"
                        onClick={() => setPeriod("3h")}
                        style={{ color: period === "3h" ? "red" : "" }}
                      >
                        <small>3h</small>
                      </Button>
                      <small> | </small>
                      <Button
                        variant="link"
                        className="p-0 m-0"
                        onClick={() => setPeriod("12h")}
                        style={{ color: period === "12h" ? "red" : "" }}
                      >
                        <small>12h</small>
                      </Button>
                      <small> | </small>
                      <Button
                        variant="link"
                        className="p-0 m-0"
                        onClick={() => setPeriod("24h")}
                        style={{ color: period === "24h" ? "red" : "" }}
                      >
                        <small>24h</small>
                      </Button>
                      <small> | </small>
                      <Button
                        variant="link"
                        className="p-0 m-0"
                        onClick={() => setPeriod("7d")}
                        style={{ color: period === "7d" ? "red" : "" }}
                      >
                        <small>7d</small>
                      </Button>
                      <small> | </small>
                      <Button
                        variant="link"
                        className="p-0 m-0"
                        onClick={() => setPeriod("30d")}
                        style={{ color: period === "30d" ? "red" : "" }}
                      >
                        <small>30d</small>
                      </Button>
                    </Col>
                    <Col className="right-align-small-center">
                      <small>
                        <span className="hide-small">Last refreshed on: </span>
                        {fetchDate ? moment(fetchDate).format("LLLL") : "n/a"}
                      </small>
                    </Col>
                  </Row>
                </>
              )}

              {chosenMetric && !metricLoading && (
                <div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={metricData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
              {metricLoading && <p>Loading metrics...</p>}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Body>
  );
};

export default Metrics;
