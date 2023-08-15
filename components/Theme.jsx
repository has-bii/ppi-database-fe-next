// components/ThemeToggle.js
import { faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "./ThemeProvider";

function Theme({ style, hidden = false }) {
  const { toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`px-4 ml-auto w-fit text-light-text dark:text-dark-text ${
        style === "white" ? "text-white" : "text-light-text dark:text-dark-text"
      } ${hidden ? "lg:hidden" : ""}`}
    >
      <FontAwesomeIcon icon={faCircleHalfStroke} size="xl" />
    </button>
  );
}

export default Theme;
