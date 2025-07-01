import React, { useState } from "react";
import { FaPlus, FaTrash, FaCalendarAlt } from "react-icons/fa";
import Flatpickr from "react-flatpickr";

const weekdayOptions = ["M", "T", "W", "Th", "F", "Sa", "Su"];

const RecurringTimeRow = ({ item, index, onChange, onDelete }) => {
  const toggleDay = (day) => {
    const updatedDays = item.days.includes(day)
      ? item.days.filter((d) => d !== day)
      : [...item.days, day];
    onChange(index, "days", updatedDays);
  };

  return (
    <tr className="text-sm text-gray-700">
      {/* Weekday Pills */}
      <td className="px-3 py-2 border border-gray-200">
        <div className="flex flex-wrap gap-1">
          {weekdayOptions.map((day) => (
            <button
              type="button"
              key={day}
              onClick={() => toggleDay(day)}
              className={`px-2 py-1 rounded-md cursor-pointer border ${
                item.days.includes(day)
                  ? "bg-[#E0F4FA] text-[#008CC8]"
                  : "bg-white text-gray-700"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </td>

      {/* Start Date */}
      <td className="px-3 py-2 border border-gray-200">
        <Flatpickr
          value={item.startDate}
          options={{ dateFormat: "Y-m-d" }}
          onChange={([date]) => onChange(index, "startDate", date)}
          className="w-full outline-none bg-transparent border border-gray-400 cursor-pointer rounded-lg py-1.5 text-center"
        />
      </td>

      {/* Start Time */}
      <td className="px-3 py-2 border border-gray-200">
        <Flatpickr
          value={item.startTime}
          options={{ enableTime: true, noCalendar: true, dateFormat: "H:i" }}
          onChange={([time]) => onChange(index, "startTime", time)}
          className="w-full outline-none bg-transparent border border-gray-400 cursor-pointer rounded-lg py-1.5 text-center"
        />
      </td>

      {/* End Date */}
      <td className="px-3 py-2 border border-gray-200">
        <Flatpickr
          value={item.endDate}
          options={{ dateFormat: "Y-m-d" }}
          onChange={([date]) => onChange(index, "endDate", date)}
          className="w-full outline-none bg-transparent border border-gray-400 cursor-pointer rounded-lg py-1.5 text-center"
        />
      </td>

      {/* End Time */}
      <td className="px-3 py-2 border border-gray-200">
        <Flatpickr
          value={item.endTime}
          options={{ enableTime: true, noCalendar: true, dateFormat: "H:i" }}
          onChange={([time]) => onChange(index, "endTime", time)}
          className="w-full outline-none bg-transparent border border-gray-400 cursor-pointer rounded-lg py-1.5 text-center"
        />
      </td>

      {/* Delete */}
      <td className="px-3 py-2 border border-gray-200 text-center">
        <button
          type="button"
          className="text-red-500 hover:text-red-700 cursor-pointer"
          onClick={() => onDelete(index)}
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );
};

const TimeOffRow = ({ item, index, onChange, onDelete }) => {
  return (
    <tr className="text-sm text-gray-700">
      <td className="px-3 py-2 border">
        <input
          type="text"
          name="name"
          value={item.name}
          onChange={(e) => onChange(index, "name", e.target.value)}
          className="w-full outline-none bg-transparent border border-gray-400 cursor-pointer rounded-lg py-1.5 text-center"
        />
      </td>
      <td className="px-3 py-2 border">
        <Flatpickr
          value={item.startDate}
          options={{ dateFormat: "Y-m-d" }}
          onChange={([date]) => onChange(index, "startDate", date)}
          className="w-full outline-none bg-transparent border border-gray-400 cursor-pointer rounded-lg py-1.5 text-center"
        />
      </td>
      <td className="px-3 py-2 border">
        <Flatpickr
          value={item.startTime}
          options={{ enableTime: true, noCalendar: true, dateFormat: "H:i" }}
          onChange={([time]) => onChange(index, "startTime", time)}
          className="w-full outline-none bg-transparent border border-gray-400 cursor-pointer rounded-lg py-1.5 text-center"
        />
      </td>
      <td className="px-3 py-2 border">
        <Flatpickr
          value={item.endDate}
          options={{ dateFormat: "Y-m-d" }}
          onChange={([date]) => onChange(index, "endDate", date)}
          className="w-full outline-none bg-transparent border border-gray-400 cursor-pointer rounded-lg py-1.5 text-center"
        />
      </td>
      <td className="px-3 py-2 border">
        <Flatpickr
          value={item.endTime}
          options={{ enableTime: true, noCalendar: true, dateFormat: "H:i" }}
          onChange={([time]) => onChange(index, "endTime", time)}
          className="w-full outline-none bg-transparent border border-gray-400 cursor-pointer rounded-lg py-1.5 text-center"
        />
      </td>
      <td className="px-3 py-2 border text-center">
        <button
          type="button"
          className="text-red-500 hover:text-red-700 cursor-pointer"
          onClick={() => onDelete(index)}
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );
};

const RecurringBlockedTimeAndTimeOff = ({
  recurringTimes,
  setRecurringTimes,
  timeOffs,
  setTimeOffs,
}) => {
  const handleRecurringChange = (index, field, value) => {
    const updated = [...recurringTimes];
    updated[index][field] = value;
    setRecurringTimes(updated);
  };

  const handleTimeOffChange = (index, field, value) => {
    const updated = [...timeOffs];
    updated[index][field] = value;
    setTimeOffs(updated);
  };

  const addRecurringRow = () => {
    setRecurringTimes([
      ...recurringTimes,
      { days: "", startDate: "", startTime: "", endDate: "", endTime: "" },
    ]);
  };

  const addTimeOffRow = () => {
    setTimeOffs([
      ...timeOffs,
      { name: "", startDate: "", startTime: "", endDate: "", endTime: "" },
    ]);
  };

  const deleteRecurringRow = (index) => {
    const updated = recurringTimes.filter((_, i) => i !== index);
    setRecurringTimes(updated);
  };

  const deleteTimeOffRow = (index) => {
    const updated = timeOffs.filter((_, i) => i !== index);
    setTimeOffs(updated);
  };

  return (
    <div className="space-y-10">
      {/* Recurring Blocked Time */}
      <div className="bg-white px-5 py-5 rounded-xl shadow mt-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-800">
            Recurring Blocked Time
          </h3>
          <button
            type="button"
            onClick={addRecurringRow}
            className="text-sm px-3 py-1 bg-[#E0F4FA] text-[#008CC8] rounded-md flex items-center gap-1"
          >
            <FaPlus /> Add Recurring Blocked Time
          </button>
        </div>

        <div className=" border-gray-200 rounded-lg bg-gray-100 p-3">
          <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-3 py-2 border border-gray-200 rounded-tl-lg">
                    Days <span className="text-red-600">*</span>
                  </th>
                  <th className="px-3 py-2 border border-gray-200">
                    Start Date <span className="text-red-600">*</span>
                  </th>
                  <th className="px-3 py-2 border border-gray-200">
                    Start Time <span className="text-red-600">*</span>
                  </th>
                  <th className="px-3 py-2 border border-gray-200">
                    End Date <span className="text-red-600">*</span>
                  </th>
                  <th className="px-3 py-2 border border-gray-200">
                    End Time <span className="text-red-600">*</span>
                  </th>
                  <th className="px-3 py-2 border border-gray-200 rounded-tr-lg">
                    Edit
                  </th>
                </tr>
              </thead>
              <tbody>
                {recurringTimes.map((item, i) => (
                  <RecurringTimeRow
                    key={i}
                    item={item}
                    index={i}
                    isLast={i === recurringTimes.length - 1}
                    onChange={handleRecurringChange}
                    onDelete={deleteRecurringRow}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Time Off */}
      <div className="bg-white px-5 py-5 rounded-xl shadow mt-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-800">Time Off</h3>
          <button
            type="button"
            onClick={addTimeOffRow}
            className="text-sm px-3 py-1 bg-[#E0F4FA] text-[#008CC8] rounded-md flex items-center gap-1"
          >
            <FaPlus /> Add Time Off
          </button>
        </div>

        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 border">
                Name <span className="text-red-600">*</span>
              </th>
              <th className="px-3 py-2 border">
                Start Date <span className="text-red-600">*</span>
              </th>
              <th className="px-3 py-2 border">
                Start Time <span className="text-red-600">*</span>
              </th>
              <th className="px-3 py-2 border">
                End Date <span className="text-red-600">*</span>
              </th>
              <th className="px-3 py-2 border">
                End Time <span className="text-red-600">*</span>
              </th>
              <th className="px-3 py-2 border">Edit</th>
            </tr>
          </thead>
          <tbody>
            {timeOffs.map((item, i) => (
              <TimeOffRow
                key={i}
                item={item}
                index={i}
                onChange={handleTimeOffChange}
                onDelete={deleteTimeOffRow}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecurringBlockedTimeAndTimeOff;
