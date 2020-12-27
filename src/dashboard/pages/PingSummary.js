import React, { useState, useEffect } from "react";
import Body from "../components/Body";
import { Card, Row, Col, ProgressBar, Table } from "react-bootstrap";
import moment from "moment";
import api from "../../utils/api";
import PingCard from "../components/PingCard";
import { ResponsiveLine } from "@nivo/line";
import useAuth from "../../auth/useAuth";
import { REASONS } from "../../utils/globals";
import { Link } from "react-router-dom";
import FailureStatus from "../components/FailureStatus";

const PingSummary = (props) => {
  const [calendarData, setCalendarData] = useState([]);
  const [calendarStart, setCalendarStart] = useState("2019-06-02");
  const [calendarEnd, setCalendarEnd] = useState("2020-06-02");
  const [summary, setSummary] = useState(null);
  const [calendarHelp, setCalendarHelp] = useState(
    <div className="mt-2">&nbsp;</div>
  );
  const [responseTimeData, setResponseTimeData] = useState(null);
  const [failureCounts, setFailureCounts] = useState([]);
  const [failures, setFailures] = useState([]);

  const [loading, setLoading] = useState(true);

  const { refresh } = useAuth();

  const fetchSummary = async (id) => {
    const { data = null, error = null } = await api(`ping/summary/${id}/`);

    if (data) {
      setSummary(data.pings[0]);

      const resData = [
        {
          id: "Response (ms)",
          data: [],
        },
      ];
      for (let i = 0; i < data.pings[0].snapshot.length; i++) {
        const ss = data.pings[0].snapshot[i];
        const row = {
          x: moment(ss.date).format("H"),
          y: null,
        };
        if (ss.status) {
          row.y = parseInt(ss.avg_res * 1000);
        }

        resData[0].data.push(row);
      }

      setResponseTimeData(resData);
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
    } else if (c.status === "success") {
      return "#409918";
    } else if (c.status === "danger") {
      return "#991840";
    }
    return "#efefef";
  };

  return (
    <Body title="Ping Summary" selectedMenu="ping" {...props} loading={loading}>
      {summary && (
        <PingCard
          m={summary}
          showEdit={true}
          showSummary={false}
          showOther={true}
        />
      )}
      <Card>
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
      </Card>
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
                            {c.text} (success: {c.success} - failure:{" "}
                            {c.failure} - {(c.success_rate * 100).toFixed(0)}%)
                          </em>
                        </div>
                      );
                    } else {
                      setCalendarHelp(
                        <div className="mt-2">
                          <strong>{moment(c.date).format("LL")}</strong> -
                          <em>No pings tracked on this day</em>
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
                      <th>Reason</th>
                      <th>When</th>
                      <th className="hide-small">Who</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {failures.map((f, i) => (
                      <tr key={i}>
                        <td>{REASONS[f.reason]}</td>

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
                        <td>
                          <FailureStatus failure={f} />
                        </td>
                        <td className="text-right hide-small">
                          <Link to={`/failure/${f.id}`}>
                            <img
                              src="https://onerrorlog.s3.amazonaws.com/images/details.png"
                              alt={`Failure Details for ${f.id}`}
                              className="icon"
                            />
                          </Link>
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
    </Body>
  );
};

export default PingSummary;
