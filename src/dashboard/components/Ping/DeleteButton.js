import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

const DeleteButton = ({ objectId, active, deleteAction, isPong }) => {
  const [showModal, setShowModal] = useState(false);

  if (objectId === null) {
    return null;
  }
  if (active) {
    return null;
  }

  return (
    <>
      <Button
        variant="link"
        onClick={() => setShowModal(true)}
        style={{ color: "#a0a0a0" }}
      >
        [-] Delete {isPong ? `Pong` : `Ping`}
      </Button>
      <Modal show={showModal} onHide={setShowModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete {isPong ? `Pong` : `Ping`}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            <strong>This action is NOT reversible!</strong>
          </p>
          <p>
            When you delete a {isPong ? `pong` : `ping`}, you also delete all
            the associated historical data. If you want to keep the associated
            data, keep the {isPong ? `pong` : `ping`} disabled. Disabled{" "}
            {isPong ? `pongs` : `pings`} do not count towards your{" "}
            {isPong ? `Pong` : `Ping`} Count on your Plan.
          </p>
          <p>Are you absolutely certain you want to continue?</p>
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
            variant="danger"
            onClick={() => {
              deleteAction();
              setShowModal(false);
            }}
            className="btn-rounded"
          >
            Yes, Delete My {isPong ? `Pong` : `Ping`}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteButton;
