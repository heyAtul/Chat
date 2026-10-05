const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (value) => {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
};

export const isSameDay = (a, b) => startOfDay(a) === startOfDay(b);

// Time inside a message bubble, e.g. "3:45 pm".
export const formatMessageTime = (value) =>
  new Date(value)
    .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
    .toLowerCase();

// Date chip between days: TODAY, YESTERDAY, the weekday within the last week, else DD/MM/YYYY.
export const formatDayLabel = (value) => {
  const daysAgo = Math.round((startOfDay(Date.now()) - startOfDay(value)) / DAY_MS);
  if (daysAgo === 0) return "TODAY";
  if (daysAgo === 1) return "YESTERDAY";
  if (daysAgo < 7) return new Date(value).toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
  return new Date(value).toLocaleDateString("en-GB");
};
