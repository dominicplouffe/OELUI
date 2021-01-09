import React, { useState, useEffect } from "react";
import InputText from "../components/InputText";
import InputSelect from "../components/InputSelect";
import { Row, Col, Button, Badge } from "react-bootstrap";
import api from "../../utils/api";

const MetricCondition = ({ instanceId, setShowCondition }) => {
  const [metricName, setMetricName] = useState("");
  const [metricRollup, setMetricRollup] = useState("value");
  const [op, setOp] = useState("==");
  const [value, setValue] = useState("");
  const [spanValue, setSpanValue] = useState(1);
  const [spanType, setSpanType] = useState("hours");
  const [latestValue, setLatestValue] = useState(null);
  const [incidentMethod, setIncidentMethod] = useState("team");
  const [formErrors, setFormErrors] = useState([]);
  const [sentence, setSentence] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const setRuleValue = (f, v) => {
    f(v);
  };

  const setMetricAndGetSample = (v) => {
    setMetricName(v);
    if (v) {
      sendMetricSample(v);
    }
  };

  const sendMetricSample = async (metricName) => {
    const category = metricName.split(".")[0];
    const metric = metricName.split(".")[1];

    const rule = {
      category: category,
      metric: metric,
      metric_rollup: metricRollup,
      op: op,
      timespan: {
        value: parseInt(spanValue),
        span: spanType,
      },
    };

    const payload = {
      instance_id: instanceId,
      rule: rule,
    };

    const { data = null, error = null } = await api(
      "metrics-sample",
      "POST",
      payload
    );

    if (data) {
      setLatestValue(data.value);
    }

    if (error) {
      alert("Oops something went wrong");
    }
  };

  const getTimeValues = () => {
    const vals = [];

    for (let i = 0; i < 30; i++) {
      vals.push({ value: i + 1, text: i + 1 });
    }

    return vals;
  };

  const cancelCreateNotification = () => {
    setMetricName("");
    setMetricRollup("value");
    setOp("");
    setValue("");
    setSpanValue(1);
    setSpanType("hours");
    setLatestValue(null);
    setIncidentMethod("team");

    setShowCondition(false);
  };

  const saveCondition = () => {
    const errors = [];
    if (!value || isNaN(parseFloat(value))) {
      errors.push("value");
    }
    if (!metricName) {
      errors.push("metric_name");
    }
    if (!metricRollup) {
      errors.push("metric_rollup");
    }
    if (!metricRollup) {
      errors.push("metric_rollup");
    }
    if (!op) {
      errors.push("op");
    }

    if (["sum", "avg"].indexOf(metricRollup) > -1) {
      if (!spanValue) {
        errors.push("span_value");
      }
      if (!spanType) {
        errors.push("span_type");
      }
    }

    if (!incidentMethod) {
      errors.push("incidentmethod");
    }

    setFormErrors(errors);

    if (errors.length === 0) {
      const sentence = ["OnErrorLog will notify you when the"];

      if (metricRollup === "value") {
        sentence.push(<strong>Last Value</strong>);
      } else if (metricRollup === "avg") {
        sentence.push(<strong>Average</strong>);
      } else if (metricRollup === "sum") {
        sentence.push(<strong>Sum</strong>);
      }

      sentence.push("of the");

      if (metricName === "cpu_percent.cpu") {
        sentence.push(<strong>CPU</strong>);
      } else if (metricName === "memory_percent.mem") {
        sentence.push(<strong>Memory</strong>);
      } else if (metricName === "disk_percent.disk") {
        sentence.push(<strong>Disk Space</strong>);
      }

      sentence.push("metric");

      if (["sum", "avg"].indexOf(metricRollup) > -1) {
        sentence.push(`, over the past ${spanValue}`);
        if (spanType === "hours") {
          sentence.push("hour(s),");
        } else {
          sentence.push("day(s),");
        }
      }

      const opText = {
        "==": "is equal to",
        "<": "is less than",
        "<=": "is less than or equal to",
        ">": "is greater than",
        ">=": "is greater than or equal to",
      };

      sentence.push(opText[op]);
      sentence.push(<strong>{value}</strong>);
      sentence.push(".");

      setSentence(sentence);
      setShowConfirm(true);
    }
  };

  const doSave = async () => {
    const payload = {
      instance: instanceId,
      rule: {
        category: metricName.split(".")[0],
        metric: metricName.split(".")[1],
        metric_rollup: metricRollup,
        timespan: {
          value: spanValue,
          span: spanType,
        },
        op: op,
        value: value,
      },
      active: true,
      notification_type: incidentMethod,
      incident_interval: 1,
      callback_url: null,
      callback_username: null,
      callback_password: null,
      doc_link: null,
    };

    const { data = null, error = null } = await api(
      "metric_condition/",
      "POST",
      payload
    );
  };

  useEffect(() => {
    if (metricName) {
      sendMetricSample(metricName);
    }
    // eslint-disable-next-line
  }, [metricRollup, op, spanValue, spanType]);

  return (
    <>
      <Row>
        <Col xs={12} sm={12} xl={3}>
          <InputSelect
            id="metric_name"
            label="Select a Metric:"
            defaultValue={metricName}
            defaultText="Select a Metric"
            helperText="Select a metric you want to alert on"
            showDefault={true}
            values={[
              { value: "cpu_percent.cpu", text: "CPU" },
              { value: "memory_percent.mem", text: "Memory" },
              { value: "disk_percent.disk", text: "Disk Space" },
            ]}
            onChange={(e) => {
              setShowConfirm(false);
              setMetricAndGetSample(e.target.value);
            }}
            isInvalid={formErrors.indexOf("metric_name") > -1}
          />
        </Col>
        <Col
          className="text-right pt-2"
          xs={12}
          sm={12}
          lg={6}
          style={{ lineHeight: "80px", verticalAlign: "middle" }}
        >
          {latestValue !== null && (
            <Badge variant="primary">
              <span className="h5">
                Latest Value: <strong>{latestValue.toFixed(2)}</strong>
              </span>
            </Badge>
          )}
        </Col>
      </Row>
      {metricName.length > 0 && (
        <>
          <Row className="mt-3">
            <Col xs={12} sm={12} xl={3}>
              <InputSelect
                id="metric_rollup"
                label="Trigger a notification when"
                defaultValue={metricRollup}
                helperText="Select how you want to rollup the value"
                showDefault={false}
                values={[
                  { value: "value", text: "Last value" },
                  { value: "sum", text: "Sum of the values" },
                  { value: "avg", text: "Average of the values" },
                ]}
                onChange={(e) => {
                  setShowConfirm(false);
                  setRuleValue(setMetricRollup, e.target.value);
                }}
                isInvalid={formErrors.indexOf("metric_rollup") > -1}
              />
              {["sum", "avg"].indexOf(metricRollup) > -1 && (
                <Row className="ml-3 mt-2">
                  <Col xs={4}>
                    <InputSelect
                      id="span_value"
                      label="Over the past"
                      showDefault={false}
                      values={getTimeValues()}
                      defaultValue={spanValue}
                      onChange={(e) => {
                        setShowConfirm(false);
                        setRuleValue(setSpanValue, e.target.value);
                      }}
                      disabled={["sum", "avg"].indexOf(metricRollup) === -1}
                      isInvalid={formErrors.indexOf("span_value") > -1}
                    />
                  </Col>
                  <Col xs={3}>
                    <InputSelect
                      id="span_type"
                      label={<span>&nbsp;</span>}
                      showDefault={false}
                      values={[
                        { value: "hours", text: "Hours" },
                        { value: "days", text: "Days" },
                      ]}
                      defaultValue={spanType}
                      onChange={(e) => {
                        setShowConfirm(false);
                        setRuleValue(setSpanType, e.target.value);
                      }}
                      disabled={["sum", "avg"].indexOf(metricRollup) === -1}
                      isInvalid={formErrors.indexOf("span_type") > -1}
                    />
                  </Col>
                </Row>
              )}
            </Col>
            <Col xs={12} sm={12} xl={3}>
              <InputSelect
                id="op"
                label="Condition"
                defaultValue={op}
                showDefault={false}
                values={[
                  { value: "==", text: "is equal to" },
                  { value: "<", text: "is less than" },
                  { value: "<=", text: "is less than or equal to" },
                  { value: ">", text: "is greater than" },
                  { value: ">=", text: "is greater than or equal to" },
                ]}
                onChange={(e) => {
                  setShowConfirm(false);
                  setRuleValue(setOp, e.target.value);
                }}
                isInvalid={formErrors.indexOf("op") > -1}
              />
            </Col>
            <Col xs={12} sm={12} xl={3}>
              <InputText
                id="value"
                value={value}
                label="Value"
                helperText="Must be a number"
                onChange={(e) => setRuleValue(setValue, e.target.value)}
                isInvalid={formErrors.indexOf("value") > -1}
              />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col xs={12} sm={12} xl={3}>
              <InputSelect
                id="incidentmethod"
                label="How would your link to be contacted"
                defaultValue={incidentMethod}
                defaultText="Select a contact method"
                helperText="The method that onErrorLog will contact you if it can't ping your endpoint"
                showDefault={true}
                values={[
                  {
                    value: "team",
                    text: "Notify your team (email or text message)",
                  },
                ]}
                onChange={(e) => {
                  setShowConfirm(false);
                  setIncidentMethod(e.target.value);
                }}
                isInvalid={formErrors.indexOf("incidentmethod") > -1}
              />
            </Col>
          </Row>
          {!showConfirm && (
            <Row className="mt-5">
              <Col xs={12} sm={12} xl={3}>
                <Button
                  variant="primary"
                  onClick={() => saveCondition()}
                  className="btn-rounded"
                >
                  Save Notification
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => cancelCreateNotification()}
                  className="btn-rounded ml-2"
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          )}
          {showConfirm && (
            <Row
              className="mt-3 pt-3"
              style={{
                borderTop: "1px solid #f3f4f6",
                backgroundColor: "#f3f4f6",
              }}
            >
              <Col>
                <Row>
                  <Col xs={12} sm={12} xl={4}>
                    {sentence.map((s, i) => (
                      <span key={i}>
                        {s}
                        {` `}
                      </span>
                    ))}
                  </Col>
                </Row>
                <Row className="mt-3 pb-3">
                  <Col>
                    <Button
                      variant="primary"
                      onClick={() => doSave()}
                      className="btn-rounded"
                    >
                      Confirm
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() => cancelCreateNotification()}
                      className="btn-rounded ml-2"
                    >
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
        </>
      )}
    </>
  );
};

export default MetricCondition;
