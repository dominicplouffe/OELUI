import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

const DeleteButton = ({ pingId, active, deleteAction }) => {
  const [showModal, setShowModal] = useState(false);

  if (pingId === null) {
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
        [-] Delete Ping
      </Button>
      <Modal show={showModal} onHide={setShowModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Ping</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            <strong>This action is NOT reversible!</strong>
          </p>
          <p>
            When you delete a ping, you also delete all the associated
            historical data. If you want to keep the associated data, keep the
            ping disabled. Disabled pings do not count towards your Ping Count
            on your Plan.
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
            Yes, Delete My Ping
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteButton;
