export const convertToLocalDateTime = (isoString) => {
  const date = new Date(isoString);

  // Get local date-time components
  const localDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
  const localTime = date.toTimeString().split(" ")[0]; // HH:MM:SS
  const milliseconds = date.getMilliseconds().toString().padEnd(3, "0"); // Milliseconds
  const timezoneOffset = new Intl.DateTimeFormat("en-US", {
    timeZoneName: "short",
  })
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName").value; // Get timezone

  return `${localDate} ${localTime} ${timezoneOffset}`;
};
