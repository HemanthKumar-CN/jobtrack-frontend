import { format, parseISO } from "date-fns";

export const convertToCalendarLocalTime = (date, time) => {
  if (!date || !time) return "";
  const utcDateTime = new Date(`${date}T${time}Z`); // Treat as UTC
  return format(utcDateTime, "h:mm a"); // Converts to local time
};
