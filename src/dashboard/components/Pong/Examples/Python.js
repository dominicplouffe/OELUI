import React from "react";
import { Row, Col } from "react-bootstrap";

const Python = ({ pongKey }) => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <pre className="code p-4" style={{ lineHeight: "20px" }}>
            <span className="text-success">
              # Example to post a Pong to onErrorLog
            </span>
            <br />
            <span className="text-danger">import</span> requests
            <br />
            res = <span className="text-success">requests</span>
            .get('
            <span className="text-warning">
              http://api.onerrorlog.com.com/api/pongme/{pongKey}
            </span>
            ')
            <br />
            <br />
            <span className="text-success">print</span>(res.json())
          </pre>
        </Col>
        <Col xs={12}>
          <small>
            Note: You need to install the request library:{" "}
            <strong>pip install requests</strong>
          </small>
        </Col>
      </Row>
    </>
  );
};

export default Python;
