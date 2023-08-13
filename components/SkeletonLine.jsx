import React from "react";
import PropTypes from "prop-types";

function SkeletonLine({ numberLines = 1 }) {
  const arr = Array.from({ length: numberLines }, (_, index) => index);

  return (
    <>
      {arr.map((r, i) => (
        <div
          key={i}
          className="w-full h-6 rounded-md bg-slate-300 animate-pulse"
        />
      ))}
    </>
  );
}

SkeletonLine.propTypes = {
  numberLines: PropTypes.number,
};

export default SkeletonLine;
