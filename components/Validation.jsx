import PropTypes from "prop-types";

function Validation({ message, style }) {
  return (
    <p className={`_validation ${style} ${message.length ? "show" : ""}`}>
      {message}
    </p>
  );
}

Validation.propTypes = {
  message: PropTypes.string.isRequired,
  style: PropTypes.string.isRequired,
};

export default Validation;
