import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import Button from "../common/button/Button";
import BackButton from "../common/button/BackButton";
import NormalDaysTab from "./tab-setting/NormalDaysTab";
import SpecialDaysTab from "./tab-setting/SpecialDaysTab";
import { OperetionsApi, SpecialDaysApi } from "../../api";
import { toast } from "react-toastify";

// ================= CONSTANTS =================

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const dayIndexMap = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 0,
};

const indexToDay = Object.keys(dayIndexMap).reduce((r, k) => {
  r[dayIndexMap[k]] = k;
  return r;
}, {});

// ================= HELPERS =================

const formatTime = (time) => {
  if (!time) return "";
  return time.includes(":") && time.split(":").length === 2
    ? `${time}:00`
    : time;
};

const splitCreateUpdate = (days) => {
  const createDays = [];
  const updateDays = [];

  days.forEach((d) => {
    const dayNum = dayIndexMap[d.day];

    // 🔥 DAY PASTE / DIRTY
    if (d.isDirty) {
      // UPDATE: only slot have id + Change
      const updateSlots = d.hours
        .filter(
          (h) =>
            h.slot_id &&
            h.open &&
            h.close &&
            (h.open !== h.original_open || h.close !== h.original_close),
        )
        .map((h) => ({
          id: h.slot_id,
          start_time: formatTime(h.open),
          end_time: formatTime(h.close),
        }));

      if (updateSlots.length > 0) {
        updateDays.push({
          day: dayNum,
          is_open: d.is_open,
          slots: updateSlots,
        });
      }

      // CREATE slot mới
      const createSlots = d.hours
        .filter((h) => !h.slot_id && h.open && h.close)
        .map((h) => ({
          start_time: formatTime(h.open),
          end_time: formatTime(h.close),
        }));

      if (createSlots.length > 0) {
        createDays.push({
          day: dayNum,
          is_open: d.is_open,
          slots: createSlots,
        });
      }

      return; 
    }


    const createSlots = d.hours
      .filter((h) => !h.slot_id && h.open && h.close)
      .map((h) => ({
        start_time: formatTime(h.open),
        end_time: formatTime(h.close),
      }));

    if (createSlots.length > 0) {
      createDays.push({
        day: dayNum,
        is_open: d.is_open,
        slots: createSlots,
      });
    }

    const updatedSlots = d.hours.filter(
      (h) =>
        h.slot_id &&
        h.open &&
        h.close &&
        (h.open !== h.original_open ||
          h.close !== h.original_close ||
          d.is_open !== d.old_is_open),
    );

    if (updatedSlots.length > 0) {
      updateDays.push({
        day: dayNum,
        is_open: d.is_open,
        slots: updatedSlots.map((h) => ({
          id: h.slot_id,
          start_time: formatTime(h.open),
          end_time: formatTime(h.close),
        })),
      });
    }
  });

  return { createDays, updateDays };
};

//COMPONENT

export default function StoreSettingPage({ storeId, storeName }) {
  const [activeTab, setActiveTab] = useState("normal");

  //INIT DEFAULT: Monday open
  const [days, setDays] = useState(() =>
    daysOfWeek.map((day) => ({
      day,
      dayKey: day.toLowerCase(),
      dayIndex: dayIndexMap[day],
      is_open: day === "Monday",
      original_is_open: null,
      hours: day === "Monday" ? [{ slot_id: null, open: "", close: "" }] : [],
    })),
  );

  const [specialDays, setSpecialDays] = useState([
    { label: "", date: "", closed: false, open_time: "", close_time: "" },
  ]);
  const loadedRef = useRef(false);
  const savingRef = useRef(false);
  const [oldSpecialDays, setOldSpecialDays] = useState([]);

  const goBack = () => {
    const base = window.location.href.split("&store_id=")[0];
    window.location.href = base;
  };

  // ================= LOAD API 

  const getOperation = async () => {
    if (!storeId || loadedRef.current) return;

    try {
      const res = await OperetionsApi.getOperations(storeId);
      const apiDays = res?.data?.days || [];

      if (apiDays.length === 0) {
        loadedRef.current = true;
        return;
      }

      const mapped = daysOfWeek.map((dayName) => {
        const apiDay = Object.values(apiDays).find(
          (d) => indexToDay[d.day] === dayName,
        );

        if (!apiDay) {
          return {
            day: dayName,
            dayKey: dayName.toLowerCase(),
            dayIndex: dayIndexMap[dayName],
            is_open: false,
            old_is_open: false,
            hours: [{ slot_id: null, open: "", close: "" }],
          };
        }

        const hours = apiDay.slots.map((s) => {
          const open = s.start_time.substring(0, 5);
          const close = s.end_time.substring(0, 5);

          return {
            slot_id: s.id,
            open,
            close,
            original_open: open,
            original_close: close,
          };
        });

        return {
          day: dayName,
          dayKey: dayName.toLowerCase(),
          dayIndex: dayIndexMap[dayName],
          is_open: apiDay.is_open,
          old_is_open: apiDay.is_open,
          hours: hours.length
            ? hours
            : [{ slot_id: null, open: "", close: "" }],
        };
      });
      setDays(mapped);
      loadedRef.current = true;
    } catch (err) {
      toast.error("Load operation failed");
    }
  };

  useEffect(() => {
    getOperation();
  }, [storeId]);

  //SAVE

  const saveAll = async () => {
    if (savingRef.current) return;
    savingRef.current = true;

    try {
      await updateSpecialDays();
      const { createDays, updateDays } = splitCreateUpdate(days);

      if (updateDays.length > 0) {
        const updateRes = await OperetionsApi.updateOperation({
          store_id: storeId,
          days: updateDays,
        });
        if (updateRes?.error?.status === 400) {
          toast.error(updateRes.error.message || "Update operation failed");
          return;
        }
      }
      // CREATE
      if (createDays.length > 0) {
        const createRes = await OperetionsApi.createOperation({
          store_id: storeId,
          days: createDays,
        });
        if (createRes?.error?.status === 400) {
          toast.error(createRes.error.message || "Create operation failed");
          return;
        }
      }
      toast.success("Saved successfully!");
      loadedRef.current = false;
      getOperation();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        err?.message ||
        "Unexpected error occurred";
      toast.error(msg);
    } finally {
      savingRef.current = false;
    }
  };

  const getChangedSpecialDays = (newList, oldList) => {
    return newList.filter((day) => {
      const oldDay = oldList.find((d) => d.date === day.date);

      if (!oldDay) return true;

      return (
        day.label !== oldDay.label ||
        day.closed !== oldDay.closed ||
        day.open_time !== oldDay.open_time ||
        day.close_time !== oldDay.close_time
      );
    });
  };

  const updateSpecialDays = async () => {
    const specialDaysToSave = getChangedSpecialDays(
      specialDays,
      oldSpecialDays,
    );

    if (specialDaysToSave.length > 0) {
      const updated = await SpecialDaysApi.createSpecialDays({
        store_id: storeId,
        days: specialDaysToSave,
      });

      if (updated.status == "success") {
        setOldSpecialDays(specialDays.map((d) => ({ ...d })));
      }
    }
  };

  const hasNormalDayChanged = () => {
    const { createDays, updateDays } = splitCreateUpdate(days);

    const hasUpdatedSlot = updateDays.some(
      (d) => Array.isArray(d.slots) && d.slots.length > 0,
    );

    return createDays.length > 0 || hasUpdatedSlot;
  };
  const hasSpecialDayChanged = () => {
    const changed = getChangedSpecialDays(specialDays, oldSpecialDays);
    return changed.length > 0;
  };

  const hasChanges = hasNormalDayChanged() || hasSpecialDayChanged();
  // RENDER

  return (
    <div className="mt-8 space-y-6 rounded-2xl bg-white p-6 shadow-md">
      <BackButton onClick={goBack}>Back To Settings</BackButton>

      <h2 className="text-xl font-bold">
        Settings – <span className="text-primary">{storeName}</span>
      </h2>

      <div className="flex border-b border-gray-200">
        <Button
          onClick={() => setActiveTab("normal")}
          className={
            activeTab === "normal"
              ? "bg-primary font-semibold text-white"
              : "text-gray-500"
          }
        >
          Normal Days
        </Button>

        <Button
          onClick={() => setActiveTab("special")}
          className={
            activeTab === "special"
              ? "bg-primary font-semibold text-white"
              : "text-gray-500"
          }
        >
          Special Days
        </Button>
      </div>

      {/* KEEP BOTH TABS MOUNTED */}
      <div className="mt-4">
        <div className={activeTab === "normal" ? "block" : "hidden"}>
          <NormalDaysTab
            days={days}
            setDays={setDays}
            dayIndexMap={dayIndexMap}
            storeId={storeId}
          />
        </div>

        <div className={activeTab === "special" ? "block" : "hidden"}>
          <SpecialDaysTab
            specialDays={specialDays}
            setSpecialDays={setSpecialDays}
            storeId={storeId}
            setOldSpecialDays={setOldSpecialDays}
          />
        </div>
      </div>

      <div className="mt-6">
        <Button
          disabled={!hasChanges}
          onClick={saveAll}
          className="flex items-center gap-2 bg-green-600 px-5 py-2 text-white"
        >
          <FontAwesomeIcon icon={faSave} /> Save Change
        </Button>
      </div>
    </div>
  );
}
