import React from "react";
import { Card, Row, Col, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import useAuth from "../../auth/useAuth";
import Actions from "../components/Actions";

const PongCard = ({ m, showSummary, showEdit }) => {
  const { user } = useAuth();

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
                  <Link to={`/pong/summary/${m.ping.id}`}>summary</Link>
                )}
                {user.role.role === "admin" && showEdit && showSummary ? (
                  <span> | </span>
                ) : (
                  ``
                )}
                {user.role.role === "admin" && showEdit && (
                  <Link to={`/pong/${m.ping.id}`}>edit</Link>
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
              <small>Failures</small>
              <h1>{m.failure}</h1>
            </Col>
            {m.ping.failure_count === 0 ? (
              <>
                <Col className="text-center" xs={12} sm={12} xl={3}>
                  <small>Downtime</small>
                  <h1>{m.stats ? m.stats.total_time_s : `0h 0m`}</h1>
                </Col>
                <Col className="text-center" xs={12} sm={12} xl={3}>
                  <Row>
                    <Col>
                      <small>Acknowledged</small>
                      <h2>
                        <Badge variant="success">
                          {m.stats ? m.stats.acknowledged : `0`}
                        </Badge>
                      </h2>
                    </Col>
                    <Col>
                      <small>Fixed</small>
                      <h2>
                        <Badge variant="primary">
                          {m.stats ? m.stats.fixed : `0`}
                        </Badge>
                      </h2>
                    </Col>
                    <Col>
                      <small>Auto-Resolved</small>
                      <h2>
                        <Badge variant="warning">
                          {m.stats ? m.stats.resolved : `0`}
                        </Badge>
                      </h2>
                    </Col>
                    <Col>
                      <small>Ignored</small>
                      <h2>
                        <Badge variant="danger">
                          {m.stats ? m.stats.ignored : `0`}
                        </Badge>
                      </h2>
                    </Col>
                  </Row>
                </Col>
              </>
            ) : (
              <Col className="text-center pt-3" xs={12} sm={12} xl={6}>
                <Actions fail={m.fail} />
              </Col>
            )}
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

export default PongCard;
