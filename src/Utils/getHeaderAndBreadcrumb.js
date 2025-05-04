// export const getHeaderAndBreadcrumb = (pathname) => {
//   const segments = pathname.split("/").filter(Boolean);

//   if (segments.length === 0) {
//     return { heading: "Dashboard", breadcrumb: "Home" };
//   }

//   // Capitalize each segment properly
//   const formattedSegments = segments.map((segment) =>
//     segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
//   );

//   return {
//     heading: formattedSegments.join(" - "), // "Reports - Employee Schedules"
//     breadcrumb: ["Home", ...formattedSegments].join(" / "), // "Home / Reports / Employee Schedules"
//   };
// };

export const getHeaderAndBreadcrumb = (pathname) => {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return { heading: "Dashboard", breadcrumb: "Home" };
  }

  // Remove numeric segments (like IDs)
  const filteredSegments = segments.filter((segment) => isNaN(segment));

  // Special handling: if "add" comes followed by a number, treat as "Edit"
  const formattedSegments = filteredSegments.map((segment, index) => {
    if (
      segment.toLowerCase() === "add" &&
      segments[index + 1] &&
      !isNaN(segments[index + 1])
    ) {
      return "Edit";
    }
    return segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  });

  return {
    heading: formattedSegments.join(" - "),
    breadcrumb: ["Home", ...formattedSegments].join(" / "),
  };
};
