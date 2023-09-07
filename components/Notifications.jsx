import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function Notifications({ className }) {
  const [notif, setNotif] = useState([]);

  return (
    <button
      className={`text-slate-300 dark:text-white/80 hover:text-slate-400 transition-colors duration-300 ease-in-out dark:hover:text-white relative ${className}`}
    >
      <FontAwesomeIcon icon={faBell} size="lg" />
      {notif.length > 0 && (
        <>
          <span className="w-2 h-2 rounded-full bg-light-accent outline outline-2 dark:outline-dark-primary outline-white absolute top-0 right-0"></span>
          <span className="w-2 h-2 rounded-full bg-light-accent outline outline-2 dark:outline-dark-primary animate-ping outline-white absolute top-0 right-0"></span>
        </>
      )}
    </button>
  );
}

Notifications.propTypes = {
  className: PropTypes.string,
};

export default Notifications;
