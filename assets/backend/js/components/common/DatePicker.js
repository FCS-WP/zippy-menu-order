import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CustomDatePicker({
  label,
  value,
  onChange,
  placeholder = "Select date",
  className = "",
}) {
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (!value) {
      setSelectedDate(null);
      return;
    }

    const parsed = new Date(value);

    if (isNaN(parsed.getTime())) {
      setSelectedDate(null);
    } else {
      setSelectedDate(parsed);
    }
  }, [value]);

  const handleChange = (date) => {
    setSelectedDate(date);

    onChange?.(
      date
        ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
        : "",
    );
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {label && <label className="mb-1 text-sm text-gray-700">{label}</label>}

      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        placeholderText={placeholder}
        className="w-full rounded border bg-white px-3 py-3"
        dateFormat="yyyy-MM-dd"
        isClearable
      />
    </div>
  );
}
