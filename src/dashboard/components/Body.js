import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Button, Alert } from "react-bootstrap";

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
      <div
        id="main-wrapper"
        data-theme="dark"
        data-layout="vertical"
        data-navbarbg="skin6"
        data-sidebartype={sideBarType}
        data-sidebar-position="fixed"
        data-header-position="fixed"
        data-boxed-layout="full"
      >
        <header className="topbar" data-navbarbg="skin6">
          <nav className="navbar top-navbar navbar-expand-md">
            <div className="navbar-header" data-logobg="skin6">
              {/* This is for the sidebar toggle which is visible on mobile only */}
              <Button
                variant="link"
                className="nav-toggler waves-effect waves-light d-block d-md-none"
                onClick={() => hamburgerClick()}
              >
                <i className="ti-menu ti-close" style={{ color: "#FFF" }}></i>
              </Button>
              <div className="navbar-brand text-center">
                <img
                  src="https://dplouffe.ca/static/img/domlogo.png"
                  alt="wrapkit"
                  style={{ maxWidth: "100px", margin: "auto" }}
                />
              </div>
            </div>

            <div
              className="navbar-collapse collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav float-left mr-auto ml-3 pl-1">
                <li className="nav-item d-none d-md-block">
                  <h3 className="page-title text-truncate text-light font-weight-medium mb-1">
                    {currentUser.role.org.name}
                  </h3>
                </li>
              </ul>

              <ul className="navbar-nav float-right">
                <li className="nav-item dropdown">
                  <span className="ml-2 d-none d-lg-inline-block">&nbsp;</span>
                </li>
              </ul>
            </div>
          </nav>
        </header>
        <aside
          className="left-sidebar"
          data-sidebarbg="skin6"
          style={{ position: "fixed", left: sideBarLeft }}
        >
          <div
            className="scroll-sidebar ps-container ps-theme-default ps-active-y"
            data-sidebarbg="skin6"
          >
            <nav
              className="sidebar-nav"
              style={{ overflowY: "auto", height: "100%" }}
            >
              <div className="text-center mb-4">
                <Link
                  to="/newping"
                  className="btn btn-warning btn-rounded mb-2 mr-2"
                >
                  {sideBarType === "full" || sideBarLeft ? `New Ping` : `+`}
                </Link>
              </div>
              <ul id="sidebarnav">
                <li className={`sidebar-item ${getSelectedMenuClass("ping")}`}>
                  <Link
                    className={`sidebar-link sidebar-link ${getActiveMenuClass(
                      "ping"
                    )}`}
                    to="/pings"
                  >
                    &nbsp;
                    <span className="hide-menu">Pings</span>
                  </Link>
                </li>
                {/* <li className={`sidebar-item ${getSelectedMenuClass("pong")}`}>
                  <Link
                    className={`sidebar-link sidebar-link ${getActiveMenuClass(
                      "pong"
                    )}`}
                    to="/pongs"
                  >
                    <FontAwesomeIcon
                      icon="user-edit"
                      className="mb-1"
                    ></FontAwesomeIcon>
                    &nbsp;
                    <span className="hide-menu">Pongs</span>
                  </Link>
                </li> */}

                <li className="list-divider"></li>
                {currentUser.role.role === "admin" && (
                  <li
                    className={`sidebar-item ${getSelectedMenuClass("team")}`}
                  >
                    <Link
                      className={`sidebar-link sidebar-link ${getActiveMenuClass(
                        "team"
                      )}`}
                      to="/team"
                    >
                      &nbsp;
                      <span className="hide-menu">Team</span>
                    </Link>
                  </li>
                )}

                {currentUser.role.role === "admin" && (
                  <li
                    className={`sidebar-item ${getSelectedMenuClass(
                      "schedule"
                    )}`}
                  >
                    <Link
                      className={`sidebar-link sidebar-link ${getActiveMenuClass(
                        "schedule"
                      )}`}
                      to="/schedule"
                    >
                      &nbsp;
                      <span className="hide-menu">Schedule</span>
                    </Link>
                  </li>
                )}

                <li
                  className={`sidebar-item ${getSelectedMenuClass("profile")}`}
                >
                  <Link
                    className={`sidebar-link sidebar-link ${getActiveMenuClass(
                      "profile"
                    )}`}
                    to="/profile"
                  >
                    &nbsp;
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
                <li
                  className={`sidebar-item ${getSelectedMenuClass("signout")}`}
                >
                  <Link
                    className={`sidebar-link sidebar-link ${getActiveMenuClass(
                      "signout"
                    )}`}
                    to="/auth/logout"
                  >
                    &nbsp;
                    <span className="hide-menu">Logout</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </aside>
        <div className="page-wrapper" style={{ display: "block" }}>
          <div className="container-fluid">
            <Row>
              <Col xl={{ offset: 2, span: 8 }}>
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
        </div>
      </div>
    </>
  );
};

export default Body;
