import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchMetadata } from "../redux/slices/reportsSlice";
import CustomDropdown from "../Components/CustomDropdown";
import axios from "axios";
import { fetchEmployeeSchedulesByWeek } from "../redux/slices/employeeSlice";

const dummyWeeklyData = [
  {
    weekStart: new Date("2025-03-01"),
    weekEnd: new Date("2025-03-07"),
    hours_worked: 35,
    hours_over_40: 0,
  },
  {
    weekStart: new Date("2025-03-08"),
    weekEnd: new Date("2025-03-14"),
    hours_worked: 50,
    hours_over_40: 10,
  },
  {
    weekStart: new Date("2025-03-15"),
    weekEnd: new Date("2025-03-21"),
    hours_worked: 42,
    hours_over_40: 2,
  },
  {
    weekStart: new Date("2025-03-15"),
    weekEnd: new Date("2025-03-21"),
    hours_worked: 42,
    hours_over_40: 2,
  },
  {
    weekStart: new Date("2025-03-15"),
    weekEnd: new Date("2025-03-21"),
    hours_worked: 42,
    hours_over_40: 2,
  },
  {
    weekStart: new Date("2025-03-15"),
    weekEnd: new Date("2025-03-21"),
    hours_worked: 42,
    hours_over_40: 2,
  },
  {
    weekStart: new Date("2025-03-15"),
    weekEnd: new Date("2025-03-21"),
    hours_worked: 42,
    hours_over_40: 2,
  },
  {
    weekStart: new Date("2025-03-15"),
    weekEnd: new Date("2025-03-21"),
    hours_worked: 42,
    hours_over_40: 2,
  },
  {
    weekStart: new Date("2025-03-15"),
    weekEnd: new Date("2025-03-21"),
    hours_worked: 42,
    hours_over_40: 2,
  },
  {
    weekStart: new Date("2025-03-15"),
    weekEnd: new Date("2025-03-21"),
    hours_worked: 42,
    hours_over_40: 2,
  },
  {
    weekStart: new Date("2025-03-15"),
    weekEnd: new Date("2025-03-21"),
    hours_worked: 42,
    hours_over_40: 2,
  },
  {
    weekStart: new Date("2025-03-15"),
    weekEnd: new Date("2025-03-21"),
    hours_worked: 42,
    hours_over_40: 2,
  },
];

const EmployeeScheduleReport = () => {
  const [employeeName, setEmployeeName] = useState({});
  const [location, setLocation] = useState({});

  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [dateRange, setDateRange] = useState([startOfMonth, endOfMonth]);
  const [showCalendar, setShowCalendar] = useState(false);
  const dispatch = useDispatch();
  const { employees, locations, loading, error } = useSelector(
    (state) => state.report,
  );
  const { EmployeeSchedulesByWeek } = useSelector((state) => state.employees);

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  useEffect(() => {
    dispatch(fetchMetadata());
  }, []);

  useEffect(() => {
    if (employeeName.id && location.id && dateRange[0] && dateRange[1]) {
      dispatch(
        fetchEmployeeSchedulesByWeek({
          employee_id: employeeName.id,
          location_id: location.id,
          date_range: dateRange,
        }),
      );
    }
  }, [employeeName, location, dateRange[0], dateRange[1]]);

  return (
    <div className="">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <CustomDropdown
          label="Employee Name"
          options={employees}
          value={employeeName}
          onChange={(emp) => setEmployeeName(emp)}
          placeholder="Select Employee"
        />
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
        Report - Name: <span className="text-black">{employeeName.name}</span>,{" "}
        Location: <span className="text-black">{location.name}</span>, Dates:{" "}
        <span className="text-black">
          {" "}
          {formatDate(dateRange[0])} - {formatDate(dateRange[1])}
        </span>
      </div>

      {/* Weekly Table */}
      <div className="bg-white rounded-xl shadow p-2">
        <div className="grid grid-cols-3 font-semibold bg-gray-100 text-[#1869BB] p-2 rounded-md">
          <div>Week</div>
          <div>Hours Worked</div>
          <div>Hours Over 40</div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-auto max-h-[48vh] custom-scrollbar">
          {Object.keys(EmployeeSchedulesByWeek).length > 0 ? (
            Object.entries(EmployeeSchedulesByWeek).map(
              ([weekRange, info], index) => (
                <div
                  key={weekRange}
                  className={`grid grid-cols-3 p-2 ${
                    index % 2 === 0 ? "bg-white" : "bg-[rgba(24,105,187,0.05)]"
                  }`}
                >
                  <div>{weekRange}</div>
                  <div>{info.total_hours}</div>
                  <div>{Math.max(info.total_hours - 40, 0)}</div>
                </div>
              ),
            )
          ) : (
            <div className="text-center py-4 text-gray-500">
              No schedule data available for this range.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeScheduleReport;
