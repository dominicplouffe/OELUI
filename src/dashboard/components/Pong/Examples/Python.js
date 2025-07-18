import { Row, Col } from "react-bootstrap";

const Python = ({ pongKey, api_url }) => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <pre className="code p-4" style={{ lineHeight: "20px" }}>
            <span className="text-success"># Example to send a start and end request to onErrorLog using Python</span>
            <br />
            <span className="text-danger">import</span> requests
            <br />
            <br />
            <span className="text-success"># Send your start request</span>
            <br />
            res = <span className="text-success">requests</span>
            .get('
            <span className="text-warning">
              {api_url}pongme/start/{pongKey}
            </span>
            ')
            <br />
            <br />
            <span className="text-success"># START OF YOUR CODE BLOCK...</span>
            <br />
            ...
            <br />
            <span className="text-success"># END OF YOUR CODE BLOCK...</span>
            <br />
            <br />
            <span className="text-success"># Send your end request</span>
            <br />
            res = <span className="text-success">requests</span>
            .get('
            <span className="text-warning">
              {api_url}pongme/end/{pongKey}
            </span>
            ')
          </pre>
        </Col>
        <Col xs={12}>
          <small>
            Note: You need to install the request library: <strong>pip install requests</strong>
          </small>
        </Col>
      </Row>
    </>
  );
};

export default Python;
