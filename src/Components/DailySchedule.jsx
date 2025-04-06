import React, { useEffect, useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchSchedule } from "../redux/slices/scheduleSlice";
import { convertToLocalTime } from "../Utils/convertToLocalTime";
const DailySchedule = ({ setRenderCalendar }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const dispatch = useDispatch();
  const { schedules, schedulesLoading, schedulesError } = useSelector(
    (state) => state.schedules,
  );

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    // Fetch schedule for the current date

    dispatch(fetchSchedule(format(currentDate, "yyyy-MM-dd")));
  }, [currentDate]);

  // Function to navigate to the previous day
  const handlePreviousDay = () => {
    setCurrentDate((prevDate) => subDays(prevDate, 1));
  };

  // Function to navigate to the next day
  const handleNextDay = () => {
    setCurrentDate((prevDate) => addDays(prevDate, 1));
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      {/* Navigation & View Mode Buttons */}
      <div className="flex justify-between items-center mb-4">
        {/* Left: Date Navigation */}
        <div className="flex items-center space-x-4">
          <button onClick={handlePreviousDay} className="p-2">
            <FaChevronLeft
              className="cursor-pointer text-gray-600 hover:text-black"
              size={18}
            />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            {format(currentDate, "MMMM dd, yyyy")}
          </h2>
          <button onClick={handleNextDay} className="p-2">
            <FaChevronRight
              className="cursor-pointer text-gray-600 hover:text-black"
              size={18}
            />
          </button>
        </div>

        {/* Right: View Mode Buttons */}
        <div className="flex space-x-2">
          <button className="px-5 py-2 bg-[#3255F0] text-white font-semibold rounded-xl">
            Daily
          </button>
          <button
            onClick={() => setRenderCalendar("Weekly")}
            className="px-4 py-2 cursor-pointer bg-gray-200 hover:bg-gray-300 font-semibold rounded-xl"
          >
            Weekly
          </button>
          <button
            onClick={() => setRenderCalendar("Monthly")}
            className="px-4 py-2 cursor-pointer bg-gray-200 font-semibold hover:bg-gray-300 rounded-xl"
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="w-full border-white bg-white rounded-lg shadow-sm">
        <div className="overflow-auto max-h-[65vh] h-[65vh] custom-scrollbar">
          {/* Header */}
          <div
            className="grid bg-gray-100 text-[#1869BB] font-semibold sticky top-0 z-10"
            style={{ gridTemplateColumns: "150px 150px 1fr" }}
          >
            <div className="p-2 border border-white flex items-center">
              First Name
            </div>
            <div className="p-2 border border-white flex items-center">
              Last Name
            </div>
            <div className="p-2 border border-white text-center">
              <div className="font-semibold">{format(currentDate, "EEEE")}</div>
              <div className="text-sm">{format(currentDate, "MMM dd")}</div>
            </div>
          </div>

          {/* Body */}
          {/* {employees.map((employee, index) => {
            const formattedDate = format(currentDate, "yyyy-MM-dd");
            return (
              <div
                key={index}
                className={`grid border border-white ${
                  index % 2 === 0
                    ? "bg-[rgba(24,105,187,0.1)]"
                    : "bg-white text-black"
                }`}
                style={{ gridTemplateColumns: "150px 150px 1fr" }}
              >
                <div className="p-2 text-[rgba(54, 53, 101, 1)] border-gray-300">
                  {employee.firstName}
                </div>
                <div className="p-2 text-[rgba(54, 53, 101, 1)] border-2 border-white">
                  {employee.lastName}
                </div>
                <div className="p-2 font-semibold text-center border border-white">
                  {shiftSchedule[formattedDate] || "---"}
                </div>
              </div>
            );
          })} */}

          {schedules?.map((employee, index) => {
            const formattedDate = format(currentDate, "yyyy-MM-dd");

            return (
              <div
                key={index}
                className={`grid border border-white ${
                  index % 2 === 0
                    ? "bg-[rgba(24,105,187,0.1)]"
                    : "bg-white text-black"
                }`}
                style={{ gridTemplateColumns: "150px 150px 1fr" }}
              >
                <div className="p-2 text-[rgba(54, 53, 101, 1)] border-gray-300">
                  {employee.first_name}
                </div>
                <div className="p-2 text-[rgba(54, 53, 101, 1)] border-2 border-white">
                  {employee.last_name}
                </div>

                <div className="p-2 font-semibold text-center border border-white">
                  {employee.schedules.length > 0 ? (
                    <div className="space-y-2">
                      {employee.schedules.map((schedule) => (
                        <div
                          key={schedule.schedule_id}
                          className="bg-blue-100 text-blue-900 p-2 rounded-md shadow"
                        >
                          <div className="text-xs text-gray-600">
                            {convertToLocalTime(schedule.start_time)} -{" "}
                            {convertToLocalTime(schedule.end_time)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-600">---</div>
                  )}
                </div>
              </div>
            );
          })}

          {schedules.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No schedules available for this date
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailySchedule;
