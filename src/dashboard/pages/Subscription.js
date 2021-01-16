import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import makeAsyncScriptLoader from "react-async-script";
import api from "../../utils/api";
import useAuth from "../../auth/useAuth";
import { Redirect } from "react-router-dom";

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
  const { forceRefresh, loginUser } = useAuth();
  const { role } = currentUser;
  const { subscriptions } = role.org;
  const subscription = subscriptions.find(
    (s) => s.product_name === "onerrorlog"
  );
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(() => {
    return subscription ? true : false;
  });
  useEffect(() => {
    if (paypal) {
      PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });
      setLoading(false);
    }
  }, [paypal]);
  return (
    <div className="auth-wrapper d-flex no-block justify-content-center align-items-center position-relative">
      <div className="auth-box-big row">
        <div
          className="col-lg-6 col-md-4 modal-bg-img"
          style={{
            backgroundImage:
              "url(https://onerrorlog.s3.amazonaws.com/images/peace-of-mind-2.jpg)",
            backgroundSize: "cover",
          }}
        ></div>

        <div className="col-lg-6 col-md-8 bg-white flex flex-column align-items-center justify-content-center">
          {subscribed ? (
            <Redirect to="/" />
          ) : (
            <>
              <div className="mt-5 mb-4 mx-4 text-center">
                <h3>Subscribe to the basic plan, for $5 / month</h3>
              </div>
              <div className="mt-0 mb-5 mx-4 text-center">
                {loading ? (
                  "Loading..."
                ) : (
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
                        await loginUser();
                        forceRefresh();
                        setSubscribed(true);
                      }
                    }}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default makeAsyncScriptLoader(
  `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&vault=true&intent=subscription`,
  {
    globalName: "paypal",
    attributes: { "data-sdk-integration-source": "button-factory" },
  }
)(Subscription);
