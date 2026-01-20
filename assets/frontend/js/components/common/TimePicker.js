// TimePicker.jsx
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomTimeInput from "./CustomTimeInput";

export default function TimePicker({
  value,
  onChange,
  label,
  placeholder,
  disabled = false,
  timeIntervals = 15,
}) {
  //HH:mm string -> Date object
  const parseTime = (timeStr) => {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Date object -> HH:mm string
  const handleChange = (date) => {
    if (!date) return onChange(null);
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    onChange(`${hh}:${mm}`);
  };

  return (
    <div className="flex flex-col">
      {label && <label className="mb-1 text-sm text-gray-600">{label}</label>}
      <DatePicker
        selected={parseTime(value)}
        onChange={handleChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={timeIntervals}
        timeCaption={label}
        dateFormat="HH:mm"
        disabled={disabled}
        customInput={
          <CustomTimeInput
            value={placeholder}
            disabled={disabled}
          />
        }
      />
    </div>
  );
}
