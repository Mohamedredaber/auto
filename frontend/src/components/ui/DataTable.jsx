import React from "react";

const DataTable = ({ className = "", children, ...props }) => {
  const childArray = React.Children.toArray(children);

  // If the single child is already a <table>, render it directly to avoid nested tables
  if (childArray.length === 1 && childArray[0]?.type === "table") {
    const table = childArray[0];
    return (
      <div className={["ui-table-wrap", className].filter(Boolean).join(" ")}>
        {table}
      </div>
    );
  }

  // Otherwise, render a native table wrapping the provided children (thead/tbody rows)
  return (
    <div className={["ui-table-wrap", className].filter(Boolean).join(" ")}>
      <table className="ui-table" {...props}>
        {children}
      </table>
    </div>
  );
};

export default DataTable;
