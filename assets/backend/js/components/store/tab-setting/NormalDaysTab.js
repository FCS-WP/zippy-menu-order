import React, { useEffect, useState } from "react";
import Button from "../../common/button/Button";
import HourRow from "../HourRow";
import OpenDaysSelector from "../OpenDaysSelector";
import SidebarSettings from "../SidebarSettings";
import ConfirmPopup from "../../popup/ConfirmPopup";
import { toast } from "react-toastify";
import { OperetionsApi, ProductSlotApi, StoreApi } from "../../../api";

export default function NormalDaysTab({
  days,
  setDays,
  storeId,
  dayIndexMap,
  productId,
}) {
  const [timeInterval, setTimeInterval] = useState(60);

  useEffect(() => {
    getStore();
  }, [storeId]);

  const getStore = async () => {
    if (!storeId) return;

    try {
      const res = await StoreApi.getStoreByID(storeId);
      if (res && res.data && res.data.duration) {
        setTimeInterval(res.data.duration);
      }
    } catch (error) {
      console.error("Failed to fetch store data:", error);
    }
  };

  //  COPY
  const [copyData, setCopyData] = useState({ dayIndex: null, slots: [] });

  //  DELETE SINGLE SLOT
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    dayIndex: null,
    slotIndex: null,
  });

  //  CONFIRM PASTE
  const [confirmPaste, setConfirmPaste] = useState({
    open: false,
    dayIndex: null,
    deletedSlotIds: [],
    newSlots: [],
  });

  //  HELPERS
  const parseTime = (t) => {
    if (!t) return null;
    const [h, m, s = 0] = t.split(":");
    return h * 3600 + m * 60 + s * 1;
  };

  const sortSlotsByTime = (hours) => {
    return [...hours].sort((a, b) => {
      if (!a.open) return 1;
      if (!b.open) return -1;
      return parseTime(a.open) - parseTime(b.open);
    });
  };

  const isOverlap = (hours, slotIndex, start, end) => {
    const s1 = parseTime(start);
    const e1 = parseTime(end);
    if (s1 === null || e1 === null) return false;
    if (s1 >= e1) return true;

    return hours.some((sl, i) => {
      if (i === slotIndex) return false;
      const s2 = parseTime(sl.open);
      const e2 = parseTime(sl.close);
      if (s2 === null || e2 === null) return false;
      return s1 < e2 && s2 < e1;
    });
  };

  //  DAY OPEN / CLOSE
  const toggleDayOpen = (dayIndex, isOpen) => {
    setDays((prevDays) =>
      prevDays.map((day) =>
        day.dayIndex === dayIndex
          ? {
              ...day,
              is_open: isOpen,
              hours: day.hours.length
                ? day.hours
                : [{ slot_id: null, open: null, close: null }],
            }
          : day,
      ),
    );
  };

  //  ADD / REMOVE SLOT
  const addHourSlot = (dayIndex) => {
    setDays((prev) =>
      prev.map((d) =>
        d.dayIndex === dayIndex
          ? {
              ...d,
              hours: [...d.hours, { slot_id: null, open: null, close: null }],
            }
          : d,
      ),
    );
  };

  const removeHourSlot = (dayIndex, slotIndex) => {
    const targetDay = days.find((d) => d.dayIndex === dayIndex);
    if (!targetDay) return;

    const slot = targetDay.hours[slotIndex];
    if (slot.slot_id || slot.open || slot.close) {
      setConfirmDelete({ open: true, dayIndex, slotIndex });
      return;
    }

    forceRemoveSlot(dayIndex, slotIndex);
  };

  const forceRemoveSlot = (dayIndex, slotIndex) => {
    setDays((prev) =>
      prev.map((d) =>
        d.dayIndex === dayIndex
          ? { ...d, hours: d.hours.filter((_, i) => i !== slotIndex) }
          : d,
      ),
    );
  };

  //  UPDATE SLOT
  const updateHourSlot = (dayIndex, slotIndex, field, value) => {
    const updated = days.map((day) => {
      if (day.dayIndex !== dayIndex) return day;

      const updatedHours = day.hours.map((hour, idx) =>
        idx === slotIndex ? { ...hour, [field]: value } : hour,
      );

      return { ...day, hours: sortSlotsByTime(updatedHours) };
    });

    const targetDay = updated.find((d) => d.dayIndex === dayIndex);
    const slot = targetDay?.hours[slotIndex];
    const currentIndex = targetDay.hours.findIndex((h) => h === slot);

    if (isOverlap(targetDay.hours, currentIndex, slot.open, slot.close)) {
      toast.error("Invalid or overlapping time!");
      return;
    }

    setDays(updated);
  };

  //  COPY / PASTE
  const startCopySlot = (dayIndex) => {
    const targetDay = days.find((d) => d.dayIndex === dayIndex);
    if (!targetDay) return;

    setCopyData({
      dayIndex,
      slots: targetDay.hours.map((h) => ({ ...h })),
    });
  };

  const applyPaste = (dayIndex, newSlots) => {
    setDays((prev) =>
      prev.map((day) =>
        day.dayIndex === dayIndex
          ? { ...day, hours: newSlots, isDirty: true }
          : day,
      ),
    );
  };

  const pasteSlot = (dayIndex) => {
    if (copyData.dayIndex === null) return;

    const targetDay = days.find((d) => d.dayIndex === dayIndex);
    if (!targetDay) return;

    const sourceSlots = copyData.slots;
    const targetSlots = targetDay.hours;

    const newSlots = sourceSlots.map((src, i) => {
      const target = targetSlots[i];
      if (target?.slot_id) {
        return { ...target, open: src.open, close: src.close };
      }
      return {
        slot_id: null,
        open: src.open,
        close: src.close,
        original_open: null,
        original_close: null,
      };
    });

    const deletedSlotIds = targetSlots
      .slice(sourceSlots.length)
      .filter((s) => s.slot_id)
      .map((s) => s.slot_id);

    if (deletedSlotIds.length > 0) {
      setConfirmPaste({
        open: true,
        dayIndex,
        deletedSlotIds,
        newSlots,
      });
      return;
    }

    applyPaste(dayIndex, newSlots);
  };

  //  RENDER
  return (
    <>
      <div className="flex">
        <div className="flex-1 space-y-2 border-r pr-4">
          <OpenDaysSelector days={days} toggleDayOpen={toggleDayOpen} />

          {days.map((day) => {
            const mappedIndex = dayIndexMap[day.day];

            return (
              <div key={day.day} className="flex items-start py-1">
                <div className="w-48 pt-2">
                  <h3 className="text-sm font-semibold">{day.day}</h3>
                </div>

                <div className="flex flex-grow flex-col">
                  {day.hours.map((slot, slotIndex) => (
                    <HourRow
                      key={slotIndex}
                      slot={slot}
                      slotIndex={slotIndex}
                      dayIndex={mappedIndex}
                      disabled={!day.is_open}
                      updateHourSlot={updateHourSlot}
                      removeHourSlot={removeHourSlot}
                      timeInterval={timeInterval}
                      onCopy={() => startCopySlot(mappedIndex)}
                      onPaste={() => pasteSlot(mappedIndex)}
                      isCopyActive={copyData.dayIndex === mappedIndex}
                      showPaste={
                        slotIndex === 0 &&
                        copyData.dayIndex !== null &&
                        mappedIndex !== copyData.dayIndex
                      }
                    />
                  ))}

                  <Button
                    className={`flex items-center justify-start gap-1 bg-transparent p-0 text-sm ${
                      !day.is_open
                        ? "cursor-not-allowed text-gray-400"
                        : "text-green-600"
                    }`}
                    size="sm"
                    onClick={() => addHourSlot(mappedIndex)}
                    disabled={!day.is_open}
                  >
                    + Add hours
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="ml-8 w-96 pt-2">
          <SidebarSettings
            timeInterval={timeInterval}
            setTimeInterval={setTimeInterval}
          />
        </div>
      </div>

      {/* ===== CONFIRM DELETE SINGLE SLOT ===== */}
      <ConfirmPopup
        isOpen={confirmDelete.open}
        title="Delete Time Slot"
        message="Are you sure you want to delete this time slot?"
        confirmText="Delete"
        onClose={() =>
          setConfirmDelete({ open: false, dayIndex: null, slotIndex: null })
        }
        onConfirm={async () => {
          const { dayIndex, slotIndex } = confirmDelete;
          const targetDay = days.find((d) => d.dayIndex === dayIndex);
          const slot = targetDay.hours[slotIndex];
          const dayNumber = targetDay.dayIndex;

          try {
            if (slot.slot_id && storeId) {
              await OperetionsApi.deleteOperation({
                store_id: storeId,
                day: dayNumber,
                id: slot.slot_id,
              });
            }

            if (slot.slot_id && productId) {
              await ProductSlotApi.deleteProductSlot({ id: slot.slot_id });
            }

            forceRemoveSlot(dayIndex, slotIndex);
            toast.success("Deleted successfully!");
          } catch {
            toast.error("Delete failed");
          }

          setConfirmDelete({ open: false, dayIndex: null, slotIndex: null });
        }}
      />

      {/* ===== CONFIRM PASTE OVERWRITE ===== */}
      <ConfirmPopup
        isOpen={confirmPaste.open}
        title="Overwrite time slots"
        message="Pasting will delete existing time slots. Are you sure you want to continue?"
        confirmText="Overwrite"
        onClose={() =>
          setConfirmPaste({
            open: false,
            dayIndex: null,
            deletedSlotIds: [],
            newSlots: [],
          })
        }
        onConfirm={async () => {
          const { dayIndex, deletedSlotIds, newSlots } = confirmPaste;

          try {
            if (storeId && deletedSlotIds.length > 0) {
              await Promise.all(
                deletedSlotIds.map((id) =>
                  OperetionsApi.deleteOperation({
                    store_id: storeId,
                    day: dayIndex,
                    id: id,
                  }),
                ),
              );
            }

            applyPaste(dayIndex, newSlots);
            toast.success("Time slots overwritten successfully");
          } catch {
            toast.error("Failed to overwrite time slots");
          }

          setConfirmPaste({
            open: false,
            dayIndex: null,
            deletedSlotIds: [],
            newSlots: [],
          });
        }}
      />
    </>
  );
}
