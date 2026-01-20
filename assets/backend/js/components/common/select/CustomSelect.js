import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const CustomSelect = ({
  items = [],
  value,
  onChange,
  required = false,
  className = "w-64",
  label = "Select",
  filter = () => {},
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const selectRef = useRef(null);

  useEffect(() => {
    if (value && items.length > 0) {
      const found = items.find((item) => item.value === value);
      setSelected(found || null);
    }
  }, [value, items]);

  const handleSelect = (item, isValid = true) => {
    if (isValid) {
      setSelected(item);
      setOpen(false);
      onChange && onChange(item);
      return;
    }
    toast.error("Can not select this item.");
    return;
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={selectRef}
      className={`relative flex w-full flex-col gap-1 ${className}`}
    >
      {/* LABEL */}
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {/* SELECT BUTTON */}
      <div
        className="flex h-10 cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm hover:bg-gray-50"
        onClick={() => setOpen(!open)}
      >
        <span className="text-gray-700">
          {selected ? selected.label : "Select..."}
        </span>

        <FontAwesomeIcon
          icon={faChevronDown}
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* DROPDOWN LIST */}
      {open && (
        <ul className="absolute top-15 right-0 left-0 z-20 mt-2 max-h-60 overflow-y-auto rounded-lg border bg-white shadow">
          {items.map((item, index) => {
            let isValid = true;
            if (typeof filter === "function") {
              isValid = filter(item);
            }

            return (
              <li
                key={item.value ?? index}
                className="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-gray-100"
                onClick={() => handleSelect(item, isValid)}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded border ${
                    selected?.value === item.value
                      ? "bg-blue-600 text-white"
                      : "text-transparent"
                  }`}
                >
                  <FontAwesomeIcon icon={faCheck} size="xs" />
                </span>

                <span className="text-gray-700">{item.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
