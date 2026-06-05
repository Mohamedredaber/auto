import React from "react";

export const InputField = ({
  label,
  id,
  className = "",
  inputClassName = "",
  ...props
}) => {
  return (
    <label className={["ui-field", className].filter(Boolean).join(" ")}>
      {label ? <span className="ui-field__label">{label}</span> : null}
      <input id={id} className={["ui-input", inputClassName].filter(Boolean).join(" ")} {...props} />
    </label>
  );
};

export const SelectField = ({
  label,
  id,
  className = "",
  selectClassName = "",
  children,
  ...props
}) => {
  return (
    <label className={["ui-field", className].filter(Boolean).join(" ")}>
      {label ? <span className="ui-field__label">{label}</span> : null}
      <select id={id} className={["ui-select", selectClassName].filter(Boolean).join(" ")} {...props}>
        {children}
      </select>
    </label>
  );
};
