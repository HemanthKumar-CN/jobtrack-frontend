import { Fragment, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  format,
  addWeeks,
  subWeeks,
  startOfWeek,
  addDays,
  isWithinInterval,
  parseISO,
  differenceInMinutes,
} from "date-fns";
import EmployeeScheduleModal from "./Modal/EmployeeScheduleModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployeeSchedules } from "../redux/slices/scheduleSlice";

const EmployeeCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);

  const dispatch = useDispatch();
  const { employeeSchedules, schedulesLoading, schedulesError } = useSelector(
    (state) => state.schedules,
  );

  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 }); // Start from Sunday
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    format(addDays(startDate, i), "EEE d"),
  );

  // Fetch schedules when component mounts or date changes
  useEffect(() => {
    dispatch(
      fetchEmployeeSchedules({
        employeeId: 9,
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(addDays(startDate, 6), "yyyy-MM-dd"),
      }),
    );
  }, [dispatch, currentDate]);

  return (
    <div className="max-w-7xl mx-auto mt-3 p-4 bg-white shadow-lg rounded-md">
      <div className="mb-4">
        <div className="flex items-center justify-between space-x-2">
          <div>
            <button
              onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
              className="p-2 cursor-pointer rounded-md"
            >
              <FaChevronLeft />
            </button>
            <span className="text-lg font-semibold mx-2">
              {format(currentDate, "MMMM yyyy")}
            </span>
            <button
              onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
              className="p-2 cursor-pointer rounded-md"
            >
              <FaChevronRight />
            </button>
          </div>
          <div>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="ml-4 px-4 py-2 cursor-pointer bg-[#3255F0]  text-white rounded-md"
            >
              Today
            </button>
          </div>
        </div>
      </div>

      <div
        className="grid border text-center border-gray-300"
        style={{
          gridTemplateColumns: "0.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
        }}
      >
        <div className="border border-gray-400 p-2 bg-gray-100"></div>
        {weekDays.map((day, index) => (
          <div
            key={index}
            className="border border-gray-400 p-2 text-center font-medium bg-gray-100"
          >
            {day}
          </div>
        ))}

        {[...Array(24)].map((_, hourIndex) => (
          <Fragment key={hourIndex}>
            <div className="border border-gray-400 p-2 text-sm text-gray-600 flex items-center">
              {hourIndex === 0
                ? "12 AM"
                : hourIndex < 12
                ? `${hourIndex} AM`
                : hourIndex === 12
                ? "12 PM"
                : `${hourIndex - 12} PM`}
            </div>

            {weekDays.map((_, dayIndex) => {
              const dayDate = addDays(startDate, dayIndex);
              const event = employeeSchedules.find(
                (e) =>
                  isWithinInterval(dayDate, {
                    start: parseISO(e.start_date),
                    end: parseISO(e.end_date),
                  }) && parseInt(e.start_time.split(":")[0]) === hourIndex,
              );
              const formattedDate = format(new Date(dayDate), "MMMM do yyyy");

              return (
                <div
                  key={dayIndex}
                  className="border border-gray-400 relative p-2 h-32"
                >
                  {event && (
                    <div
                      onClick={() => {
                        setSelectedEvent(event);
                        setFormattedDate(formattedDate);
                      }} // ✅ Directly on event box
                      className="absolute w-[90%] left-0 right-0 m-auto bg-blue-50 border-t-4 cursor-pointer border-blue-500 text-gray-800 text-sm p-2 rounded-md shadow-md flex flex-col h-full"
                      style={{
                        top: `${
                          (parseInt(event.start_time.split(":")[1]) / 60) * 100
                        }%`,
                        height: `${
                          (differenceInMinutes(
                            parseISO(
                              `${event.start_date}T${event.raw_end_time}`,
                            ),
                            parseISO(
                              `${event.start_date}T${event.raw_start_time}`,
                            ),
                          ) /
                            60) *
                          100
                        }%`,
                      }}
                    >
                      <span className="font-semibold text-xs text-gray-600 pointer-events-none">
                        {event.start_time} -{event.end_time}
                      </span>
                      <span className="text-sm font-medium pointer-events-none">
                        {event.title}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </Fragment>
        ))}

        {/* Modal */}
        {selectedEvent && (
          <EmployeeScheduleModal
            event={selectedEvent}
            formattedDate={formattedDate}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>
    </div>
  );
};

export default EmployeeCalendar;
