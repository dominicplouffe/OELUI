import React, { useState, useEffect } from "react";
import Body from "../components/Body";
import { Card, Row, Col, ProgressBar, Table, Button } from "react-bootstrap";
import moment from "moment";
import api from "../../utils/api";
import PongCard from "../components/PongCard";
import ResultModal from "../components/ResultModal";
import useAuth from "../../auth/useAuth";

const PongSummary = (props) => {
  const [calendarData, setCalendarData] = useState([]);
  const [calendarStart, setCalendarStart] = useState("2019-06-02");
  const [calendarEnd, setCalendarEnd] = useState("2020-06-02");
  const [summary, setSummary] = useState(null);
  const [calendarHelp, setCalendarHelp] = useState(
    <div className="mt-2">&nbsp;</div>
  );
  const [failureCounts, setFailureCounts] = useState([]);
  const [failures, setFailures] = useState([]);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [failureToShow, setFailureToShow] = useState(null);

  const [loading, setLoading] = useState(true);

  const { refresh } = useAuth();

  const fetchSummary = async (id) => {
    const { data = null, error = null } = await api(
      `ping/summary/${id}/?direction=push&hours=168`
    );

    if (data) {
      setSummary(data.pings[0]);
    }
    if (error) {
      alert("Something went wrong, we cannot find your ping");
    }
  };

  const fetchDetails = async (id) => {
    const { data = null, error = null } = await api(`ping/details/${id}/`);

    if (data) {
      setCalendarData(data.calendar.data);
      setCalendarStart(data.calendar.start);
      setCalendarEnd(data.calendar.end);
    }
    if (error) {
      alert("Something went wrong, we cannot find your ping");
    }
  };

  const fetchFailreCounts = async (id) => {
    const { data = null, error = null } = await api(`failure/counts/${id}/`);

    setFailureCounts(data);

    if (error) {
      alert("Something went wrong, we cannot find your ping");
    }
  };

  const fetchFailures = async (id) => {
    const { data = null, error = null } = await api(
      `failure/?ping=${id}&ordering=-created_on&offset=0&limit=20`
    );

    setFailures(data.results);

    if (error) {
      alert("Something went wrong, we cannot find your ping");
    }
  };

  useEffect(() => {
    const id = props.match.params.id;

    fetchSummary(id);
    fetchDetails(id);
    fetchFailreCounts(id);
    fetchFailures(id);

    setLoading(false);
    // eslint-disable-next-line
  }, [refresh]);

  const getCalendarCellColor = (c) => {
    if (c.status === "warning") {
      return "#dba222";
    } else if (c.status === "danger") {
      return "#991840";
    }
    if (!summary || !c) {
      return "#efefef";
    }

    const thisDate = moment(c.date);
    const createdOn = moment(summary.ping.created_on);

    if (thisDate >= createdOn) {
      return "#409918";
    }

    return "#efefef";
  };

  const showFailure = (f) => {
    setFailureToShow(f);
    setShowFailureModal(true);
  };

  return (
    <Body title="Pong Summary" selectedMenu="pong" {...props} loading={loading}>
      {summary && <PongCard m={summary} showEdit={true} showSummary={false} />}
      {/* <Card>
        <Card.Body>
          <Card.Title>
            <Row>
              <Col>
                <h3>Average Response Time (ms)</h3>
              </Col>
            </Row>
          </Card.Title>
          <Row>
            <Col>
              {responseTimeData && (
                <div style={{ width: "100%", height: "200px" }}>
                  <ResponsiveLine
                    data={responseTimeData}
                    margin={{ top: 15, right: 10, bottom: 50, left: 10 }}
                    xScale={{ type: "point" }}
                    axisTop={null}
                    axisRight={null}
                    curve="monotoneX"
                    axisBottom={{
                      orient: "bottom",
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Last 24 hours",
                      legendOffset: 36,
                      legendPosition: "middle",
                    }}
                    axisLeft={null}
                    colors={["#188199"]}
                    lineWidth={5}
                    enableGridX={false}
                    enableGridY={false}
                    enableArea={true}
                    pointSize={1}
                    pointColor={{ theme: "background" }}
                    pointBorderWidth={0}
                    pointBorderColor={{ from: "serieColor" }}
                    pointLabel="y"
                    pointLabelYOffset={-12}
                    useMesh={true}
                  />
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card> */}
      <Card>
        <Card.Body>
          <Card.Title>
            <h3>Status of Last 365 Days</h3>
          </Card.Title>
          <Row>
            <Col className="text-center">
              <small>
                {moment(calendarStart).format("LL")} to{" "}
                {moment(calendarEnd).format("LL")}
              </small>
            </Col>
          </Row>
          <Row>
            <Col>
              {calendarData.map((c, i) => (
                <div
                  key={i}
                  className={`calender-cell`}
                  style={{ backgroundColor: getCalendarCellColor(c) }}
                  onMouseOver={() => {
                    if (c.text) {
                      setCalendarHelp(
                        <div className="mt-2">
                          <strong>{moment(c.date).format("LL")}</strong> -
                          <em>
                            {c.text} (failures: {c.failure})
                          </em>
                        </div>
                      );
                    } else {
                      setCalendarHelp(
                        <div className="mt-2">
                          <strong>{moment(c.date).format("LL")}</strong> -
                          <em>No pongs were triggered on this day</em>
                        </div>
                      );
                    }
                  }}
                  onMouseOut={() =>
                    setCalendarHelp(<div className="mt-2">&nbsp;</div>)
                  }
                >
                  &nbsp;
                </div>
              ))}
            </Col>
          </Row>
          <Row>
            <Col className="text-center">
              <small>{calendarHelp}</small>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title>
            <Row>
              <Col>
                <h3>Incidents</h3>
              </Col>
            </Row>
          </Card.Title>
          {failures.length > 0 && (
            <Row>
              <Col xs={12} lg={3}>
                {failureCounts.map((f, i) => (
                  <Row key={i} className="mt-2">
                    <Col xs={4} lg={12}>
                      {f.reason}
                    </Col>
                    <Col>
                      <ProgressBar label={f.count} now={f.percentage * 100} />
                    </Col>
                  </Row>
                ))}
              </Col>
              <Col xs={12} lg={9}>
                <Table striped borderless hover>
                  <thead>
                    <tr>
                      <th>Received On</th>
                      <th className="hide-small">Who</th>
                    </tr>
                  </thead>
                  <tbody>
                    {failures.map((f, i) => (
                      <tr key={i}>
                        <td className="hide-small">
                          {moment(f.created_on).format("LLLL")}
                        </td>
                        <td className="show-small">
                          {moment(f.created_on).format("MM/DD")}
                        </td>
                        <td className="hide-small">
                          {f.notify_org_user && (
                            <>
                              <div>
                                {f.notify_org_user.first_name}{" "}
                                {f.notify_org_user.last_name}
                              </div>
                            </>
                          )}
                        </td>
                        <td className="text-right hide-small">
                          <Button
                            variant="custom"
                            className="p-0 m-0"
                            onClick={() => showFailure(f)}
                          >
                            <span role="img" aria-label="Incident Details">
                              ⚙️
                            </span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          )}
          {failures.length === 0 && (
            <Row>
              <Col className="text-center pb-3">
                <h2>This ping has not yet experienced any incidents. Yay!</h2>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      <ResultModal
        showModal={showFailureModal}
        setShowModal={setShowFailureModal}
        title="Failure Details"
        result={failureToShow}
      />
    </Body>
  );
};

export default PongSummary;
