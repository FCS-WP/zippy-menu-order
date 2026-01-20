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
      className={`linear box-border text-[14px] flex items-center border rounded-xl border border-[#e5e7eb] bg-white px-3 py-3 outline-none focus:bg-[#f9fafb] hover:bg-[#f9fafb] bg-white transition duration-400 ${className}`}
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
