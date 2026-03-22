import React from "react";
import "./Spinner.css"; // Assuming we create a CSS file for it

const Spinner = ({ fullscreen = false }) => {
  const className = fullscreen ? "spinner fullscreen" : "spinner";

  return (
    <div className={className}>
      <div className="spinner-inner"></div>
    </div>
  );
};

export default Spinner;
