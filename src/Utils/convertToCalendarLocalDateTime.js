import { parseISO, differenceInMinutes } from "date-fns";

export const convertToCalendarLocalDateTime = (date, time) => {
  if (!date || !time) return null;
  return new Date(`${date}T${time}Z`); // Converts UTC to local automatically
};
