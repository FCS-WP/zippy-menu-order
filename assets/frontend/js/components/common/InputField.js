import React from "react";

const InputField = ({
  label,
  type = "text",
  value,
  placeholder,
  onChange,
  className = "",
  required = false,
  min,
  max,
}) => {
  return (
    <div className="input-field">
      {label && <label className="input-field__label">{label}</label>}

      <input
        className="input-field__input"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        min={min}
        max={max}
      />
    </div>
  );
};

export default InputField;
