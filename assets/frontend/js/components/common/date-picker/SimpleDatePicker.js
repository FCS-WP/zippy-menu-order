import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SimpleDatePicker({ label, selectedDate, onChange }) {
  const [startDate, setStartDate] = useState(
    selectedDate ? new Date(selectedDate) : null,
  );

  const handleChange = (date) => {
    setStartDate(date);
    if (onChange) {
      onChange(
        date
          ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
          : "",
      );
    }
  };

  return (
    <div className="flex flex-col">
      {label && (
        <label className="mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <DatePicker
        selected={startDate}
        onChange={handleChange}
        placeholderText="Select a date"
        className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-300 focus:ring focus:outline-none h-10"
      />
    </div>
  );
}
