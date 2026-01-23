// HourRow.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faPaste, faTrash } from "@fortawesome/free-solid-svg-icons";
import Button from "../common/button/Button";
import TimePicker from "../common/TimePicker";

export default function HourRow({
  slot,
  slotIndex,
  dayIndex,
  disabled,
  updateHourSlot,
  removeHourSlot,
  onCopy,
  onPaste,
  isCopyActive,
  showPaste,
  timeInterval,
  hasOverlapSlot,
}) {
  return (
    <div className={`mb-2 flex items-center gap-2`}>
      <TimePicker
        value={slot.open}
        onChange={(v) => updateHourSlot(dayIndex, slotIndex, "open", v)}
        disabled={disabled}
        placeholder="Open time"
        timeIntervals={timeInterval}
      />

      <span className="text-gray-600">to</span>

      <TimePicker
        value={slot.close}
        onChange={(v) => updateHourSlot(dayIndex, slotIndex, "close", v)}
        disabled={disabled}
        placeholder="Close time"
        timeIntervals={timeInterval}
      />

      {/* COPY button */}
      {slotIndex === 0 && (
        <Button
          className={`ml-3 p-2 ${
            disabled || hasOverlapSlot
              ? "cursor-not-allowed text-gray-300"
              : isCopyActive
                ? "text-purple-600"
                : "text-gray-500 hover:text-blue-600"
          }`}
          disabled={disabled || hasOverlapSlot}
          onClick={onCopy}
        >
          <FontAwesomeIcon icon={faCopy} />
        </Button>
      )}

      {/* PASTE button */}
      {showPaste && !isCopyActive && (
        <Button
          className={`ml-3 p-2 ${
            disabled
              ? "cursor-not-allowed text-gray-300"
              : "text-blue-600 hover:text-blue-800"
          }`}
          disabled={disabled}
          onClick={onPaste}
        >
          <FontAwesomeIcon icon={faPaste} />
        </Button>
      )}

      {/* DELETE button  */}
      {slotIndex > 0 && (
        <Button
          className={`ml-3 p-2 ${
            disabled ? "text-gray-300" : "text-red-500 hover:text-red-700"
          }`}
          disabled={disabled}
          onClick={() => removeHourSlot(dayIndex, slotIndex)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      )}
    </div>
  );
}
