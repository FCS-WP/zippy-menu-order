import React from "react";

export default function Switch({
  checked,
  onChange,
  disabled = false,
  size = "md",
}) {
  const sizes = {
    sm: {
      track: "w-9 h-5",
      thumb: "w-4 h-4",
      translate: "translate-x-4",
    },
    md: {
      track: "w-11 h-6",
      thumb: "w-5 h-5",
      translate: "translate-x-5",
    },
    lg: {
      track: "w-14 h-8",
      thumb: "w-7 h-7",
      translate: "translate-x-6",
    },
  };

  const s = sizes[size];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`
        relative inline-flex items-center
        ${s.track}
        rounded-full
        transition-colors duration-200
        ${checked ? "bg-green-500" : "bg-gray-300"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <span
        className={`
          absolute left-0.5
          ${s.thumb}
          bg-white
          rounded-full
          shadow
          transform transition-transform duration-200
          ${checked ? s.translate : "translate-x-0"}
        `}
      />
    </button>
  );
}
