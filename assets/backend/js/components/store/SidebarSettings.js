import React from "react";

export default function SidebarSettings({ timeInterval, setTimeInterval }) {
  return (
    <div className="mb-6 p-3">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Time Interval (minutes)
      </label>
      <select
        value={timeInterval}
        onChange={(e) => setTimeInterval(Number(e.target.value))}
        className="focus:ring-primary-500 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:outline-none"
      >
        {[15, 30, 45, 60].map((val) => (
          <option key={val} value={val}>
            {val} minutes
          </option>
        ))}
      </select>
    </div>
  );
}
