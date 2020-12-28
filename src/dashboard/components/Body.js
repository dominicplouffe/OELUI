import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Navbar, Alert } from "react-bootstrap";

const Body = ({
  currentUser,
  selectedMenu,
  title,
  children,
  loading = false,
}) => {
  const [sideBarType, setSideBarType] = useState("full");
  const [sideBarLeft, setSideBarLeft] = useState(null);

  const getSelectedMenuClass = (menuName) => {
    if (selectedMenu === menuName) {
      return "selected";
    }

    return "";
  };

  const getActiveMenuClass = (menuName) => {
    if (selectedMenu === menuName) {
      return "active";
    }
  };

  const windowSize = () => {
    if (window.innerWidth <= 1024) {
      setSideBarType("mini-sidebar");
    } else {
      setSideBarType("full");
    }
  };

  window.onresize = (e) => {
    windowSize();
  };

  const hamburgerClick = () => {
    if (sideBarLeft === "0") {
      setSideBarLeft(null);
    } else {
      setSideBarLeft("0");
    }
  };

  useEffect(() => {
    windowSize();
    // eslint-disable-next-line
  });

  return (
    <>
      <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">
          <img
            src="https://dplouffe.ca/static/img/domlogo.png"
            alt="wrapkit"
            style={{ maxWidth: "100px", margin: "auto", float: "left" }}
          />
          <span
            className="pl-3 h3 mt-3 hide-small"
            style={{ color: "#000", float: "left" }}
          >
            onErrorLog
          </span>
        </a>
        {/* <button
          className="navbar-toggler position-absolute d-md-none collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebarMenu"
          aria-controls="sidebarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button> */}

        {/* <Navbar.Toggle aria-controls="sidebarMenu" /> */}

        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap">
            <Link className="nav-link" to="/auth/logout">
              <div className="top-link">
                <img
                  src="https://onerrorlog.s3.amazonaws.com/images/logout.png"
                  alt="logout"
                  className="icon"
                />
                &nbsp; Logout
              </div>
            </Link>
          </li>
        </ul>
      </header>

      <div className="container-fluid">
        <Row>
          <nav
            id="sidebarMenu"
            className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse mt-3 sidebar-nav"
          >
            <ul id="sidebarnav">
              <li className={`sidebar-item ${getSelectedMenuClass("ping")}`}>
                <Link
                  className={`sidebar-link sidebar-link ${getActiveMenuClass(
                    "ping"
                  )}`}
                  to="/pings"
                >
                  <img
                    src="https://onerrorlog.s3.amazonaws.com/images/ping.png"
                    alt="pings"
                    className="icon"
                  />
                  <span className="hide-menu">Pings</span>
                </Link>
              </li>
              <li className={`sidebar-item ${getSelectedMenuClass("pong")}`}>
                <Link
                  className={`sidebar-link sidebar-link ${getActiveMenuClass(
                    "pong"
                  )}`}
                  to="/pongs"
                >
                  <img
                    src="https://onerrorlog.s3.amazonaws.com/images/pong.png"
                    alt="pings"
                    className="icon"
                  />
                  <span className="hide-menu">Pongs</span>
                </Link>
              </li>

              <li className={`sidebar-item ${getSelectedMenuClass("vitals")}`}>
                <Link
                  className={`sidebar-link sidebar-link ${getActiveMenuClass(
                    "vitals"
                  )}`}
                  to="/vitals"
                >
                  <img
                    src="https://onerrorlog.s3.amazonaws.com/images/vitals.png"
                    alt="vitals"
                    className="icon"
                  />
                  <span className="hide-menu">Vitals</span>
                </Link>
              </li>

              <li className="list-divider"></li>
              {currentUser.role.role === "admin" && (
                <li className={`sidebar-item ${getSelectedMenuClass("team")}`}>
                  <Link
                    className={`sidebar-link sidebar-link ${getActiveMenuClass(
                      "team"
                    )}`}
                    to="/team"
                  >
                    <img
                      src="https://onerrorlog.s3.amazonaws.com/images/teams.png"
                      alt="team"
                      className="icon"
                    />
                    <span className="hide-menu">Team</span>
                  </Link>
                </li>
              )}

              {currentUser.role.role === "admin" && (
                <li
                  className={`sidebar-item ${getSelectedMenuClass("schedule")}`}
                >
                  <Link
                    className={`sidebar-link sidebar-link ${getActiveMenuClass(
                      "schedule"
                    )}`}
                    to="/schedule"
                  >
                    <img
                      src="https://onerrorlog.s3.amazonaws.com/images/schedule.png"
                      alt="schedule"
                      className="icon"
                    />
                    <span className="hide-menu">Schedule</span>
                  </Link>
                </li>
              )}

              <li className={`sidebar-item ${getSelectedMenuClass("profile")}`}>
                <Link
                  className={`sidebar-link sidebar-link ${getActiveMenuClass(
                    "profile"
                  )}`}
                  to="/profile"
                >
                  <img
                    src="https://onerrorlog.s3.amazonaws.com/images/profile.png"
                    alt="profile"
                    className="icon"
                  />
                  <span className="hide-menu">Profile</span>
                  {currentUser && currentUser.role.phone_number === null && (
                    <span
                      role="img"
                      aria-label="Mising Phone Number"
                      className="ml-1 hide-menu"
                    >
                      ☎️
                    </span>
                  )}
                </Link>
              </li>
            </ul>
          </nav>

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
              <Row className="w-100" noGutters>
                <Col>
                  {currentUser &&
                    currentUser.role.phone_number_verified_on === null && (
                      <Alert variant="info" dismissible>
                        <Alert.Heading>
                          <strong>Confirm Your Phone Number</strong>
                        </Alert.Heading>
                        <p>
                          It looks like you have not yet confirmed your phone
                          number. If you want to receive alerts with a text
                          message, please confirm your phone number in your{" "}
                          <Link to="/profile">
                            <strong>profile</strong>
                          </Link>
                        </p>
                      </Alert>
                    )}
                  {loading ? `loading....` : children}
                </Col>
              </Row>
            </div>
            <div className="footer text-center">
              &copy; Copyright{" "}
              <a
                href="https://www.dplouffe.ca"
                target="_blank"
                rel="noopener noreferrer"
              >
                dplouffe Analytics
              </a>
              . All rights reserved.
              <br />
              <a
                href="https://www.dplouffe.ca"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>{" "}
              |{" "}
              <a
                href="https://www.dplouffe.ca"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Use
              </a>
            </div>
          </main>
        </Row>
      </div>
    </>
  );
};

export default Body;
