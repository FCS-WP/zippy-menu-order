import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCheck } from "@fortawesome/free-solid-svg-icons";

const CustomSelect = ({ label = "Select", items = [], onChange, value }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setSelected(item);
    setOpen(false);
    onChange && onChange(item);
  };

  useEffect(() => {
    if (value == null) {
      setSelected(null);
    }
  }, [value]);

  return (
    <div className="cs-wrapper" ref={selectRef}>
      {/* Button */}
      <div className="cs-button" onClick={() => setOpen(!open)}>
        <span className="cs-button-label">
          {selected ? selected.label : label}
        </span>

        <FontAwesomeIcon
          icon={faChevronDown}
          className={`cs-icon ${open ? "cs-icon-rotate" : ""}`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <ul className="cs-dropdown">
          {items.map((item) => (
            <li
              key={item.value}
              className="cs-item"
              onClick={() => handleSelect(item)}
            >
              <span
                className={`cs-check ${
                  selected?.value === item.value ? "cs-check-active" : ""
                }`}
              >
                <FontAwesomeIcon icon={faCheck} className="cs-check-icon" />
              </span>

              <span className="cs-item-label">{item.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
