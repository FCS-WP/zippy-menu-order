import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import Button from "../../common/button/Button";
import TimePicker from "../../common/TimePicker";
import CustomDatePicker from "../../common/DatePicker";
import { SpecialDaysApi } from "../../../api";

export default function SpecialDaysTab({
  specialDays,
  setSpecialDays,
  storeId,
  setOldSpecialDays,
}) {
  const updateSpecialDay = (index, field, value) => {
    const updated = [...specialDays];
    updated[index][field] = value;
    setSpecialDays(updated);
  };

  const addSpecialDay = () => {
    setSpecialDays([
      ...specialDays,
      { date: "", closed: false, open_time: "", close_time: "" },
    ]);
  };

  const removeSpecialDay = async (id, index) => {
    if (!confirm("Are you sure you want to delete this special day?")) {
      return;
    }

    const updated = [...specialDays];
    updated.splice(index, 1);
    setSpecialDays(updated);

    await SpecialDaysApi.deleteSpecialDays({ id });
  };

  const getSpecialDays = async () => {
    const res = await SpecialDaysApi.getSpecialDays({ store_id: storeId });
    if (res.status === "success") {
      if (res.data.length === 0) {
        setSpecialDays([
          { date: "", closed: false, open_time: "", close_time: "" },
        ]);
        setOldSpecialDays([
          { date: "", closed: false, open_time: "", close_time: "" },
        ]);
      } else {
        setSpecialDays(res.data);
        setOldSpecialDays(res.data.map((d) => ({ ...d })));
      }
    }
  };

  useEffect(() => {
    getSpecialDays();
  }, []);

  return (
    <div className="space-y-2">
      {specialDays.map((day, index) => (
        <div
          key={index}
          className="flex flex-wrap items-center gap-6 rounded-lg bg-gray-50 p-3 shadow"
        >
          {/* Date Picker */}
          <CustomDatePicker
            label="Date"
            value={day.date}
            onChange={(v) => updateSpecialDay(index, "date", v)}
            className="w-40"
          />

          {/* Switch Toggle Closed/Open */}
          <label className="relative mt-6 inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="sr-only"
              checked={day.closed}
              onChange={() => updateSpecialDay(index, "closed", !day.closed)}
            />
            <div
              className={`h-6 w-12 rounded-full transition-colors ${
                day.closed ? "bg-red-500" : "bg-gray-500"
              }`}
            />
            <span
              className={`absolute top-1 left-1 h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                day.closed ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </label>

          {/* Open/Close Time */}
          {!day.closed && (
            <>
              <TimePicker
                label="Open Time"
                value={day.open_time}
                onChange={(v) => updateSpecialDay(index, "open_time", v)}
              />
              <TimePicker
                label="Close Time"
                value={day.close_time}
                onChange={(v) => updateSpecialDay(index, "close_time", v)}
              />
            </>
          )}

          {/* Buttons */}
          <div className="ml-auto flex gap-2">
            <Button
              className="flex items-center gap-1 bg-blue-100 px-2 py-1 text-blue-700 hover:bg-blue-200"
              onClick={addSpecialDay}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
            <Button
              className="bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-700"
              onClick={() => removeSpecialDay(day.id, index)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
