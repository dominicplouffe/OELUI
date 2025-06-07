import React, { useState } from "react";
import CompanyEmail from "../components/Registration/CompanyEmail";
import Code from "../components/Registration/Code";
import Password from "../components/Registration/Password";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const [code, setCode] = useState(null);
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  const incrementStep = () => {
    setStep((prev) => prev + 1);
  };

  const savePayload = (inviteCode) => {
    setCode(inviteCode);
    incrementStep();
  };

  const complete = () => {
    navigate("/auth/login", { replace: true });
  };

  return (
    <div className="auth-wrapper d-flex no-block justify-content-center align-items-center position-relative">
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

            <CompanyEmail step={step} callback={incrementStep} />
            <Code step={step} callback={savePayload} />
            <Password step={step} code={code} callback={complete} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
