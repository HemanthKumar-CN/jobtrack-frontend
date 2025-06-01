export const convertToISOTime = (baseDate, timeStr) => {
  const [hours, minutes] = timeStr.split(":");
  const date = new Date(baseDate);
  date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return date.toISOString();
};
