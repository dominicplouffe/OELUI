import React, { useState, useEffect } from "react";
import Body from "../components/Body";
import { Card, Row, Col, Badge } from "react-bootstrap";
import api from "../../utils/api";
import { Link } from "react-router-dom";

const Vitals = (props) => {
  const [loading, setLoading] = useState(true);
  const [instances, setInstances] = useState([]);

  const fetchInstances = async () => {
    const { data = null, error = null } = await api(`vital_instance/`);

    if (data) {
      await setInstances(data.results);
    }
    if (error) {
      alert("Something went wrong, we cannot find your instances");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchInstances();
    // eslint-disable-next-line
  }, []);

  return (
    <Body title="Vitals" selectedMenu="vitals" {...props} loading={loading}>
      <Row>
        {instances.map((instance, i) => (
          <Col xs={12} md={4} key={i}>
            <Card>
              <Card.Body>
                <Card.Title>
                  <Row>
                    <Col className="text-left" xl={6} md={12}>
                      {instance.name}
                    </Col>
                    <Col className="right-align-small-center" xl={6} md={12}>
                      <small>
                        <Link to={`/vitals/${instance.id}/`}>summary</Link>
                      </small>
                    </Col>
                  </Row>
                </Card.Title>

                <Row className="pt-2 pb-2">
                  <Col>
                    <Badge
                      style={{
                        backgroundColor: instance.cpu_status,
                        width: "100%",
                        color: "#FFF",
                        opacity: 0.75,
                      }}
                      className="p-3"
                    >
                      <Row>
                        <Col className="text-center">CPU</Col>
                      </Row>
                      <Row className="pt-2">
                        <Col className="text-center">
                          {(instance.cpu_percent * 100).toFixed(2)}%
                        </Col>
                      </Row>
                    </Badge>
                  </Col>
                  <Col>
                    <Badge
                      style={{
                        backgroundColor: instance.mem_status,
                        width: "100%",
                        color: "#FFF",
                        opacity: 0.75,
                      }}
                      className="p-3"
                    >
                      <Row>
                        <Col className="text-center">Memory</Col>
                      </Row>
                      <Row className="pt-2">
                        <Col className="text-center">
                          {(instance.mem_percent * 100).toFixed(2)}%
                        </Col>
                      </Row>
                    </Badge>
                  </Col>
                  <Col>
                    <Badge
                      style={{
                        backgroundColor: instance.disk_status,
                        width: "100%",
                        color: "#FFF",
                        opacity: 0.75,
                      }}
                      className="p-3"
                    >
                      <Row>
                        <Col className="text-center">Disk</Col>
                      </Row>
                      <Row className="pt-2">
                        <Col className="text-center">
                          {(instance.disk_percent * 100).toFixed(2)}%
                        </Col>
                      </Row>
                    </Badge>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Body>
  );
};

export default Vitals;
