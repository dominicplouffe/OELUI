import React, { useState, useEffect } from "react";
import InputText from "../components/InputText";
import InputSelect from "../components/InputSelect";
import { Row, Col } from "react-bootstrap";
import api from "../../utils/api";

const MetricCondition = ({ instanceId }) => {
  const [metricName, setMetricName] = useState("");
  const [metricRollup, setMetricRollup] = useState("value");
  const [op, setOp] = useState("==");
  const [value, setValue] = useState("");
  const [spanValue, setSpanValue] = useState(1);
  const [spanType, setSpanType] = useState("hours");
  const [latestValue, setLatestValue] = useState(null);

  const setRuleValue = (f, v) => {
    if (f === setValue) {
      v = parseFloat(v);
      if (isNaN(v)) {
        v = "";
      }
    }
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
    console.log(rule);

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

  useEffect(() => {
    if (metricName) {
      sendMetricSample(metricName);
    }
    // eslint-disable-next-line
  }, [metricRollup, op, spanValue, spanType]);

  return (
    <>
      <Row>
        <Col>
          <span className="card-title h5">Trigger a notification when:</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <InputSelect
            id="metric_name"
            label="Metric"
            defaultValue={metricName}
            defaultText="Select a Metric"
            helperText="Select a metric you want to alert on"
            showDefault={true}
            values={[
              { value: "cpu_percent.cpu", text: "CPU" },
              { value: "memory_percent.mem", text: "Memory" },
              { value: "disk_percent.disk", text: "Disk Space" },
            ]}
            onChange={(e) => setMetricAndGetSample(e.target.value)}
          />
        </Col>
        <Col>
          <InputSelect
            id="metric_rollup"
            label="Which value would you like to compare"
            defaultValue={metricRollup}
            helperText="Select how you want to rollup the value"
            showDefault={false}
            values={[
              { value: "value", text: "Last value" },
              { value: "sum", text: "Sum of the values" },
              { value: "avg", text: "Average of the values" },
            ]}
            onChange={(e) => setRuleValue(setMetricRollup, e.target.value)}
          />

          {["sum", "avg"].indexOf(metricRollup) > -1 && (
            <Row className="mt-3">
              <Col xs={12}>
                <label className="form-label">Over the past</label>
              </Col>
              <Col xs="3">
                <InputSelect
                  id="span_value"
                  helperText="Time range"
                  showDefault={false}
                  values={getTimeValues()}
                  defaultValue={spanValue}
                  onChange={(e) => setRuleValue(setSpanValue, e.target.value)}
                />
              </Col>
              <Col xs="3">
                <InputSelect
                  id="span_type"
                  helperText="Time range"
                  showDefault={false}
                  values={[
                    { value: "hours", text: "Hours" },
                    { value: "days", text: "Days" },
                  ]}
                  defaultValue={spanType}
                  onChange={(e) => setRuleValue(setSpanType, e.target.value)}
                />
                <Col xs="6">&nbsp;</Col>
              </Col>
            </Row>
          )}
        </Col>
        <Col>
          <InputSelect
            id="op"
            label="Evalution"
            defaultValue={op}
            showDefault={false}
            values={[
              { value: "==", text: "is equal to" },
              { value: "<", text: "is less than" },
              { value: "<=", text: "is less than or equal to" },
              { value: ">", text: "is greater than" },
              { value: ">=", text: "is greater than or equal to" },
            ]}
            onChange={(e) => setRuleValue(setOp, e.target.value)}
          />
        </Col>
        <Col>
          <Row style={{ width: "100%" }}>
            <Col>
              <label className="form-label">Value</label>
            </Col>
            {latestValue && (
              <Col className="text-right">
                <label className="form-label">
                  Latest Value: <strong>{latestValue.toFixed(2)}</strong>
                </label>
              </Col>
            )}
          </Row>
          <InputText
            id="value"
            value={value}
            helperText="The value you want to compare against"
            onChange={(e) => setRuleValue(setValue, parseFloat(e.target.value))}
          />
        </Col>
      </Row>
    </>
  );
};

export default MetricCondition;
