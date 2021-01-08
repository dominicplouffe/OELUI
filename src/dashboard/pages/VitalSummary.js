import React, { useState, useEffect } from "react";
import Body from "../components/Body";
import api from "../../utils/api";
import moment from "moment";
import { Card, Row, Col, Button } from "react-bootstrap";
import InstanceCard from "../components/InstanceCard";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import MetricCondition from "../components/MetricCondition";

const VitalSummary = (props) => {
  const [loading, setLoading] = useState(true);
  const [instance, setInstance] = useState(null);
  const [cpuData, setCPUData] = useState([]);
  const [memData, setMemData] = useState([]);
  const [diskData, setDiskData] = useState([]);
  const [showCondition, setShowCondition] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const fetchInstance = async () => {
    const { data = null, error = null } = await api(
      `vital_instance/${props.match.params.id}/`
    );

    extractGraphData(data, "cpu_graph", setCPUData);
    extractGraphData(data, "mem_graph", setMemData);
    extractGraphData(data, "disk_graph", setDiskData);

    if (data) {
      setInstance(data);
    }
    if (error) {
      alert("Something went wrong, we cannot find your instance");
    }

    setLoading(false);
  };

  const fetchNotifications = async () => {
    setNotifications([]);
  };

  const extractGraphData = (data, key, setFunc) => {
    const values = [];

    for (let i = 0; i < data[key].length; i++) {
      const ss = data[key][i];
      const row = {
        name: `${moment(ss.date).format("MM/DD H:mm")}`,
        value: ss.value,
      };

      values.push(row);
    }

    setFunc(values);
  };

  useEffect(() => {
    fetchInstance();
    fetchNotifications();
    // eslint-disable-next-line
  }, []);

  return (
    <Body title="Vitals" selectedMenu="vitals" {...props} loading={loading}>
      <Row>
        <Col>
          <InstanceCard instance={instance} />
        </Col>
      </Row>
      {instance && (
        <>
          <Row>
            <Col md={12} lg={12} xl={4}>
              <Card>
                <Card.Body>
                  <Card.Title>CPU Percentage Used</Card.Title>
                  <Card.Subtitle>
                    Below is the graph of the CPU usage for the past 24 hours in
                    1 hour intervals
                  </Card.Subtitle>
                  <Row>
                    <Col className="pt-3">
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart
                          data={cpuData}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <XAxis dataKey="name" tick={true} />
                          <YAxis />
                          <Tooltip />
                          {/* content={<CustomTooltip />} */}
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke={instance.cpu_status}
                            fill={instance.cpu_status}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col md={12} lg={12} xl={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Memory Percentage Used</Card.Title>
                  <Card.Subtitle>
                    Below is the graph of the Memory usage for the past 24 hours
                    in 1 hour intervals
                  </Card.Subtitle>
                  <Row>
                    <Col className="pt-3">
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart
                          data={memData}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <XAxis dataKey="name" tick={true} />
                          <YAxis />
                          <Tooltip />
                          {/* content={<CustomTooltip />} */}
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke={instance.mem_status}
                            fill={instance.mem_status}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col md={12} lg={12} xl={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Disk Percentage Used</Card.Title>
                  <Card.Subtitle>
                    Below is the graph of the Disk usage for the past 24 hours
                    in 1 hour intervals
                  </Card.Subtitle>
                  <Row>
                    <Col className="pt-3">
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart
                          data={diskData}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <XAxis dataKey="name" tick={true} />
                          <YAxis />
                          <Tooltip />
                          {/* content={<CustomTooltip />} */}
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke={instance.disk_status}
                            fill={instance.disk_status}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>
                <Row>
                  <Col>Notifications</Col>
                  <Col className="text-right">
                    <Button
                      variant="warning"
                      className="m-0 btn-rounded"
                      onClick={() => setShowCondition(true)}
                    >
                      New Notification
                    </Button>
                  </Col>
                </Row>
              </Card.Title>
              <Card.Subtitle>
                Below are the notifications that you have setup for this server
              </Card.Subtitle>

              {instance && showCondition && (
                <Row className="mt-4">
                  <Col>
                    <MetricCondition
                      instanceId={instance.instance_id}
                      setShowCondition={setShowCondition}
                    />
                  </Col>
                </Row>
              )}

              {!showCondition && notifications.length === 0 && (
                <Row className="mt-4">
                  <Col className="text-center">
                    <h5 className="pt-3">
                      You have not added any notifications yet.
                    </h5>
                    <div className="pt-2">
                      <Button
                        variant="warning"
                        className="btn-rounded mb-2 mr-2"
                        style={{ fontSize: "16px" }}
                        onClick={() => setShowCondition(true)}
                      >
                        Add Your First Notification
                      </Button>
                    </div>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Body>
  );
};

export default VitalSummary;
