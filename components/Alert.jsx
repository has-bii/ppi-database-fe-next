import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

function Alert({ alert = {}, setAlert }) {
  const [hide, setHide] = useState(false);

  const clear = () => {
    setAlert({});
    setHide(false);
  };

  const hideHandler = () => {
    setHide(true);

    const t = setTimeout(() => {
      clear();
      clearTimeout(t);
    }, 500);
  };

  useEffect(() => {
    if (Object.keys(alert).length) {
      const timer = setTimeout(() => {
        hideHandler();
        clearTimeout(timer);
      }, 3000);
    }
  }, [alert]);

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
  setAlert: PropTypes.func.isRequired,
};

export default Alert;
