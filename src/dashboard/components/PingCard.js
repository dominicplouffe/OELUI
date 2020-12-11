import React, { useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import Actions from "../components/Actions";
import { Link } from "react-router-dom";
import useAuth from "../../auth/useAuth";

const PingCard = ({ m, showSummary, showEdit }) => {
  const [statusItem, setStatusItem] = useState(null);
  const { user } = useAuth();

  const getSnapshotBackground = (s) => {
    if (s["status"] === null) {
      return "#FFF";
    } else if (s["status"] === "success") {
      return "#409918";
    } else if (s["status"] === "warning") {
      return "#dba222";
    }

    return "#991840";
  };

  const getSuccessRate = (s) => {
    if (!s) {
      return null;
    }

    if (s.count === 0) {
      return null;
    }

    const sr = (s.success / s.count) * 100;

    if (sr < 100) {
      return `${sr.toFixed(0)}%`;
    }

    return null;
  };

  const renderStatusItem = () => {
    if (!statusItem) {
      return null;
    }

    return (
      <small>
        success: {statusItem.success} - failure: {statusItem.failure}
      </small>
    );
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          <Row>
            <Col className="text-center" xl={3} md={12}>
              <h3>{m.ping.name}</h3>
            </Col>
            <Col className="text-center" xl={6} md={12}>
              <small>{m.ping.endpoint}</small>
            </Col>
            <Col className="text-center" xl={3} md={12}>
              <small>
                {showSummary && (
                  <Link to={`/ping/summary/${m.ping.id}`}>summary</Link>
                )}
                {user.role.role === "admin" && showEdit && showSummary ? (
                  <span> | </span>
                ) : (
                  ``
                )}
                {user.role.role === "admin" && showEdit && (
                  <Link to={`/ping/${m.ping.id}`}>edit</Link>
                )}
              </small>
            </Col>
          </Row>
        </Card.Title>
        {m.ping.active && (
          <Row>
            <Col className="text-center" xs={12} sm={12} xl={3}>
              <small>&nbsp;</small>
              {m.ping.failure_count === 0 ? (
                <h1 className="text-success">✔</h1>
              ) : (
                <h1 className="text-danger">✖</h1>
              )}
            </Col>
            <Col className="text-center" xs={12} sm={12} xl={3}>
              <small>Availability</small>
              <h1>{m.availability.toFixed(2)}%</h1>
            </Col>
            {m.ping.failure_count === 0 ? (
              <>
                <Col className="text-center" xs={12} sm={12} xl={3}>
                  <small>Downtime</small>
                  <h1>{m.downtime_s}</h1>
                </Col>
                <Col className="text-center" xs={12} sm={12} xl={3}>
                  <small>Avg. Response Time</small>
                  <h1>
                    {(m.avg_resp * 1000).toFixed(2)}
                    <small>ms</small>
                  </h1>
                </Col>
              </>
            ) : (
              <Col className="text-center pt-4" xs={12} sm={12} xl={6}>
                <Actions fail={m.fail} />
              </Col>
            )}
            <Col xs={12} sm={12} xl={12}>
              <Row>
                <Col>
                  <small>24h Status Snapshot</small>
                </Col>
                <Col className="text-right" xs={8}>
                  {renderStatusItem()}
                </Col>
              </Row>

              <div className={`status-row`}>
                {m.snapshot.map((s, i) => (
                  <div
                    style={{
                      backgroundColor: getSnapshotBackground(s),
                    }}
                    key={i}
                    className={`status-cell`}
                    onMouseOver={() => setStatusItem(s)}
                    onMouseOut={() => setStatusItem(null)}
                  >
                    {getSuccessRate(s)}
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        )}

        {!m.ping.active && (
          <Row>
            <Col className="text-center">
              <h2>Paused</h2>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default PingCard;
