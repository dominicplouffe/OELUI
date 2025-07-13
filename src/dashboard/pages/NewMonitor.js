import Body from "../components/Body";
import { Card, Row, Col, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

const NewMonitor = (props) => {
  return (
    <Body title="New Monitor" selectedMenu="newmonitor" {...props}>
      <Card>
        <Card.Body className="p-5">
          <Row>
            <Col className="text-center">
              <img
                src="https://onerrorlog.s3.amazonaws.com/images/oel-logo.png"
                alt="Oops"
                className="mb-3 list-logo"
              />
              <h2 className="pt-3">
                Let us know what you're looking at monitoring and we'll guide you to the right place!
              </h2>
              <Row className="pt-5">
                <Col xs={12} lg={3}></Col>
                <Col className="text-center pt-2" xs={12} lg={3}>
                  <Link to="/newping">
                    <Badge bg="warning p-3" style={{ minWidth: "150px" }}>
                      <img
                        src="https://onerrorlog.s3.amazonaws.com/images/website-white.png"
                        alt="pings"
                        className="icon-30"
                      />

                      <div className="pt-3" style={{ fontSize: "15px" }}>
                        Website / API
                      </div>
                    </Badge>
                  </Link>
                </Col>

                <Col className="text-center pt-2" xs={12} lg={3}>
                  <Link to="/newpong">
                    <Badge bg="primary p-3" style={{ minWidth: "150px" }}>
                      <img
                        src="https://onerrorlog.s3.amazonaws.com/images/heartbeat-white.png"
                        alt="pings"
                        className="icon-30"
                      />

                      <div className="pt-3" style={{ fontSize: "15px" }}>
                        Heartbeat
                      </div>
                    </Badge>
                  </Link>
                </Col>
                <Col xs={12} lg={3}></Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Body>
  );
};

export default NewMonitor;
