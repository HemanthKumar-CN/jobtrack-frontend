import React, { useState, useEffect } from "react";
import { format, startOfWeek, addDays, isSameMonth } from "date-fns";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeeklySchedule } from "../redux/slices/scheduleSlice";
import { convertToLocalTime } from "../Utils/convertToLocalTime";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const WeeklySchedule = ({ setRenderCalendar }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 0 }),
  );

  const dispatch = useDispatch();
  const { weeklySchedules, schedulesLoading, schedulesError } = useSelector(
    (state) => state.schedules,
  );

  console.log(currentWeekStart, "]]]]]]", currentDate);

  useEffect(() => {
    console.log("calling this setcurrentWeekStart");
    // setCurrentWeekStart(startOfWeek(currentDate, { weekStartsOn: 0 }));
  }, [currentDate]);

  useEffect(() => {
    // Fetch weekly schedules
    dispatch(fetchWeeklySchedule(currentWeekStart));
  }, [currentWeekStart]);

  const handleNextWeek = () => {
    const nextWeekStart = addDays(currentWeekStart, 7);
    setCurrentWeekStart(nextWeekStart);
    if (!isSameMonth(nextWeekStart, currentDate)) {
      setCurrentDate(nextWeekStart);
    }
  };

  const handlePreviousWeek = () => {
    const previousWeekStart = addDays(currentWeekStart, -7);
    setCurrentWeekStart(previousWeekStart);
    if (!isSameMonth(previousWeekStart, currentDate)) {
      setCurrentDate(previousWeekStart);
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg ">
      {/* Navigation & View Mode Buttons in One Row */}
      <div className="flex justify-between items-center mb-4">
        {/* Left: Navigation */}
        <div className="flex items-center space-x-8">
          <button onClick={handlePreviousWeek} className="p-2">
            <FaChevronLeft
              className="cursor-pointer text-gray-600 hover:text-black"
              size={18}
            />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            {format(currentDate, "MMMM, yyyy")}
          </h2>
          <button onClick={handleNextWeek} className="p-2">
            <FaChevronRight
              className="cursor-pointer text-gray-600 hover:text-black"
              size={18}
            />
          </button>
        </div>

        {/* Right: View Mode Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => setRenderCalendar("Daily")}
            className="px-5 cursor-pointer py-2 bg-gray-200 font-semibold rounded-xl hover:bg-gray-300"
          >
            Daily
          </button>
          <button className="px-4 py-2 bg-[#3255F0] text-white font-semibold rounded-xl">
            Weekly
          </button>
          <button
            onClick={() => setRenderCalendar("Monthly")}
            className="px-4 cursor-pointer py-2 bg-gray-200 font-semibold hover:bg-gray-300 rounded-xl"
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full  border-white bg-white rounded-lg shadow-sm">
        {/* Scrollable Wrapper */}
        <div className="overflow-auto max-h-[65vh] h-[65vh] custom-scrollbar">
          {/* Header (Sticky) */}
          <div
            className="grid bg-gray-100 text-[#1869BB] font-semibold sticky top-0 z-10"
            style={{ gridTemplateColumns: "150px 150px repeat(7, 1fr)" }}
          >
            <div className="p-2 border border-white flex items-center">
              First Name
            </div>
            <div className="p-2 border border-white flex items-center">
              Last Name
            </div>
            {[...Array(7)].map((_, i) => {
              const day = addDays(currentWeekStart, i);
              return (
                <div key={i} className="p-2 border border-white text-center">
                  {/* {format(day, "EEE, dd")} */}
                  <div className="font-semibold">{format(day, "EEE")}</div>
                  <div className="text-sm">{format(day, "MMM dd")}</div>
                </div>
              );
            })}
          </div>

          {/* Body */}
          {weeklySchedules.map((employee, index) => (
            <div
              key={index}
              className={`grid border border-white ${
                index % 2 === 0
                  ? "bg-[rgba(24,105,187,0.1)]"
                  : "bg-[rgba(255,255,255,1)] text-black"
              }`}
              style={{ gridTemplateColumns: "150px 150px repeat(7, 1fr)" }}
            >
              <div className="p-2 text-[rgba(54, 53, 101, 1)]  border-gray-300">
                {employee.first_name}
              </div>
              <div className="p-2 text-[rgba(54, 53, 101, 1)] border-2 border-white">
                {employee.last_name}
              </div>
              {[...Array(7)].map((_, i) => {
                const day = addDays(currentWeekStart, i);
                const formattedDate = format(day, "yyyy-MM-dd");

                // Find if there is a schedule for this day
                const schedule = employee.schedules.find(
                  (sch) =>
                    formattedDate >= sch.start_date &&
                    formattedDate <= sch.end_date,
                );

                // Find all schedules for this day
                const allSchedules = employee.schedules.filter(
                  (sch) =>
                    formattedDate >= sch.start_date &&
                    formattedDate <= sch.end_date,
                );

                console.log(schedule, "scheduleeee..]]", allSchedules);
                return (
                  <div
                    key={i}
                    className={`p-2 font-semibold text-center border border-white ${
                      isSameMonth(day, currentDate) ? "" : ""
                      // "opacity-50 bg-gray-200"
                    }`}
                  >
                    {allSchedules.length > 0 ? (
                      <div className="flex flex-col items-center">
                        {allSchedules.map((sch, idx) => (
                          <div
                            key={idx}
                            className={`text-xs px-1 rounded-md mb-1 ${
                              index % 2 === 0
                                ? "bg-blue-200 text-black"
                                : "bg-gray-200 text-black"
                            }`}
                          >
                            {`${convertToLocalTime(
                              sch.start_time,
                            )} - ${convertToLocalTime(sch.end_time)}`}
                          </div>
                        ))}
                      </div>
                    ) : (
                      "---"
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklySchedule;
