import { parse, format } from "date-fns";

export const convertToLocalTime = (timeString) => {
  // Parse the UTC time string (HH:mm:ss) into a Date object
  const utcDate = parse(timeString, "HH:mm:ss", new Date());

  // Convert it to the user's local time
  const localDate = new Date(
    utcDate.getTime() - utcDate.getTimezoneOffset() * 60000,
  );

  // Format it as 12-hour (hh:mm a) or 24-hour (HH:mm)
  return format(localDate, "hh:mm a"); // Use "HH:mm" for 24-hour format
};
