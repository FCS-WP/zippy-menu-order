// Singapore is a fixed UTC+8 zone with no DST.
const SGT_OFFSET_MINUTES = 8 * 60;

const getSgtNow = () => {
  const now = new Date();
  return new Date(now.getTime() + (now.getTimezoneOffset() + SGT_OFFSET_MINUTES) * 60000);
};

const isSameSgtDay = (date) => {
  if (!date) return false;
  const sgtNow = getSgtNow();
  const target = new Date(date);
  return (
    sgtNow.getFullYear() === target.getFullYear() &&
    sgtNow.getMonth() === target.getMonth() &&
    sgtNow.getDate() === target.getDate()
  );
};

const parseSlotTimeToMinutes = (time) => {
  if (!time) return null;
  const [h, m] = String(time).split(":");
  const hh = parseInt(h, 10);
  const mm = parseInt(m, 10);
  if (isNaN(hh) || isNaN(mm)) return null;
  return hh * 60 + mm;
};

// A slot is in the past if its end time has already passed in SGT today.
// Returns false when the selected date isn't today (future dates are always valid).
export const isSlotInPast = (slot, selectedDate) => {
  if (!isSameSgtDay(selectedDate)) return false;
  const endMinutes = parseSlotTimeToMinutes(slot?.end_time);
  if (endMinutes === null) return false;
  const sgtNow = getSgtNow();
  const nowMinutes = sgtNow.getHours() * 60 + sgtNow.getMinutes();
  return endMinutes <= nowMinutes;
};

export const formatSlotLabel = (slot) => {
  const trim = (t) => (t ? String(t).slice(0, 5) : "");
  return `${trim(slot?.start_time)} - ${trim(slot?.end_time)}`;
};
