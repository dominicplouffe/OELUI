import React, { useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import Exact from "./Conditions/Exact";
import Group from "./Conditions/Group";

const Condition = () => {
  const [selectedBox, setSelectedBox] = useState(null);

  const changeSelection = (e, sel) => {
    if (e.target.checked) {
      setSelectedBox(sel);
    } else {
      setSelectedBox(null);
    }
  };

  return (
    <>
      <Row>
        <Col>
          {(selectedBox === null || selectedBox === "exact") && (
            <Form.Check
              type={`checkbox`}
              label={
                <>
                  <div>Exact Value</div>
                  <div>
                    <small>
                      Notification will be triggered if your key/value matches a
                      condition.
                    </small>
                  </div>
                </>
              }
              onChange={(e) => changeSelection(e, "exact")}
            />
          )}
          {(selectedBox === null || selectedBox === "count") && (
            <Form.Check
              type={`checkbox`}
              label={
                <>
                  <div>Count</div>
                  <div>
                    <small>
                      Notification will be triggered if the key in your JSON
                      appears the total amount of time that is defined.
                    </small>
                  </div>
                </>
              }
              onChange={(e) => changeSelection(e, "count")}
            />
          )}
          {(selectedBox === null || selectedBox === "sum") && (
            <Form.Check
              type={`checkbox`}
              label={
                <>
                  <div>Sum</div>
                  <div>
                    <small>
                      Notification will be triggered if the value of your
                      key/value adds up to a defined number.
                    </small>
                  </div>
                </>
              }
              onChange={(e) => changeSelection(e, "sum")}
            />
          )}

          {(selectedBox === null || selectedBox === "average") && (
            <Form.Check
              type={`checkbox`}
              label={
                <>
                  <div>Average</div>
                  <div>
                    <small>
                      Notification will be triggered if the average of your
                      key/value is equal of higher than a defined number.
                    </small>
                  </div>
                </>
              }
              onChange={(e) => changeSelection(e, "average")}
            />
          )}
        </Col>
      </Row>

      <Exact selectedBox={selectedBox} />
      <Group selectedBox={selectedBox} />
    </>
  );
};

export default Condition;
