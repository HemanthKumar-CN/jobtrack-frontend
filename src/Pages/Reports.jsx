import React from "react";
import { Link } from "react-router-dom";

const Reports = () => {
  const reportsData = [
    {
      title: "Employee Schedules",
      color: "red-200",
      link: "/reports/employee-schedules",
    },
    {
      title: "Location Schedules",
      color: "blue-200",
      link: "/reports/location-schedules",
    },
    // {
    //   title: "Contractor Schedules",
    //   color: "green-200",
    //   link: "/contractor-schedules",
    // },
    // {
    //   title: "Total Employee Hours (day)",
    //   color: "purple-200",
    //   link: "/reports/employee-hours-day",
    // },
    {
      title: "Total Employee Hours (week)",
      color: "yellow-200",
      link: "/reports/employee-hours-week",
    },
  ];

  return (
    <div className="min-h-[60vh] p-6 rounded-lg flex-grow">
      <div className="grid grid-cols-3 gap-4">
        {reportsData.map((item, index) => (
          <div
            key={index}
            className="relative bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <div
              className={`absolute top-0 right-0 w-10 h-10 bg-${item.color} rounded-bl-full`}
            ></div>
            <Link
              to={item.link}
              className="text-lg font-medium text-gray-800 hover:underline"
            >
              {item.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
