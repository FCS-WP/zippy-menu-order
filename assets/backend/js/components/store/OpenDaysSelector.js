import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

export default function OpenDaysSelector({ days, toggleDayOpen }) {
  return (
    <div className="mb-4 flex items-center border-b border-gray-200 pb-4">
      <div className="w-48">
        <h3 className="!my-0 text-sm font-semibold text-gray-700">Open days</h3>
      </div>

      <div className="flex flex-grow justify-start space-x-6">
        {days.map((dayObj) => (
          <div key={dayObj.dayKey} className="flex flex-col items-center">
            <label
              htmlFor={`day-checkbox-${dayObj.dayKey}`}
              className="relative flex h-5 w-5 cursor-pointer items-center justify-center"
            >
              <input
                type="checkbox"
                id={`day-checkbox-${dayObj.dayKey}`}
                checked={dayObj.is_open}
                onChange={(e) =>
                  toggleDayOpen(dayObj.dayIndex, e.target.checked)
                }
                className="absolute h-8 w-8 appearance-none rounded-full border border-gray-300 checked:border-green-600 checked:bg-green-600 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />

              {dayObj.is_open && (
                <FontAwesomeIcon icon={faCheck} className="z-10 text-white" />
              )}
            </label>

            <span className="mt-2 text-sm font-medium text-gray-700 select-none">
              {dayObj.day.slice(0, 3)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
