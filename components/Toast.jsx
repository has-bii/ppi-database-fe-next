import React, { useEffect } from "react";
import PropTypes from "prop-types";

function Toast({ toastData, setToastData, position = "bottom-0 right-0" }) {
  useEffect(() => {
    const shiftToast = () => {
      if (toastData.length) setToastData(toastData.slice(1));
    };

    const timeoutID = setTimeout(() => shiftToast(), 1500);

    return () => clearTimeout(timeoutID);
  }, [toastData]);

  return (
    <div className={`_toast_container ${position}`}>
      {toastData.map((t, index) => (
        <div key={index} className={`_toast ${t.style}`}>
          <div className="_toast_title">{t.title}</div>
          <div className="_toast_body">{t.body}</div>
        </div>
      ))}
    </div>
  );
}

Toast.propTypes = {
  toastData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      style: PropTypes.string,
    })
  ).isRequired,
  setToastData: PropTypes.func.isRequired,
  position: PropTypes.string,
};

export default Toast;
