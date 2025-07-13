import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/nav.css";
import "./styles/oel.css";

import Login from "./dashboard/pages/Login";
import Logout from "./dashboard/pages/Logout";
import Registration from "./dashboard/pages/Registration";
import AcceptInvite from "./dashboard/pages/AcceptInvite";
import AuthProvider from "./auth/AuthProvider";
import { DashboardRoute } from "./auth/AuthRoute";
import Ping from "./dashboard/pages/Pings";
import PingScreen from "./dashboard/pages/PingScreen";
import PingSummary from "./dashboard/pages/PingSummary";

import Pong from "./dashboard/pages/Pongs";
import PongScreen from "./dashboard/pages/PongScreen";
import PongSummary from "./dashboard/pages/PongSummary";

import Team from "./dashboard/pages/Team";
import Schedule from "./dashboard/pages/Schedule";

import { NewPing, NewPong } from "./dashboard/pages/NewPing";
import Profile from "./dashboard/pages/Profile";
import Failure from "./dashboard/pages/Failure";

import Dashboard from "./dashboard/pages/Dashboard";
import NewMonitor from "./dashboard/pages/NewMonitor";

import Metrics from "./dashboard/pages/Metrics";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="auth/*" element={<AuthRoutes />} />

      {/* Dashboard & Protected */}
      <Route path="dashboard" element={<DashboardRoute element={<Dashboard />} />} />
      <Route path="newmonitor" element={<DashboardRoute element={<NewMonitor />} admin />} />
      <Route path="profile" element={<DashboardRoute element={<Profile />} />} />
      <Route path="pings" element={<DashboardRoute element={<Ping />} />} />
      <Route path="pongs" element={<DashboardRoute element={<Pong />} />} />
      <Route path="team" element={<DashboardRoute element={<Team />} admin />} />
      <Route path="schedule" element={<DashboardRoute element={<Schedule />} admin />} />

      {/* Pings */}
      <Route path="ping" element={<DashboardRoute element={<PingScreen />} admin />} />
      <Route path="ping/:id" element={<DashboardRoute element={<PingScreen />} admin />} />
      <Route path="newping" element={<DashboardRoute element={<NewPing />} admin />} />
      <Route path="ping/summary/:id" element={<DashboardRoute element={<PingSummary />} />} />

      {/* Pongs */}
      <Route path="newpong" element={<DashboardRoute element={<NewPong />} admin />} />
      <Route path="pong" element={<DashboardRoute element={<PongScreen />} admin />} />
      <Route path="pong/:id" element={<DashboardRoute element={<PongScreen />} admin />} />
      <Route path="pong/summary/:id" element={<DashboardRoute element={<PongSummary />} />} />

      {/* Metrics */}
      <Route path="metrics" element={<DashboardRoute element={<Metrics />} />} />

      <Route path="failure/:id/:otype/:oid" element={<DashboardRoute element={<Failure />} />} />

      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Catch-all could go here if you want a 404 */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

function AuthRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="logout" element={<Logout />} />
      <Route path="register" element={<Registration />} />
      <Route path="accept-invite" element={<AcceptInvite />} />
      {/* Optionally: <Route path="*" element={<Navigate to="login" />} /> */}
    </Routes>
  );
}

export default App;
