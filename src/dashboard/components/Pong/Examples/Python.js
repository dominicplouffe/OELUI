import React from "react";
import { Row, Col } from "react-bootstrap";

const Python = ({ api_url, endpoint, pongKey }) => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <pre className="code p-4" style={{ lineHeight: "20px" }}>
            <span className="text-success">
              # Example to send a Pong incident to onErrorLog
            </span>
            <br />
            <span className="text-danger">import</span> requests
            <br />
            res = <span className="text-success">requests</span>
            .get('
            <span className="text-warning">
              {api_url}{endpoint}/{pongKey}
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
