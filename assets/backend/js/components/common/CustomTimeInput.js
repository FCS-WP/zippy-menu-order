import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

const CustomTimeInput = React.forwardRef(
  ({ value, placeholder = "Select time", onClick, disabled }, ref) => {
    const displayValue = value || placeholder;
    const isPlaceholder = !value;

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={`flex w-40 items-center rounded-md border px-3 py-3 ${
          disabled
            ? "pointer-events-none cursor-not-allowed bg-gray-100"
            : "cursor-pointer bg-white"
        }`}
      >
        <FontAwesomeIcon
          icon={faClock}
          className={`mr-2 ${disabled ? "text-gray-400" : "text-gray-500"}`}
        />
        <span
          className={`${isPlaceholder ? "text-gray-400" : "text-gray-700"} ${
            disabled ? "text-gray-400" : ""
          }`}
        >
          {displayValue}
        </span>
      </div>
    );
  }
);

export default CustomTimeInput;
