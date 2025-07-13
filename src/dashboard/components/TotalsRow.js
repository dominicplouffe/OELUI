import { Row, Col, Badge } from "react-bootstrap";

const TotalRow = ({ totals, showNoMonitors = true }) => {
  if (!totals.total && !showNoMonitors) {
    return null;
  }

  return (
    <Row>
      <Col className="text-center" xs={6} lg={3}>
        <small>Total</small>
        <h2>
          <Badge bg="primary">{totals.total}</Badge>
        </h2>
      </Col>
      <Col className="text-center" xs={6} lg={3}>
        <small>Up</small>
        <h2>
          <Badge bg="success">{totals.up}</Badge>
        </h2>
      </Col>
      <Col className="text-center" xs={6} lg={3}>
        <small>Down</small>
        <h2>
          <Badge bg="danger">{totals.down}</Badge>
        </h2>
      </Col>
      <Col className="text-center" xs={6} lg={3}>
        <small>Paused</small>
        <h2>
          <Badge bg="warning">{totals.paused}</Badge>
        </h2>
      </Col>
    </Row>
  );
};

export default TotalRow;
