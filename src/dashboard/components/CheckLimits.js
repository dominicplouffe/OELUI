import React from "react";
import useCheckLimits from "../hooks/useCheckLimits";

const CheckLimits = ({
  limitName,
  currentLimitValue,
  defaultLimitValue = 10,
  product = "onerrorlog",
  children,
  LimitExceededComponent,
  ...props
}) => {
  const { canDo = false, subscription = null, limit = null } = useCheckLimits(
    limitName,
    currentLimitValue,
    defaultLimitValue,
    product
  );
  if (canDo) {
    return <>{children}</>;
  }
  if (LimitExceededComponent) {
    return (
      <LimitExceededComponent
        subscription={subscription}
        limit={limit}
        {...props}
      />
    );
  }
  return <></>;
};

export default CheckLimits;
