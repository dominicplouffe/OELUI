import React from "react";
import useAuth from "../../auth/useAuth";

const useCheckLimits = (
  limitName,
  currentLimitValue,
  defaultLimitValue = 5,
  product = "onerrorlog"
) => {
  const { user } = useAuth();
  const { role } = user;
  const { subscriptions } = role.org;
  const subscription = subscriptions.find((s) => s.product_name === product);
  if (subscription) {
    const { limits } = subscription;
    const limit = limits[limitName] || defaultLimitValue;
    return { canDo: limit > currentLimitValue, subscription, limit };
  }
  return { canDo: false };
};

export default useCheckLimits;
