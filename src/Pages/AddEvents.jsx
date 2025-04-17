import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaCalendarAlt } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchContractorsDropdown,
  fetchLocationsList,
} from "../redux/slices/dropDownSlice";
import {
  clearEvent,
  createEvent,
  fetchEventById,
  updateEvent,
} from "../redux/slices/eventSlice";
import SuccessCard from "../Components/SuccessCard";
import { useToast } from "../Components/Toast/ToastContext";
import { convertToLocalDateTime } from "../Utils/convertToLocalDateTime";
import { formatDateTimeLocal } from "../Utils/formatDateTimeLocal";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/airbnb.css"; // Choose any theme you like
import { format } from "date-fns";

const AddEvents = () => {
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const eventNameRef = useRef(null);
  const eventLocationRef = useRef(null);
  const contractorRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const showToast = useToast();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventContractors, setEventContractors] = useState("");
  const [eventFields, setEventFields] = useState(null);

  const dispatch = useDispatch();
  const { locationsList, loading, error, contractors } = useSelector(
    (state) => state.dropDownList,
  );

  const { newEvent, event } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchLocationsList());
    dispatch(fetchContractorsDropdown());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchEventById(id));
    }
  }, [id]);

  const handleBackToEvents = () => {
    navigate("/events");
    dispatch(clearEvent());
  };

  useEffect(() => {
    if (id && event) {
      setEventName(event.event_name);
      setEventLocation(event.location_id);

      // Convert ISO date to YYYY-MM-DD format
      const formattedStartDate = event?.start_date
        ? formatDateTimeLocal(event.start_date) // Extract only the date part
        : "";
      // Convert ISO date to YYYY-MM-DD format
      const formattedEndDate = event?.end_date
        ? formatDateTimeLocal(event.end_date) // Extract only the date part
        : "";

      console.log(event.start_date, event.end_date);
      setEndDate(formattedEndDate);
      setStartDate(formattedStartDate);
      setEventContractors(event.contractor_id);
    }
  }, [event]);

  useEffect(() => {
    if (newEvent) {
      const newEventFields = [
        { label: "Event Name", value: newEvent.event_name, type: "text" },
        {
          label: "Event Location",
          value: newEvent?.Location?.name,
          type: "text",
        },
        {
          label: "Contractor Name",
          value: newEvent?.Contractor?.company_name,
          type: "text",
        },
        {
          label: "Event Start Date",
          value: newEvent.start_date,
          type: "date",
        },
        {
          label: "Event End Date",
          value: newEvent.end_date,
          type: "date",
        },
      ];
      setEventFields(newEventFields);
    }
  }, [newEvent]);

  const handleAddEvent = () => {
    console.log(eventName, eventContractors, eventLocation, startDate, endDate);
    const newEvent = {
      event_name: eventName,
      contractor_id: eventContractors,
      location_id: eventLocation,
      start_date: startDate,
      end_date: endDate,
    };
    dispatch(createEvent(newEvent));
  };

  const handleEditEvent = async () => {
    const updatedEvent = {
      event_name: eventName,
      contractor_id: eventContractors,
      location_id: eventLocation,
      start_date: startDate,
      end_date: endDate,
    };

    try {
      await dispatch(updateEvent({ id, updatedData: updatedEvent })).unwrap();
      showToast("Event updated successfully", "success");
      navigate("/events");
    } catch (error) {
      showToast(`Failed to update event: ${error}`, "error");
    }
  };

  const handleClearEvent = () => {
    dispatch(clearEvent());
  };

  if (eventFields) {
    return (
      <SuccessCard
        title="Event Added"
        fields={eventFields}
        onBack={handleBackToEvents}
        backButton={"Back to Events"}
      />
    );
  } else {
    return (
      <div className="flex relative pb-6 justify-center items-center bg-[#F4F7FE]">
        <div className="bg-white p-8 pb-15 pt-5 rounded-2xl shadow-lg w-[60vw]">
          {/* Header */}
          <h2 className="text-2xl font-semibold text-center text-[#1E1E1E]">
            {id ? "Edit an Event" : "Add an Event"}
          </h2>
          <p className="text-gray-500 text-center mb-6">
            {id ? "Edit event details below" : "Enter the event details below"}
          </p>

          {/* Form */}
          <form className="space-y-4">
            {/* Event Name - Click anywhere to focus */}
            <div
              className="bg-[#F4F7FE] p-2 rounded-md text-gray-600 cursor-pointer"
              onClick={() => eventNameRef.current?.focus()}
            >
              <p className="text-gray-500 text-sm">Event Name</p>
              <input
                ref={eventNameRef}
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Write here"
                className="w-full bg-transparent outline-none text-gray-700 mt-1"
              />
            </div>

            {/* Event Location - Click anywhere to open */}
            <div
              className="bg-[#F4F7FE] p-2 rounded-md cursor-pointer"
              onClick={() => eventLocationRef.current?.click()}
            >
              <p className="text-gray-500 text-sm">Event Location</p>
              <select
                ref={eventLocationRef}
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700 mt-1 cursor-pointer"
              >
                <option>Select event location</option>
                {locationsList.map((location) => {
                  return (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className="bg-[#F4F7FE] p-2 rounded-md relative cursor-pointer"
                onClick={() => startDateRef.current?.showPicker()}
              >
                <p className="text-gray-500 text-sm">Start Date</p>
                <div className="relative mt-1 flex items-center">
                  {/* <input
                    type="datetime-local"
                    ref={startDateRef}
                    value={startDate}
                    step="1800"
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-transparent outline-none text-gray-700 cursor-pointer appearance-none"
                  /> */}

                  <Flatpickr
                    options={{
                      enableTime: true,
                      dateFormat: "d-m-Y H:i",
                      time_24hr: true,
                      minuteIncrement: 30, // Only allow 00 and 30
                    }}
                    placeholder="dd-mm-yyyy"
                    value={startDate}
                    onChange={([date]) => {
                      const formatted = format(date, "yyyy-MM-dd'T'HH:mm");
                      setStartDate(formatted);
                    }}
                    className="w-full py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4F7FE]"
                  />
                  <FaCalendarAlt className="absolute right-2 text-gray-500" />
                </div>
              </div>

              {/* End Date */}
              <div
                className="bg-[#F4F7FE] p-2 rounded-md relative cursor-pointer"
                onClick={() => endDateRef.current?.showPicker()}
              >
                <p className="text-gray-500 text-sm">End Date</p>
                <div className="relative mt-1 flex items-center">
                  {/* <input
                    type="datetime-local"
                    ref={endDateRef}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-transparent outline-none text-gray-700 cursor-pointer 
                              appearance-none -webkit-appearance-none -moz-appearance-none"
                  /> */}
                  <Flatpickr
                    options={{
                      enableTime: true,
                      dateFormat: "d-m-Y H:i",
                      time_24hr: true,
                      minuteIncrement: 30, // Only allow 00 and 30
                    }}
                    placeholder="dd-mm-yyyy"
                    value={endDate}
                    onChange={([date]) => {
                      const formatted = format(date, "yyyy-MM-dd'T'HH:mm");
                      setEndDate(formatted);
                    }}
                    className="w-full py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4F7FE]"
                  />
                  <FaCalendarAlt className="absolute right-2 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Contractor - Click anywhere to open */}
            <div
              className="bg-[#F4F7FE] p-2 rounded-md cursor-pointer"
              onClick={() => contractorRef.current?.click()}
            >
              <p className="text-gray-500 text-sm">Contractor</p>
              <select
                ref={contractorRef}
                value={eventContractors}
                onChange={(e) => setEventContractors(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700 mt-1 cursor-pointer"
              >
                <option>Select</option>
                {contractors.map((contractor) => {
                  return (
                    <option key={contractor.id} value={contractor.id}>
                      {contractor.company_name}
                    </option>
                  );
                })}
              </select>
            </div>
          </form>
        </div>
        {/* Buttons - Correct Placement */}
        <div className="flex justify-between">
          <Link to="/events">
            <button
              onClick={handleClearEvent}
              className="cursor-pointer w-1/9 absolute bottom-0 left-50 flex justify-center items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-sm"
            >
              <FaArrowLeft /> Back
            </button>
          </Link>

          {id ? (
            <button
              onClick={handleEditEvent}
              className="cursor-pointer w-1/9 absolute bottom-0 right-50 flex justify-center items-center gap-2 px-6 py-3 bg-[#3255F0] hover:bg-blue-800 text-white rounded-lg shadow-md"
            >
              Save <FaArrowRight />
            </button>
          ) : (
            <button
              onClick={handleAddEvent}
              className="cursor-pointer w-1/9 absolute bottom-0 right-50 flex justify-center items-center gap-2 px-6 py-3 bg-[#3255F0] hover:bg-blue-800 text-white rounded-lg shadow-md"
            >
              Save <FaArrowRight />
            </button>
          )}
        </div>
      </div>
    );
  }
};

export default AddEvents;
