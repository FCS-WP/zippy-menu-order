import React from "react";

const InputIcon = (props) => {
  const {
    icon,
    type = 'text',
    min = null,
    max = null,
    iconPosition = "start",
    id = "",
    name = "",
    onChange,
    value = "",
    className = "",
    placeholder = "",
  } = props;

  return (
    <div
      className={`linear box-border text-[14px] flex items-center border border-2 border-gray-300 bg-white transition duration-400 focus-within:border-2 focus-within:border-primary-500 ${className}`}
    >
      {iconPosition === "start" && <> {icon} </>}
      <input
        className="grow outline-none"
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete="off"
        min={min}
        max={max}
        name={name}
        onChange={onChange}
        value={value}
      />
      {iconPosition === "end" && <> {icon} </>}
    </div>
  );
};

export default InputIcon;
