import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function Logout() {
  return (
    <button className="transition-colors duration-300 ease-in-out  text-light-text/75 dark:text-dark-text/75 hover:text-light-text dark:hover:text-dark-text">
      <FontAwesomeIcon icon={faRightFromBracket} size="lg" />
    </button>
  );
}
