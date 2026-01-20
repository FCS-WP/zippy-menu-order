import React from "react";

const PerPage = ({ onChange, currentRowsPerPage = 10, title = "" }) => {
  return (
    <div className="perpage-container">
      <label className="perpage-label">{title}</label>

      <div className="perpage-select-wrapper">
        <select
          onChange={onChange}
          className="perpage-select"
          defaultValue={currentRowsPerPage}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.2"
          stroke="currentColor"
          className="perpage-icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
          />
        </svg>
      </div>
    </div>
  );
};

export default PerPage;
