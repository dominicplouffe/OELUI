import React from "react";
import { Row, Col } from "react-bootstrap";

const Python = () => {
  return (
    <Row>
      <Col>
        <pre className="code">
          <span className="text-success">
            # Example to post a Pong to onErrorLog
          </span>
          <br />
          import requests
          <br />
          requests.post('http://api.pong.com',
          <br />
          {`    `}headers=
          {`{'X-Auth': 'abcdef'}`}
          <br />)
          <br />
          <br />
          <span className="text-success">
            # Example to post a Pong to onErrorLog with JSON values
          </span>
          <br />
          requests.post('http://api.pong.com',
          <br />
          {`    `}headers=
          {`{'X-Auth': 'abcdef'}`},<br />
          {`    `}data=
          {`{'loadTime': 100, 'status': 1}`}
          <br />)
        </pre>
      </Col>
    </Row>
  );
};

export default Python;
