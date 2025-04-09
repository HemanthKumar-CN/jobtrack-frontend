import React, { useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaChevronDown,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchEmployeesDropdown,
  fetchLocationsList,
} from "../redux/slices/dropDownSlice";
import { fetchEvents } from "../redux/slices/eventSlice";
import EmployeeMultiSelect from "../Components/EmployeeMultiSelect";
import {
  clearSchedule,
  createBulkSchedule,
} from "../redux/slices/scheduleSlice";
import SuccessCard from "../Components/SuccessCard";
import { formatDateTimeLocal } from "../Utils/formatDateTimeLocal";

const AddTask = () => {
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const locationRef = useRef(null);
  const eventRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { locationsList, employees } = useSelector(
    (state) => state.dropDownList,
  );
  const { events } = useSelector((state) => state.events);
  const { newSchedule } = useSelector((state) => state.schedules);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  const [location, setLocation] = useState("");
  const [taskEvent, setTaskEvent] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [scheduleFields, setScheduleFields] = useState(null);

  useEffect(() => {
    dispatch(fetchLocationsList());
    dispatch(fetchEvents());
    dispatch(fetchEmployeesDropdown());
  }, [dispatch]);

  useEffect(() => {
    if (events) {
      console.log("Events", events);

      const selectedEvent = events.find((event) => {
        return event.id == taskEvent;
      });

      if (selectedEvent) {
        const formattedMinDate = formatDateTimeLocal(selectedEvent.start_date);

        const formattedMaxDate = formatDateTimeLocal(selectedEvent.end_date);

        setMinDate(formattedMinDate);
        setMaxDate(formattedMaxDate);
      }
    }
  }, [events, taskEvent]);

  useEffect(() => {
    console.log(newSchedule, "New Schedule ======");
    if (newSchedule?.scheduledData) {
      const newScheduleFields = [
        {
          label: "Start Date",
          value: newSchedule?.scheduledData?.startDate,
          type: "text",
        },

        {
          label: "End Date",
          value: newSchedule?.scheduledData?.endDate,
          type: "text",
        },
        {
          label: "Start Time",
          value: newSchedule?.scheduledData?.startTime,
          type: "text",
        },

        {
          label: "End Time",
          value: newSchedule?.scheduledData?.endTime,
          type: "text",
        },

        {
          label: "Location",
          value: `${newSchedule?.scheduledData.location.name}, ${newSchedule?.scheduledData.location.address1}, ${newSchedule?.scheduledData.location.address2}, ${newSchedule?.scheduledData.location.city}, ${newSchedule?.scheduledData.location.state} ${newSchedule?.scheduledData.location.postal_code}`,
          type: "text",
        },

        {
          label: "Event",
          value: newSchedule?.scheduledData.eventName,
          type: "text",
        },

        {
          label: "Title",
          value: {
            title: newSchedule?.scheduledData.title,
            description: newSchedule?.scheduledData.description,
          },
          type: "text-block",
        },
        {
          label: "Assigned to",
          value: newSchedule?.scheduledData.employees,
          type: "avatar",
        },
      ];

      setScheduleFields(newScheduleFields);
    }
  }, [newSchedule]);

  const handleAddNewTask = () => {
    console.log("Task Details", {
      startDate,
      endDate,
      startTime,
      endTime,
      taskEvent,
      title,
      description,
      selectedEmployees,
    });

    const newScheduleData = {
      startDate,
      endDate,
      taskEvent,
      title,
      description,
      selectedEmployees,
    };

    dispatch(createBulkSchedule(newScheduleData));
  };

  console.log(scheduleFields, "?????Fields...");

  const handleBackToSchedules = () => {
    navigate("/schedules");
    dispatch(clearSchedule());
  };

  if (newSchedule) {
    return (
      <>
        <SuccessCard
          title="Schedule Created"
          fields={scheduleFields}
          modalData={newSchedule}
          onBack={handleBackToSchedules}
          backButton={"Back to Schedules"}
        />
      </>
    );
  } else {
    return (
      <div className="flex justify-center items-center bg-[#F4F7FE] relative">
        <div className="bg-white p-8 pb-2 rounded-2xl shadow-lg w-[50vw] ">
          {/* Header */}
          <h2 className="text-2xl font-semibold text-center text-[#1E1E1E]">
            Schedule a Task
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Enter the task details below
          </p>

          {/* Add Employees Field */}

          <div className="overflow-auto max-h-[50vh] custom-scrollbar">
            <EmployeeMultiSelect
              employees={employees}
              onChange={setSelectedEmployees}
            />

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-4 mt-6 ">
              {/* Select Location */}

              {/* <div
                className="bg-[#F4F7FE] p-2 rounded-md cursor-pointer"
                onClick={() => locationRef.current?.click()}
              >
                <p className="text-gray-500 text-sm ml-0.5">Location</p>
                <select
                  ref={locationRef}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent outline-none text-gray-700 mt-1 cursor-pointer text-sm"
                >
                  <option className="text-gray-500 font-extralight">
                    Select Location
                  </option>
  
                  {locationsList.map((location) => {
                    return (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    );
                  })}
                </select>
              </div> */}

              {/* Select Event */}
              <div
                className="bg-[#F4F7FE] p-2 rounded-md cursor-pointer"
                onClick={() => eventRef.current?.click()}
              >
                <p className="text-gray-500 text-sm ml-0.5">Event</p>
                <select
                  ref={eventRef}
                  value={taskEvent}
                  onChange={(e) => setTaskEvent(e.target.value)}
                  className="w-full bg-transparent outline-none text-gray-700 mt-1 cursor-pointer text-sm"
                >
                  <option className="text-gray-500 font-extralight">
                    Select Event
                  </option>

                  {events.map((event) => {
                    return (
                      <option key={event.id} value={event.id}>
                        {event.event_name}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Start Date */}
              <div
                className="bg-[#F4F7FE] p-3 rounded-md relative cursor-pointer"
                onClick={() => startDateRef.current?.showPicker()}
              >
                <p className="text-gray-500 text-sm">Start Date</p>
                <div className="relative mt-1 flex items-center">
                  <input
                    type="datetime-local"
                    ref={startDateRef}
                    value={startDate}
                    min={minDate}
                    max={maxDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-transparent outline-none text-gray-700 cursor-pointer appearance-none"
                  />
                  <FaCalendarAlt className="absolute right-2 text-gray-500" />
                </div>
              </div>

              {/* Start Time */}
              {/* <div
                className="bg-[#F4F7FE] p-3 rounded-md relative cursor-pointer"
                onClick={() => startTimeRef.current?.showPicker()}
              >
                <p className="text-gray-500 text-sm">Start Time</p>
                <div className="relative mt-1 flex items-center">
                  <input
                    type="time"
                    ref={startTimeRef}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-transparent outline-none text-gray-700 cursor-pointer appearance-none"
                  />
                  <GoClock className="absolute right-2 text-gray-500" />
                </div>
              </div> */}

              {/* End Date */}
              <div
                className="bg-[#F4F7FE] p-3 rounded-md relative cursor-pointer"
                onClick={() => endDateRef.current?.showPicker()}
              >
                <p className="text-gray-500 text-sm">End Date</p>
                <div className="relative mt-1 flex items-center">
                  <input
                    type="datetime-local"
                    ref={endDateRef}
                    value={endDate}
                    min={minDate}
                    max={maxDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-transparent outline-none text-gray-700 cursor-pointer"
                  />
                  <FaCalendarAlt className="absolute right-2 text-gray-500" />
                </div>
              </div>

              {/* End Time */}
              {/* <div
                className="bg-[#F4F7FE] p-3 rounded-md relative cursor-pointer"
                onClick={() => endTimeRef.current?.showPicker()}
              >
                <p className="text-gray-500 text-sm">End Time</p>
                <div className="relative mt-1 flex items-center">
                  <input
                    type="time"
                    ref={endTimeRef}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-transparent outline-none text-gray-700 cursor-pointer appearance-none"
                  />
                  <GoClock className="absolute right-2 text-gray-500" />
                </div>
              </div> */}
            </div>

            {/* Title Input */}

            <div
              className="bg-[#F4F7FE] p-2 rounded-md text-gray-600 cursor-pointer mt-4"
              onClick={() => titleRef.current?.focus()}
            >
              <p className="text-gray-500 text-sm">Title</p>
              <input
                ref={titleRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Write here"
                className="w-full bg-transparent outline-none text-gray-700 mt-1 text-sm"
              />
            </div>

            {/* Description Input */}

            <div
              className="bg-[#F4F7FE] p-2 rounded-md text-gray-600 cursor-pointer mt-4"
              onClick={() => descriptionRef.current?.focus()}
            >
              <p className="text-gray-500 text-sm">Description</p>
              <textarea
                ref={descriptionRef}
                type="text"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write here"
                className="w-full bg-transparent outline-none text-gray-700 mt-1 text-sm"
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Link to="/schedules">
              <button className="flex cursor-pointer items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-sm absolute ">
                <FaArrowLeft /> Back
              </button>
            </Link>

            <button
              onClick={handleAddNewTask}
              className="flex cursor-pointer items-center gap-2 px-6 py-3 bg-[#3255F0] hover:bg-blue-800 text-white rounded-lg shadow-md bottom-0 right-50"
            >
              Save <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default AddTask;
