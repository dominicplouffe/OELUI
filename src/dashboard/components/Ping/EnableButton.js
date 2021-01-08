import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

const EnableButton = ({ objectId, active, enableAction, isPong }) => {
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
        variant="success"
        onClick={() => setShowModal(true)}
        className="btn-rounded"
      >
        Enable {isPong ? `Pong` : `Ping`}
      </Button>
      <Modal show={showModal} onHide={setShowModal}>
        <Modal.Header closeButton>
          <Modal.Title>Disable {isPong ? `Pong` : `Ping`}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {isPong ? (
            <p>
              By enabling your Pong, you will be able to start sending requests
              again
            </p>
          ) : (
            <p>
              If you enabled a {isPong ? `Pong` : `Ping`}, onErrorLog will
              restart monitoring the URL you provided.
            </p>
          )}
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
              enableAction();
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

export default EnableButton;
