import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import makeAsyncScriptLoader from "react-async-script";
import Body from "../components/Body";
import api from "../../utils/api";
import { Card, Col, Row, Button } from "react-bootstrap";
import useAuth from "../../auth/useAuth";

const CLIENT = {
  sandbox:
    "AaxRY3kRS9ouuVyaVGz-gmya7zCQnqTO4fVDkFPFLNQU77vwkdevkKX-R0JfMu-3nQTMete9cflK2kY6",
  production: "TODO",
};

const CLIENT_ID =
  process.env.NODE_ENV === "production" ? CLIENT.production : CLIENT.sandbox;

let PayPalButton = null;

const Subscription = ({ paypal, ...props }) => {
  const { currentUser } = props;
  const { forceRefresh } = useAuth();
  const { role } = currentUser;
  const { subscriptions } = role.org;
  const subscription = subscriptions.find((s) => s.product === "onerrorlog");
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(() => {
    return subscription !== null;
  });
  useEffect(() => {
    if (paypal) {
      PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });
      setLoading(false);
    }
  }, [paypal]);
  return (
    <Body title="Subscription" selectedMenu="team" loading={loading} {...props}>
      <Card>
        <Card.Body>
          <Card.Title>Manage Plan</Card.Title>
          {subscribed ? (
            <>
              <Row>
                <Col>Basic Plan</Col>
              </Row>
              <Row>
                <Col>Status: {subscription.status}</Col>
              </Row>
              <Row>
                <Col className="text-right" xs={12}>
                  <Button variant="text">Cancel Plan</Button>
                </Col>
              </Row>
            </>
          ) : (
            <>
              <Row className="mt-5 mb-2 mx-4">
                <Col xs={12} className="text-center">
                  <h3>Subscribe to basic plan, $5 / month</h3>
                </Col>
              </Row>
              <Row className="mt-0 mb-5 mx-4">
                <Col xs={12} lg={4} className="text-center offset-lg-4">
                  <PayPalButton
                    style={{
                      shape: "rect",
                      color: "gold",
                      layout: "vertical",
                      label: "subscribe",
                    }}
                    createSubscription={(data, actions) => {
                      return actions.subscription.create({
                        plan_id: "P-82N94014MN143174JL72GZDQ",
                      });
                    }}
                    onApprove={async (data, actions) => {
                      const { data: resp = null } = await api(
                        "/api/subscriptions/create",
                        "POST",
                        {
                          id: data.subscriptionID,
                          product: "onerrorlog",
                          plan: "basic",
                        }
                      );
                      if (resp) {
                        forceRefresh();
                        setSubscribed(true);
                      }
                    }}
                  />
                </Col>
              </Row>
            </>
          )}
        </Card.Body>
      </Card>
    </Body>
  );
};

export default makeAsyncScriptLoader(
  `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&vault=true&intent=subscription`,
  {
    globalName: "paypal",
    attributes: { "data-sdk-integration-source": "button-factory" },
  }
)(Subscription);
