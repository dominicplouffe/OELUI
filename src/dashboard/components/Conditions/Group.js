import React, { useState } from "react";
import { Row, Col, Button, Form, Alert } from "react-bootstrap";
import InputSelect from "../InputSelect";
import InputText from "../InputText";

const Group = ({ selectedBox }) => {
  if (selectedBox === null || selectedBox === "exact") {
    return null;
  }
  return (
    <>
      <Row className="mt-2">
        <Col xs={12} lg={6}>
          <Row>
            <Col>
              <InputSelect
                id="interval"
                label="Count Of"
                defaultValue={`5`}
                defaultText="Select a key"
                showDefault={true}
                values={[
                  { value: "5", text: "5 Minutes" },
                  { value: "10", text: "10 Minutes" },
                  { value: "15", text: "15 Minutes" },
                  { value: "20", text: "20 Minutes" },
                  { value: "25", text: "25 Minutes" },
                  { value: "30", text: "30 Minutes" },
                ]}
                // isInvalid={formErrors.indexOf("interval") > -1}
                // onChange={(e) => setValue(setInterval, e.target.value)}
              />
            </Col>
            <Col className="mt-4 text-center">
              <div className="pt-3">Equals</div>
            </Col>
            <Col>
              <InputText label={`Condition`} />
            </Col>
          </Row>
        </Col>
        <Col className="pt-4" xs={12} lg={6}>
          <div>
            <Alert variant="info">
              <small>
                onErrorLog will trigger a notification if it sees a key that
                matches the criteria you have inputed.
              </small>
            </Alert>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Group;
