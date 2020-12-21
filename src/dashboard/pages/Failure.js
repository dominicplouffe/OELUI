import React, { useState, useEffect } from "react";
import Body from "../components/Body";
import { Card, Row, Col, Badge } from "react-bootstrap";
import "react-phone-number-input/style.css";
import { REASONS } from "../../utils/globals";
import api from "../../utils/api";
import PingCard from "../components/PingCard";
import PongCard from "../components/PongCard";
import moment from "moment";

const Failure = (props) => {
  const [loading, setLoading] = useState(true);
  const [failure, setFailure] = useState(null);
  const [summary, setSummary] = useState(null);

  const fetchFailure = async (failureId) => {
    const { error = null, data = null } = await api(`failure/${failureId}/`);

    if (data) {
      setFailure(data);
      fetchSummary(data.ping);
      setLoading(false);
    }

    if (error) {
      alert("Something went wrong");
    }
  };

  const fetchSummary = async (ping) => {
    const { data = null, error = null } = await api(
      `ping/summary/${ping.id}/?direction=${ping.direction}`
    );
    if (data) {
      setSummary(data.pings[0]);
    }
    if (error) {
      alert("Something went wrong fetching summary");
    }
  };

  const getStatus = () => {
    if (!failure) {
      return null;
    }

    if (failure.recovered_on) {
      return <Badge variant="success">Recovered</Badge>;
    }

    if (failure.acknowledged_on && !failure.ignored_on && !failure.fixed_on) {
      return <Badge variant="primary">Acknowledged</Badge>;
    }

    if (failure.ignored_on && !failure.fixed_on) {
      return <Badge variant="danger">Ignored</Badge>;
    }

    if (failure.fixed_on) {
      return <Badge variant="warning">Fixed</Badge>;
    }

    return <Badge variant="danger">Unknown Status</Badge>;
  };

  useEffect(() => {
    fetchFailure(props.match.params.id);

    // eslint-disable-next-line
  }, [props]);

  return (
    <Body title="Failure" selectedMenu="failure" {...props} loading={loading}>
      {summary && summary.ping.direction === "pull" && (
        <PingCard
          m={summary}
          showEdit={false}
          showSummary={true}
          showOther={true}
        />
      )}
      {summary && summary.ping.direction === "push" && (
        <PongCard
          m={summary}
          showEdit={false}
          showSummary={true}
          showOther={true}
        />
      )}
      {!loading && (
        <>
          <Card>
            <Card.Body>
              <Card.Title>
                <Row>
                  <Col>Failure Details</Col>
                  <Col className="right-align-small-center">{getStatus()}</Col>
                </Row>
              </Card.Title>
              <Card.Subtitle>
                Below are the detail of this failure
              </Card.Subtitle>

              <Row className="mt-4">
                <Col lg={6} xs={12}>
                  <Row className="pt-2">
                    <Col lg={3}>
                      <strong>Triggered On</strong>:
                    </Col>
                    <Col>{moment(failure.created_on).format("LLLL")}</Col>
                  </Row>
                  <Row className="pt-2">
                    <Col lg={3}>
                      <strong>Who was notified</strong>:
                    </Col>
                    <Col>{`${failure.notify_org_user.first_name} ${failure.notify_org_user.last_name}`}</Col>
                  </Row>
                  <Row className="pt-2">
                    <Col lg={3}>
                      <strong>Reason</strong>:
                    </Col>
                    <Col>{REASONS[failure.reason]}</Col>
                  </Row>
                  <Row className="pt-2">
                    <Col lg={3}>
                      <strong>Status Code</strong>:
                    </Col>
                    <Col>{failure.status_code}</Col>
                  </Row>
                </Col>
                <Col lg={6} xs={12}>
                  <Row className="pt-2">
                    <Col lg={3}>
                      <strong>Acknowledged On</strong>:
                    </Col>
                    <Col>
                      {failure.acknowledged_on && (
                        <>
                          <div className="d-inline-flex">
                            {moment(failure.acknowledged_on).format("LLLL")}
                          </div>
                          <div className="d-inline-flex smaller pl-2">
                            by:{" "}
                            {`${failure.acknowledged_by.first_name} ${failure.acknowledged_by.last_name}`}
                          </div>
                        </>
                      )}
                      {!failure.acknowledged_on && <div>n/a</div>}
                    </Col>
                  </Row>
                  <Row className="pt-2">
                    <Col lg={3}>
                      <strong>Recovered On</strong>:
                    </Col>
                    <Col>
                      {failure.recovered_on && (
                        <>
                          <div>
                            {moment(failure.recovered_on).format("LLLL")}
                          </div>
                        </>
                      )}
                      {!failure.recovered_on && <div>n/a</div>}
                    </Col>
                  </Row>
                  <Row className="pt-2">
                    <Col lg={3}>
                      <strong>Fixed On</strong>:
                    </Col>
                    <Col>
                      {failure.fixed_on && (
                        <>
                          <div className="d-inline-flex">
                            {moment(failure.fixed_on).format("LLLL")}
                          </div>
                          <div className="d-inline-flex smaller pl-2">
                            by:{" "}
                            {`${failure.fixed_by.first_name} ${failure.fixed_by.last_name}`}
                          </div>
                        </>
                      )}
                      {!failure.fixed_on && <div>n/a</div>}
                    </Col>
                  </Row>
                  <Row className="pt-2">
                    <Col lg={3}>
                      <strong>Ignored On</strong>:
                    </Col>
                    <Col>
                      {failure.ignored_on && (
                        <>
                          <div className="d-inline-flex">
                            {moment(failure.ignored_on).format("LLLL")}
                          </div>
                          <div className="d-inline-flex smaller pl-2">
                            by:{" "}
                            {`${failure.ignored_by.first_name} ${failure.ignored_by.last_name}`}
                          </div>
                        </>
                      )}
                      {!failure.ignored_on && <div>n/a</div>}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {summary && summary.ping.direction && (
            <Card>
              <Card.Body>
                <Card.Title>
                  <Row>
                    <Col>
                      Content returned from:{" "}
                      <span className="text-primary">
                        {summary.ping.endpoint}
                      </span>
                    </Col>
                  </Row>
                </Card.Title>
                <Row>
                  {failure.content && (
                    <Col className="pl-3 pr-3">
                      <pre>{failure.content}</pre>
                    </Col>
                  )}
                  {!failure.content && (
                    <Col className="pl-3 pr-3">
                      The content was empty or not returned from{" "}
                      {summary.ping.endpoint}
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
          )}
        </>
      )}
    </Body>
  );
};

export default Failure;
