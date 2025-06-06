import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { fetchMetadata } from "../redux/slices/reportsSlice";
import { useDispatch, useSelector } from "react-redux";
import CustomDropdown from "../Components/CustomDropdown";
import axios from "axios";
import { getLocationEmployeeWeeklyHours } from "../redux/slices/employeeSlice";

const dummyLocationData = [
  {
    location: "McCormick Place",
    employee: "Jon Smith",
    date: "2025-03-01",
    start: "09:00 AM",
    end: "05:00 PM",
    totalHours: 8,
  },
  {
    location: "McCormick Place",
    employee: "Jane Doe",
    date: "2025-03-02",
    start: "10:00 AM",
    end: "06:00 PM",
    totalHours: 8,
  },
  {
    location: "New York",
    employee: "Emily Davis",
    date: "2025-03-03",
    start: "08:00 AM",
    end: "04:00 PM",
    totalHours: 8,
  },
];

const LocationScheduleReport = () => {
  const [location, setLocation] = useState({});
  const [dateRange, setDateRange] = useState([
    new Date("2025-03-01"),
    new Date("2025-03-31"),
  ]);
  const [showCalendar, setShowCalendar] = useState(false);
  const dispatch = useDispatch();
  const { employees, locations, loading, error } = useSelector(
    (state) => state.report,
  );

  const { EmployeeLocationSchedulesByWeek } = useSelector(
    (state) => state.employees,
  );

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const filteredData = dummyLocationData.filter(
    (row) =>
      row.location === location &&
      new Date(row.date) >= dateRange[0] &&
      new Date(row.date) <= dateRange[1],
  );

  useEffect(() => {
    dispatch(fetchMetadata());
  }, []);

  useEffect(() => {
    if (location.id && dateRange[0] && dateRange[1]) {
      // Fetch data based on selected location and date range
      dispatch(
        getLocationEmployeeWeeklyHours({
          location_id: location.id,
          date_range: dateRange,
        }),
      );
    }
  }, [location, dateRange]);

  return (
    <div>
      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {/* <div className="bg-white rounded-xl shadow p-4">
          <label className="text-sm text-gray-500">Location</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-300 cursor-pointer rounded-md px-3 py-2 mt-1"
          >
            <option>McCormick Place</option>
            <option>New York</option>
            <option>Chicago</option>
          </select>
        </div> */}

        <CustomDropdown
          label="Location"
          options={locations}
          value={location}
          onChange={(em) => setLocation(em)}
          placeholder="Select Location"
        />

        <div className="relative bg-white rounded-xl shadow p-4">
          <label className="text-sm text-gray-500">Date Range</label>
          <div
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex border-gray-300 items-center justify-between border rounded-md px-3 py-2 mt-1 cursor-pointer"
          >
            <span>
              {formatDate(dateRange[0])} - {formatDate(dateRange[1])}
            </span>
            <FaRegCalendarAlt />
          </div>
          {showCalendar && (
            <div className="absolute z-10 mt-2">
              <Calendar
                selectRange
                value={dateRange}
                onChange={(range) => {
                  setDateRange(range);
                  setShowCalendar(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="text-lg font-semibold text-blue-800 mb-4 text-center">
        Location Schedule - {location.name} ({formatDate(dateRange[0])} -{" "}
        {formatDate(dateRange[1])})
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-xl shadow p-2">
        <div className="grid grid-cols-3 font-semibold bg-gray-100 text-[#1869BB] p-2 rounded-md">
          <div>Week</div>
          <div>Employee</div>
          <div>Total Hours</div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-auto max-h-[48vh] custom-scrollbar">
          {Object.entries(EmployeeLocationSchedulesByWeek).map(
            ([week, employees], weekIndex) => (
              <React.Fragment key={weekIndex}>
                {employees.map((employee, empIndex) => (
                  <div
                    key={`${weekIndex}-${empIndex}`}
                    className={`grid grid-cols-3 p-2 ${
                      (weekIndex + empIndex) % 2 === 0
                        ? "bg-white"
                        : "bg-[rgba(24,105,187,0.05)]"
                    }`}
                  >
                    <div className="font-semibold">
                      {empIndex === 0 ? week : ""}
                    </div>{" "}
                    {/* only show week for first employee */}
                    <div>{employee.employee_name}</div>
                    <div>{employee.total_hours}</div>
                  </div>
                ))}
              </React.Fragment>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationScheduleReport;
