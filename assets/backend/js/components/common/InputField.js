import React from "react";

const InputField = ({
  label,
  type = "text",
  value,
  placeholder = "",
  onChange,
  className = "",
  required = false,
  error = "",
  disabled = false,
  readOnly = false,
  leftIcon = null,
  rightIcon = null,
  min,
  max,
  ...props
}) => {
  return (
    <div className="flex w-full flex-col gap-1">
      {/* LABEL */}
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {/* INPUT WRAPPER */}
      <div
        className={`flex h-10 cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm hover:bg-gray-50 ${error ? "border-red-500" : "border-gray-300"} ${disabled ? "cursor-not-allowed bg-gray-100 opacity-70" : ""} ${className} `}
      >
        {leftIcon && <span className="mr-2 text-gray-400">{leftIcon}</span>}

        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          min={min}
          max={max}
          className="!focus:outline-none !focus:border-none !focus:shadow-none w-full !border-none bg-transparent outline-none"
          {...props}
        />

        {rightIcon && <span className="ml-2 text-gray-400">{rightIcon}</span>}
      </div>

      {/* ERROR MESSAGE */}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;
