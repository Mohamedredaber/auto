import React from "react";
import "./ui.css";

const Spinner = ({ fullscreen = false }) => {
  const className = fullscreen ? "spinner fullscreen" : "spinner";

  return (
    <div className={className}>
      <div className="spinner-inner"></div>
    </div>
  );
};

export default Spinner;
