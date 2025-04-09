import React, { useEffect, useState } from "react";
import { format, addMonths, subMonths, parse } from "date-fns";
import { FaChevronLeft, FaChevronRight, FaEdit, FaPen } from "react-icons/fa";
import { GrCheckboxSelected } from "react-icons/gr";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getMonthlySchedule } from "../redux/slices/scheduleSlice";
import { convertToLocalTime } from "../Utils/convertToLocalTime";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MonthlySchedule = ({ setRenderCalendar }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const dispatch = useDispatch();
  const { monthlySchedules, schedulesLoading, schedulesError } = useSelector(
    (state) => state.schedules,
  );

  // Navigate Months
  const handlePreviousMonth = () =>
    setCurrentDate((prev) => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentDate((prev) => addMonths(prev, 1));

  // Format month for filtering
  const selectedMonth = format(currentDate, "MMM, yyyy");

  useEffect(() => {
    dispatch(getMonthlySchedule(currentDate));
  }, [selectedMonth]);

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <button onClick={handlePreviousMonth} className="p-2">
            <FaChevronLeft
              className="cursor-pointer text-gray-600 hover:text-black"
              size={18}
            />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <button onClick={handleNextMonth} className="p-2">
            <FaChevronRight
              className="cursor-pointer text-gray-600 hover:text-black"
              size={18}
            />
          </button>
        </div>

        {/* View Mode Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => setRenderCalendar("Daily")}
            className="px-4 py-2 cursor-pointer bg-gray-200 hover:bg-gray-300 font-semibold rounded-xl"
          >
            Daily
          </button>
          <button
            onClick={() => setRenderCalendar("Weekly")}
            className="px-4 py-2 cursor-pointer bg-gray-200 hover:bg-gray-300 font-semibold rounded-xl"
          >
            Weekly
          </button>
          <button className="px-5 py-2 bg-[#3255F0] text-white font-semibold rounded-xl">
            Monthly
          </button>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="w-full border-white bg-white rounded-lg shadow-sm">
        <div
          className={`${
            monthlySchedules.length > 0
              ? "overflow-auto max-h-[65vh] custom-scrollbar"
              : ""
          }`}
        >
          {/* Header */}
          <div
            className="grid bg-gray-100 text-[#1869BB] font-semibold sticky top-0 z-10 border border-white"
            style={{
              gridTemplateColumns: "1fr 1fr 1.5fr 1.5fr 1fr 1fr 1fr",
            }}
          >
            <div className="p-2 border border-white">First Name</div>
            <div className="p-2 border border-white">Last Name</div>
            <div className="p-2 border border-white">Location</div>
            <div className="p-2 border border-white">Event</div>
            <div className="p-2 border border-white">Start Date</div>
            <div className="p-2 border border-white">End Date</div>
            <div className="p-2 border border-white text-center">Confirmed</div>
          </div>

          {/* Body */}
          {monthlySchedules.length > 0 ? (
            monthlySchedules.map((task, index) =>
              task.schedules.map((schedule, scheduleIndex) => {
                const start_date = new Date(schedule.start_date);
                const formattedStartDate = format(start_date, "d MMMM, yyyy");

                const end_date = new Date(schedule.end_date);
                const formattedEndDate = format(end_date, "d MMMM, yyyy");

                return (
                  <div
                    key={`${task.user_id}-${schedule.schedule_id}`} // Unique key for each schedule
                    className={`grid border border-white ${
                      index % 2 === 0 ? "bg-[#E8F1FD]" : "bg-white"
                    }`}
                    style={{
                      gridTemplateColumns: "1fr 1fr 1.5fr 1.5fr 1fr 1fr 1fr",
                    }}
                  >
                    {/* User First Name (Only shown for the first schedule of each user) */}
                    <div className="p-2 text-gray-700 border border-white">
                      {scheduleIndex === 0 ? task.first_name : ""}
                    </div>

                    {/* User Last Name (Only shown for the first schedule of each user) */}
                    <div className="p-2 text-gray-700 border border-white">
                      {scheduleIndex === 0 ? task.last_name : ""}
                    </div>

                    {/* Location Name from Locations Table */}
                    <div className="p-2 text-gray-700 border border-white">
                      {schedule.location}
                    </div>

                    {/* Event Name from Events Table */}
                    <div className="p-2 text-gray-700 border border-white">
                      {schedule.event_name}
                    </div>

                    {/* Start Date */}
                    <div className="p-2 text-gray-700 border border-white">
                      {formattedStartDate}{" "}
                      <p>{convertToLocalTime(schedule.start_time)}</p>
                    </div>

                    {/* End Date */}
                    <div className="p-2 text-gray-700 border border-white">
                      {formattedEndDate}
                      <p>{convertToLocalTime(schedule.end_time)}</p>
                    </div>

                    {/* Actions: Confirm Checkbox & Edit Button */}
                    <div className="p-2 font-semibold text-center border border-white flex items-center justify-center space-x-2">
                      {/* Custom Styled Checkbox */}
                      <label className="relative cursor-pointer">
                        <input
                          type="checkbox"
                          checked={true} // Update logic if needed
                          className="hidden peer"
                        />
                        <div className="w-6 h-6 rounded-md flex items-center justify-center">
                          {true && (
                            <GrCheckboxSelected
                              className="text-[#1869BB] rounded-md"
                              size={24}
                            />
                          )}
                        </div>
                      </label>

                      {/* Edit Button */}
                      <button className="p-2 border border-gray-300 bg-gray-100 hover:bg-gray-200 rounded-lg transition ml-2">
                        <FaPen className="text-[#1869BB]" />
                      </button>
                    </div>
                  </div>
                );
              }),
            )
          ) : (
            <div className="text-center flex items-center justify-center h-[58vh] p-4 text-gray-500">
              No events found for {selectedMonth}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlySchedule;
