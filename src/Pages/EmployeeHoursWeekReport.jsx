import React, { useEffect, useState } from "react";
import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaRegCalendarAlt,
} from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocationsList } from "../redux/slices/dropDownSlice";
import { fetchEmployeeHoursWeek } from "../redux/slices/employeeSlice";
import { truncateText } from "../Utils/truncateText";

const EmployeeHoursWeekReport = () => {
  const dispatch = useDispatch();
  const { locationsList, loading, error, contractors } = useSelector(
    (state) => state.dropDownList,
  );

  const { employeeHoursWeekData, employeeLoading, employeeError } = useSelector(
    (state) => state.employees,
  );

  useEffect(() => {
    dispatch(fetchLocationsList());
  }, [dispatch]);

  const [selectedWeek, setSelectedWeek] = useState(
    getSundayStartingWeek(new Date()),
  );
  const [selectedLocation, setSelectedLocation] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const locations = ["McCormick", "New York", "Los Angeles", "Chicago"];

  function getSundayStartingWeek(date) {
    const tempDate = new Date(date);
    tempDate.setDate(tempDate.getDate() - tempDate.getDay()); // Move to Sunday
    return tempDate;
  }

  function getWeekRange(date) {
    const startOfWeek = getSundayStartingWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    return {
      startOfWeek,
      endOfWeek,
    };
  }

  const { startOfWeek, endOfWeek } = getWeekRange(selectedWeek);

  useEffect(() => {
    if (startOfWeek && endOfWeek && selectedLocation?.id) {
      console.log(startOfWeek, endOfWeek, selectedLocation, "??????????");
      dispatch(
        fetchEmployeeHoursWeek({
          startOfWeek,
          endOfWeek,
          selectedLocation: selectedLocation.id,
        }),
      );
    }
  }, [selectedLocation, selectedWeek]);

  console.log(
    startOfWeek.toISOString(),
    endOfWeek.toISOString(),
    selectedLocation,
    "/.......>>>>",
  );

  return (
    <>
      <div className="flex items-center gap-4 py-4  justify-between">
        {/* Week Selector */}

        <div className="relative flex flex-col w-72 px-4 py-3 bg-white rounded-lg shadow-sm">
          <label className="text-xs text-gray-500">Select Week</label>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <span className="text-sm text-gray-600">
              {startOfWeek.toLocaleDateString()} -{" "}
              {endOfWeek.toLocaleDateString()}
            </span>
            <FaRegCalendarAlt className="text-gray-500" size={18} />
          </div>
          {showCalendar && (
            <div className="absolute top-full mt-2 z-10 bg-white p-2 rounded-lg shadow-lg">
              <Calendar
                onClickDay={(date) => {
                  setSelectedWeek(getSundayStartingWeek(date));
                  setShowCalendar(false);
                }}
                tileClassName={({ date }) => {
                  if (date >= startOfWeek && date <= endOfWeek) {
                    return "react-calendar__tile--highlight"; // Highlight full week
                  }
                  return null;
                }}
                locale="en-US"
                minDetail="month"
                showNeighboringMonth={false}
                selectRange={false}
              />
            </div>
          )}
        </div>

        {/* Location Dropdown */}
        <div className="relative w-1/2">
          <div
            className="flex items-center justify-between px-4 py-3 bg-white rounded-lg cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="flex flex-col">
              <label className="text-xs text-gray-500">Select Location</label>
              <span className="text-sm">{selectedLocation?.name}</span>
            </div>
            <FaChevronDown
              className={`text-gray-400 transform transition ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              size={18}
            />
          </div>
          {dropdownOpen && (
            <ul className="absolute w-full bg-white rounded-lg shadow-md mt-2 z-10">
              {locationsList.map((location) => (
                <li
                  key={location.id}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSelectedLocation(location);
                    setDropdownOpen(false);
                  }}
                >
                  {location.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="p-1 bg-white rounded-xl shadow-md">
        {/* Headers */}
        <div
          className="grid bg-gray-100 p-3 font-semibold text-[#1869BB] rounded-md"
          style={{ gridTemplateColumns: "60% 20% 20%" }}
        >
          <div>First/Last Name</div>
          <div>Total Hours Worked</div>
          <div>Total Hours Over 40</div>
        </div>

        {/* Event List */}
        <div className="mt-2 overflow-auto max-h-[60vh] h-[58vh] custom-scrollbar">
          {employeeHoursWeekData.length > 0 ? (
            employeeHoursWeekData?.map((employee, index) => {
              return (
                <div
                  key={index}
                  style={{ gridTemplateColumns: "60% 20% 20%" }}
                  className={`grid items-center rounded-md ${
                    index % 2 === 0 ? "bg-[rgba(24,105,187,0.1)]" : "bg-white"
                  }`}
                >
                  <div className="border border-white p-3 py-4.5">
                    {employee?.first_name} {employee?.last_name}
                  </div>
                  <div className="border border-white p-3 py-4.5">
                    {employee?.total_hours}
                  </div>
                  <div className="border border-white p-3 py-4.5">
                    {employee?.total_hours > 40
                      ? parseInt(employee?.total_hours - 40)
                      : "-"}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-gray-500">
              No data available for selected criteria
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmployeeHoursWeekReport;
