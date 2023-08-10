import React, { useEffect } from "react";
import PropTypes from "prop-types";

function Toast({ toastData }) {
  return (
    <div className={`_toast_container`}>
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
};

export default Toast;
