import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

const DisableButton = ({ pingId, active, disableAction }) => {
  const [showModal, setShowModal] = useState(false);

  if (pingId === null) {
    return null;
  }
  if (!active) {
    return null;
  }

  return (
    <>
      <Button
        variant="danger"
        onClick={() => setShowModal(true)}
        className="btn-rounded"
      >
        Pause Ping
      </Button>
      <Modal show={showModal} onHide={setShowModal}>
        <Modal.Header closeButton>
          <Modal.Title>Disable Ping</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            If you disable a Ping, the associated URL will no longer be
            monitored.
          </p>
          <p>Are you certain you want to continue?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="light"
            onClick={() => setShowModal(false)}
            className="btn-rounded"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              disableAction();
              setShowModal(false);
            }}
            className="btn-rounded"
          >
            Proceed
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DisableButton;
