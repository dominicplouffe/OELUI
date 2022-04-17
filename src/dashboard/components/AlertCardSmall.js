import React, { useEffect } from "react";
import { Row, Col, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import Actions from "../components/Actions";

const AlertCardSmall = ({ m, showSummary, otherPath }) => {
  useEffect(() => {
    // eslint-disable-next-line
  }, []);

  const renderStatusView = () => {
    return (
      <>
        <Col className="text-center" xs={12} sm={12} xl={5}>
          <Row>
            <Col xs={3} lg={3}>
              <small>Ack</small>
              <h5>
                <Badge bg="success" className="pt-1">
                  {m.stats ? m.stats.acknowledged : `0`}
                </Badge>
              </h5>
            </Col>
            <Col xs={3} lg={3}>
              <small>Fix</small>
              <h5>
                <Badge bg="primary" className="pt-1">
                  {m.stats ? m.stats.fixed : `0`}
                </Badge>
              </h5>
            </Col>
            <Col xs={3} lg={3}>
              <small>Auto</small>
              <h5>
                <Badge bg="warning" className="pt-1">
                  {m.stats ? m.stats.resolved : `0`}
                </Badge>
              </h5>
            </Col>
            <Col xs={3} lg={3}>
              <small>Ign</small>
              <h5>
                <Badge bg="danger" className="pt-1">
                  {m.stats ? m.stats.ignored : `0`}
                </Badge>
              </h5>
            </Col>
          </Row>
        </Col>
      </>
    );
  };

  const renderCardData = () => {
    return renderStatusView();
  };

  const getAvailability = (m) => {
    if (m.availability > 0) {
      return m.availability.toFixed(2);
    }

    return ((1 - (m.failure / m.count)) * 100).toFixed(2);
  };

  if (!m || !m.object.active) {
    return null;
  }

  return (
    <>
      <Row style={{ borderTop: "1px solid #e7e7e7" }}>
        <Col xs={12} sm={12} xl={5}>
          <Row>
            <Col className="text-start" xs={9}>
              <small>&nbsp;</small>
              <h6>
                <Link to={`/${otherPath}/summary/${m.object.id}`}>{m.object.name}</Link>
              </h6>
            </Col>
            <Col className="text-center" xs={3} sm={3} xl={3}>
              <small>Fail</small>
              <h5>
                <Badge bg="secondary" className="pt-1">
                  {m.failure}
                </Badge>
              </h5>
            </Col>
          </Row>
        </Col>
        {renderCardData()}
        <Col className="text-center">
          <div className="pt-4 hide-small"></div>
          <small>{getAvailability(m)}%</small>
        </Col>
      </Row>
      {m.object.alert.failure_count !== 0 && (
        <Row>
          <Col className="text-center  pb-2" xs={12}>
            <Actions fail={m.fail} small={true} />
          </Col>
        </Row>
      )}
    </>
  );
};

export default AlertCardSmall;
