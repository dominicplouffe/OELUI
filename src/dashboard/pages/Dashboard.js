import React from "react";
import Body from "../components/Body";

const Dashboard = (props) => {
  return (
    <Body title="Dashboard" selectedMenu="dashboard" {...props}>
      Dashboard
    </Body>
  );
};

export default Dashboard;
