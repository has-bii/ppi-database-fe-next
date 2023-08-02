import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function Modal({ title, children, show, setShow }) {
  return (
    <div className={`modal_container ${show ? "show" : ""}`}>
      <div className="modal">
        <div className="modal_header">
          {title}
          <button onClick={() => setShow(false)}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className="modal_body">{children}</div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
};

export default Modal;
