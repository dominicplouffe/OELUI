import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "./useAuth";

/**
 * DashboardRoute wraps protected routes, redirecting unauthenticated users to login
 * and hiding routes requiring admin privileges.
 *
 * Usage in React Router v6:
 * <Route path="/dashboard" element={<DashboardRoute element={<Dashboard />} />} />
 * <Route path="/newmonitor" element={<DashboardRoute element={<NewMonitor />} admin />} />
 */
export const DashboardRoute = ({ element, admin = false }) => {
  const { user } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login, preserving intended path
  if (!user) {
    const redirectTo = `/auth/login?n=${encodeURIComponent(
      location.pathname + location.search
    )}`;
    return <Navigate to={redirectTo} replace />;
  }

  // If route requires admin and user is not admin, render nothing (or show a 403)
  if (admin && user.role.role !== "admin") {
    return null;
  }

  // Clone the provided element to inject currentUser prop
  return React.cloneElement(element, { currentUser: user });
};
