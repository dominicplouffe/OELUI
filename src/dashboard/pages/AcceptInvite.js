import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import InputText from "../components/InputText";
import api from "../../utils/api";
import PhoneInput from "react-phone-number-input";
import { useNavigate, useLocation } from "react-router-dom";

const AcceptInvite = () => {
  const [code, setCode] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [expired, setExpired] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const inviteCode = params.get("code");
    if (inviteCode) {
      setCode(inviteCode);
      (async (c) => {
        const { data } = await api(
          "/api/auth/check-invite",
          "POST",
          { code: c },
          false,
          false
        );
        if (data) {
          setConfirmed(true);
        } else {
          setExpired(true);
          setConfirmed(true);
        }
      })(inviteCode);
    }
    // eslint-disable-next-line
  }, []);

  const handleFinishSignup = async () => {
    const fErrors = [];
    let isValid = true;

    if (!password.trim()) {
      fErrors.push("password");
      isValid = false;
    }

    if (!confirmation.trim()) {
      fErrors.push("confirmation");
      isValid = false;
    }

    if (password !== confirmation) {
      fErrors.push("password", "confirmation");
      setError("Password and confirmation must match");
      isValid = false;
    }

    setFormErrors(fErrors);

    if (!isValid) return;

    const payload = { code, password, confirmation, phone_number: phoneNumber };
    const { data, error } = await api(
      "auth/finish-invite",
      "POST",
      payload,
      false,
      false
    );
    if (data) {
      navigate(`/auth/login`, { replace: true });
    } else if (error) {
      setError(error);
    }
  };

  return (
    <div className="auth-wrapper d-flex justify-content-center align-items-center position-relative">
      <div className="auth-box-big row">
        <div
          className="col-lg-6 col-md-4 modal-bg-img"
          style={{
            backgroundImage:
              "url(https://onerrorlog.s3.amazonaws.com/images/peace-of-mind-2.jpg)",
            backgroundSize: "cover",
          }}
        />

        <div className="col-lg-6 col-md-8 bg-white">
          <div className="p-3">
            <div className="text-center">
              <img
                src="https://onerrorlog.s3.amazonaws.com/images/oel-logo.png"
                alt="onErrorLog"
                style={{ maxWidth: "100px" }}
              />
            </div>

            {!confirmed && (
              <Row className="pt-5 text-center">
                <Col>Fetching Confirmation...</Col>
              </Row>
            )}

            {expired && (
              <Row className="pt-5 text-center">
                <Col>
                  <p>Your code is either invalid or has expired.</p>
                  <p>Ask your administrator to resend a new invite.</p>
                </Col>
              </Row>
            )}

            {confirmed && !expired && (
              <>
                <h2 className="mt-3 text-center">
                  <small>Welcome to</small>
                  <br /> onErrorLog
                </h2>

                <Row>
                  <Col xs={12} lg={6} className="mt-2">
                    <InputText
                      id="password"
                      type="password"
                      label="Password"
                      value={password}
                      isInvalid={formErrors.includes("password")}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="off"
                    />
                  </Col>
                  <Col xs={12} lg={6} className="mt-2">
                    <InputText
                      id="confirmation"
                      type="password"
                      label="Confirmation"
                      value={confirmation}
                      isInvalid={formErrors.includes("confirmation")}
                      onChange={(e) => setConfirmation(e.target.value)}
                      autoComplete="off"
                    />
                  </Col>
                </Row>

                <Row>
                  <Col xs={12} lg={6} className="mt-2">
                    <label className="form-label">
                      Phone Number <small>(Optional)</small>
                    </label>
                    <PhoneInput
                      value={phoneNumber}
                      onChange={setPhoneNumber}
                      defaultCountry="US"
                      id={formErrors.includes("phone") ? "phoneError" : "phone"}
                    />
                  </Col>
                  <Col>
                    <p className="pb-2">&nbsp;</p>
                    <small>Used to notify you when we need to.</small>
                  </Col>
                </Row>

                {error && (
                  <Col className="text-danger mt-3 text-center">
                    {error}
                  </Col>
                )}

                <div className="col-lg-12 text-center mt-2">
                  <button
                    type="button"
                    className="btn btn-block btn-primary"
                    onClick={handleFinishSignup}
                  >
                    Complete Registration
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvite;
