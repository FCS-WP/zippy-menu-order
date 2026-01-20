import React from "react";

const PerPage = ({ onChange, currentRowsPerPage = 10, title = "" }) => {
  return (
    <div className="flex w-[300px] items-center justify-end gap-4">
      <label className="mb-1 block text-sm text-slate-800">{title}</label>
      <div className="relative">
        <select
          onChange={onChange}
          className="ease w-full cursor-pointer appearance-none rounded border border-slate-200 bg-transparent py-2 pr-8 pl-3 text-sm text-slate-700 shadow-sm transition duration-300 placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:shadow-md focus:outline-none"
        >
          <option value="10" defaultValue={currentRowsPerPage == 10}>
            10
          </option>
          <option value="20" defaultValue={currentRowsPerPage == 20}>
            20
          </option>
          <option value="50" defaultValue={currentRowsPerPage == 50}>
            50
          </option>
        </select>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.2"
          stroke="currentColor"
          className="absolute top-2.5 right-2.5 ml-1 h-5 w-5 text-slate-700"
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
