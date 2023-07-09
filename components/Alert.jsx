import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

function Alert({ alert = {}, clearAlert }) {
  const [hide, setHide] = useState(false);

  const hideHandler = () => {
    setHide(true);

    const clear = () => {
      clearAlert();
      setHide(false);
    };

    const t = setTimeout(clear, 500);
  };

  return Object.keys(alert).length ? (
    <div className="_alerts_container">
      <div
        className={`_alert ${alert.status ? "_success" : "_error"} ${
          hide ? "_hide" : ""
        }`}
      >
        {alert.message}{" "}
        <FontAwesomeIcon
          onClick={hideHandler}
          icon={faCircleXmark}
          style={{ color: "#ffffff" }}
        />
      </div>
    </div>
  ) : null;
}

Alert.propTypes = {
  alert: PropTypes.object.isRequired,
  clearAlert: PropTypes.func.isRequired,
};

export default Alert;
