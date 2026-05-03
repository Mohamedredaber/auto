import React from "react";

const DataTable = ({ className = "", children, ...props }) => {
  return (
    <div className={["ui-table-wrap", className].filter(Boolean).join(" ")}>
      <table className="ui-table" {...props}>
        {children}
      </table>
    </div>
  );
};

export default DataTable;
