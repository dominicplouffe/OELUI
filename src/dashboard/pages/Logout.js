import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { ACCESS, REFRESH, USER_INFO } from "../../utils/globals";

const Logout = () => {
  useEffect(() => {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
    localStorage.removeItem(USER_INFO);
  }, []);

  return <Navigate to="/auth/login" replace />;
};

export default Logout;
