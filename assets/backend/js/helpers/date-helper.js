const DateHelper = {
  getToday: (offsetHours = 8) => {
    const now = new Date();

    const targetOffsetInMinutes = -offsetHours * 60;
    const localOffsetInMinutes = now.getTimezoneOffset();

    const diffToGMT8 = localOffsetInMinutes - targetOffsetInMinutes;
    const offsetDate = new Date(now.getTime() + diffToGMT8 * 60 * 1000);

    const year = offsetDate.getFullYear();
    const month = String(offsetDate.getMonth() + 1).padStart(2, "0");
    const day = String(offsetDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  },
  getDateWithOffset: (date, offsetHours = 8) => {
    if (!date) return null;

    const dt = new Date(date);
    const targetOffsetInMinutes = -offsetHours * 60;
    const localOffsetInMinutes = dt.getTimezoneOffset();
    const diffToTarget = localOffsetInMinutes - targetOffsetInMinutes;
    const offsetDate = new Date(dt.getTime() + diffToTarget * 60 * 1000);

    const year = offsetDate.getFullYear();
    const month = String(offsetDate.getMonth() + 1).padStart(2, "0");
    const day = String(offsetDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  },
  /**
   * Get current time in Singapore (HH:mm)
   * @returns {string} Time string in format "HH:mm"
   */
  getSingaporeTime() {
    const now = new Date();
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Singapore",
    };
    return new Intl.DateTimeFormat("en-GB", options).format(now);
  },

  /**
   * Convert time string "HH:mm" to total minutes
   * @param {*} timeStr
   * @returns {number}
   */
  timeToMinutes(timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  },

  isToday(date, offsetHours = 8) {
    const dateStr = DateTimeHelper.getDateWithOffset(date, offsetHours);
    const todayStr = DateTimeHelper.getToday(offsetHours);

    return dateStr == todayStr;
  },
  timeToDate(timeStr) {
    const [hour, minute, second] = timeStr.split(":");
    const d = new Date();
    d.setHours(hour, minute, second || 0, 0);
    return d;
  },
  formatTime(time) {
    return time.slice(0, 5);
  },
  addDaysToDate(date, days) {
    const base = new Date(date.getTime());
    base.setDate(base.getDate() + Number(days));

    return base;
  },
  convertTimeToDateTime(strTime = "") {
    const [hours, minutes, seconds] = strTime.split(":").map(Number);

    const now = new Date();
    now.setHours(hours, minutes, seconds || 0, 0);

    return now;
  },
  getISOWeek(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7); 
  },
  getWeekRange(date) {
    const d = new Date(date);
    const day = d.getDay() || 7; // Sunday = 7
    const start = new Date(d);
    start.setDate(d.getDate() - day + 1); // Monday
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6); // Sunday
    end.setHours(23, 59, 59, 999);

    return { start, end };
  },
};

export default DateHelper;
