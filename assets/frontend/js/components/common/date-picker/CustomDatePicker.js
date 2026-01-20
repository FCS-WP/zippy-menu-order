import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DateHelper from "../../../utils/date-helper";

export default function CustomDatePicker({
  label,
  value,
  minDate = null,
  maxDate = null,
  onChange,
  placeholder = "Select date",
  className = "",
  disabled = false,
}) {
  const selectedDate = value ? new Date(value) : null;

  return (
    <div className={`custom-date-picker ${className}`}>
      {label && <label className="custom-date-picker__label">{label}</label>}

      <DatePicker
        selected={selectedDate}
        onChange={(date) =>
          onChange(date ? DateHelper.getDateWithOffset(date) : "")
        }
        minDate={minDate}
        maxDate={maxDate}
        placeholderText={placeholder}
        className="custom-date-picker__input"
        disabled={disabled}
      />
    </div>
  );
}
