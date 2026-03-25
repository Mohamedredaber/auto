import React from "react";

const Unauthorized = () => {
  return (
    <div className="error-page unauthorized">
      <h1>403 - Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <a href="/">Go Home</a>
    </div>
  );
};

export default Unauthorized;
