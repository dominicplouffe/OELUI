import React from "react";
import useAuth from "./useAuth";
import { Route, Redirect, useLocation } from "react-router-dom";

export const DashboardRoute = ({
  component: Component,
  admin,
  skipSubscriptionCheck = false,
  ...rest
}) => {
  const { user } = useAuth();
  const location = useLocation();

  if (admin && user.role.role !== "admin") {
    return null;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        renderComponentOrLogin(
          Component,
          props,
          user,
          location,
          skipSubscriptionCheck
        )
      }
    />
  );
};

const renderComponentOrLogin = (
  Component,
  props,
  user,
  location = null,
  skipSubscriptionCheck = false
) => {
  if (user === null) {
    if (location) {
      return (
        <Redirect
          to={`/auth/login?n=${encodeURIComponent(
            location.pathname.concat(location.search)
          )}`}
        />
      );
    }
    return <Redirect to="/auth/login" />;
  }
  if (!skipSubscriptionCheck) {
    const { role } = user;
    const { subscriptions } = role.org;
    const subscription =
      subscriptions.find((s) => s.product_name === "onerrorlog") || null;
    if (subscription === null) {
      return <Redirect to="/subscription" />;
    }
  }

  return <Component {...props} currentUser={user} />;
};
