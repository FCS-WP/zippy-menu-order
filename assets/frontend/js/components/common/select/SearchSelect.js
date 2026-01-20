import React, { useState, useEffect, useRef, useCallback } from "react";
import { debounce } from "../../../helpers/debounce";

export default function SearchSelect({
  value,
  setValue,
  placeholder = "Search",
  fetchOptions,
  minCharacters = 3,
  icon = null,
}) {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    setInputValue(value ? value.label : "");
  }, [value]);

  useEffect(() => {
    debounceSearchServices(inputValue);
  }, [inputValue, fetchOptions, minCharacters]);

  const debounceSearchServices = useCallback(
    debounce(async (keyword) => {
      if (keyword.length < minCharacters) {
        setOptions([
          {
            id: null,
            label: `Please type at least ${minCharacters} characters`,
          },
        ]);
        return;
      }

      if (keyword.trim()) {
        const dataServices = await fetchOptions(keyword);
        if (dataServices) {
          setOptions(dataServices);
        } else {
          toast.error("Search error");
          setOptions([]);
        }
      } else {
        setOptions([]);
      }
    }, 500),
    [],
  );

  const handleSelect = (option) => {
    if (option?.id !== null) {
      setValue(option);
      setInputValue(option.label);
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex items-center">
        {icon && <>{icon}</>}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setOpen(true);
          }}
          placeholder={placeholder}
          className="w-full !outline-none"
          onFocus={() => setOpen(true)}
        />
      </div>

      {/* Loading spinner */}
      {loading && (
        <div className="absolute top-1/2 right-2 -translate-y-1/2">
          <svg
            className="h-4 w-4 animate-spin text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
            ></path>
          </svg>
        </div>
      )}

      {/* Options dropdown */}
      {open && options.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded border border-gray-300 bg-white text-sm shadow-lg">
          {options.map((option) => (
            <li
              key={option.id ?? "empty"}
              onClick={() => handleSelect(option)}
              className={`cursor-pointer px-3 py-2 hover:bg-blue-100 ${
                option.id === value?.id ? "bg-blue-200" : ""
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
