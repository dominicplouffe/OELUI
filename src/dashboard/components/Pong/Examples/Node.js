import React from "react";
import { Row, Col } from "react-bootstrap";

const Node = ({ api_url, endpoint, pongKey }) => {
  return (
    <Row>
      <Col xs={12}>
        <pre className="code p-4" style={{ lineHeight: "25px" }}>
          <span className="text-success">
            {"// "}Example to send a Pong incident to onErrorLog
          </span>
          <br />
          <span className="text-danger">const</span> request ={" "}
          <span className="text-success">require</span>
          ('<span className="text-warning">request</span>');
          <br />
          <span className="text-success">requests</span>
          ('
          <span className="text-warning">
            {api_url}{endpoint}/{pongKey}
          </span>
          ', {`{`} json: true {`}`}, , (err, res, body) ={`>`} {`{`}
          <br />
          {"   "} <span className="text-danger">if</span> (err) {`{`}{" "}
          <span className="text-danger">return </span>
          console.
          <span className="text-success">log</span>(err); {`}`}
          <br />
          {`}`});
        </pre>
      </Col>
      <Col xs={12}>
        <small>
          Note: You need to install the request library:{" "}
          <strong>npm install request</strong>
        </small>
      </Col>
    </Row>
  );
};

export default Node;
