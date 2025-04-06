export const getHeaderAndBreadcrumb = (pathname) => {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return { heading: "Dashboard", breadcrumb: "Home" };
  }

  // Capitalize each segment properly
  const formattedSegments = segments.map((segment) =>
    segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
  );

  return {
    heading: formattedSegments.join(" - "), // "Reports - Employee Schedules"
    breadcrumb: ["Home", ...formattedSegments].join(" / "), // "Home / Reports / Employee Schedules"
  };
};
