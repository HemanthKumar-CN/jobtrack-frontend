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
import { format, parseISO } from "date-fns";
import Select from "react-select";
import { convertToISOTime } from "../Utils/convertToISOTime";
import CalendarInput from "../assets/calendarInput.svg";

const AddEvents = () => {
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const eventNameRef = useRef(null);
  const eventLocationRef = useRef(null);
  const contractorRef = useRef(null);

  const projectCodeRef = useRef(null);
  const eventCommentRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const showToast = useToast();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventContractors, setEventContractors] = useState("");
  const [eventFields, setEventFields] = useState(null);
  const [projectCode, setProjectCode] = useState("");
  const [projectComments, setProjectComments] = useState("");

  const [selectedLocations, setSelectedLocations] = useState([]);
  const [contractorMap, setContractorMap] = useState({});

  const dispatch = useDispatch();
  const { locationsList, loading, error, contractors } = useSelector(
    (state) => state.dropDownList,
  );

  const { newEvent, event } = useSelector((state) => state.events);

  const locationOptions = locationsList.map((l) => ({
    label: l.name,
    value: l.id,
  }));

  const contractorOptions = contractors.map((c) => ({
    label: c.company_name,
    value: c.id,
  }));

  useEffect(() => {
    dispatch(fetchLocationsList());
    dispatch(fetchContractorsDropdown());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchEventById(id));
    }
  }, [id]);

  const handleLocationChange = (selected) => {
    setSelectedLocations(selected || []);
    // Initialize contractor map if new location added
    const newMap = { ...contractorMap };
    selected?.forEach((loc) => {
      if (!newMap[loc.value]) newMap[loc.value] = [];
    });
    setContractorMap(newMap);
  };

  const handleContractorChange = (locationId, selectedContractors) => {
    setContractorMap((prev) => {
      const existingContractors = prev[locationId] || [];

      // Create a map for quick lookup
      const existingMap = new Map(existingContractors.map((c) => [c.value, c]));

      const updated =
        selectedContractors?.map((c) => {
          if (existingMap.has(c.value)) {
            // Preserve existing time data
            return existingMap.get(c.value);
          } else {
            // New contractor, set default times
            return {
              ...c,
              startTime: "",
              endTime: "",
            };
          }
        }) || [];

      return {
        ...prev,
        [locationId]: updated,
      };
    });
  };

  const handleTimeChange = (locationId, contractorId, field, value) => {
    setContractorMap((prev) => ({
      ...prev,
      [locationId]: prev[locationId].map((c) =>
        c.value === contractorId ? { ...c, [field]: value } : c,
      ),
    }));
  };

  const handleBackToEvents = () => {
    navigate("/events");
    dispatch(clearEvent());
  };

  useEffect(() => {
    if (id && event) {
      setEventName(event.event_name);
      setProjectCode(event?.project_code);
      setProjectComments(event?.project_comments);

      console.log("Event:", event);
      setStartDate(event.start_date);
      setEndDate(event.end_date);

      // Prepare selectedLocations for dropdown
      const locationDropdownValues = event.EventLocations.map((loc) => ({
        label: loc.Location.name,
        value: loc.Location.id,
      }));
      setSelectedLocations(locationDropdownValues);

      // Build contractorMap for each location
      const newContractorMap = {};

      event.EventLocations.forEach((loc) => {
        const locationId = loc.Location.id;
        const contractors =
          loc.EventLocationContractors?.map((elc) => ({
            label: elc.Contractor.company_name,
            value: elc.Contractor.id,
            startTime: format(parseISO(elc.start_time), "HH:mm"),
            endTime: format(parseISO(elc.end_time), "HH:mm"),
          })) || [];
        newContractorMap[locationId] = contractors;
      });

      setContractorMap(newContractorMap);
    }
  }, [event]);

  useEffect(() => {
    if (newEvent) {
      const locationNames = newEvent?.EventLocations?.map(
        (loc) => loc?.Location?.name,
      )
        .filter(Boolean)
        .join(", ");

      const contractorNames = newEvent?.EventLocations?.flatMap((loc) =>
        loc?.EventLocationContractors?.map((c) => c?.Contractor?.company_name),
      )
        .filter(Boolean)
        .join(", ");
      const newEventFields = [
        { label: "Event Name", value: newEvent.event_name, type: "text" },
        {
          label: "Event Location",
          value: locationNames,
          type: "text",
        },
        {
          label: "Contractor Name",
          value: contractorNames,
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

  console.log("Selected Locations:", selectedLocations);
  console.log("Contractor Map:", contractorMap);

  const handleAddEvent = () => {
    const payload = {
      event_name: eventName,
      project_code: projectCode,
      project_comments: projectComments,
      start_date: new Date(startDate).toISOString(), // convert to ISO
      end_date: new Date(endDate).toISOString(),
      locations: selectedLocations.map((loc) => ({
        location_id: loc.value,
        contractors: (contractorMap[loc.value] || []).map((contractor) => ({
          contractor_id: contractor.value,
          start_time: convertToISOTime(startDate, contractor.startTime),
          end_time: convertToISOTime(startDate, contractor.endTime),
        })),
      })),
    };

    console.log("Adding event:", selectedLocations, contractorMap, payload);
    dispatch(createEvent(payload));
  };

  const handleEditEvent = async () => {
    // const updatedEvent = {
    //   event_name: eventName,
    //   contractor_id: eventContractors,
    //   location_id: eventLocation,
    //   start_date: startDate,
    //   end_date: endDate,
    // };

    const payload = {
      event_name: eventName,
      project_code: projectCode,
      project_comments: projectComments,
      start_date: new Date(startDate).toISOString(), // convert to ISO
      end_date: new Date(endDate).toISOString(),
      locations: selectedLocations.map((loc) => ({
        location_id: loc.value,
        contractors: (contractorMap[loc.value] || []).map((contractor) => ({
          contractor_id: contractor.value,
          start_time: convertToISOTime(startDate, contractor.startTime),
          end_time: convertToISOTime(startDate, contractor.endTime),
        })),
      })),
    };

    try {
      await dispatch(updateEvent({ id, updatedData: payload })).unwrap();
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
      <div className=" flex relative pb-6 justify-center items-center">
        <div className=" pb-15 w-full">
          {/* Header */}

          {/* Form */}
          <form className="space-y-4">
            {/* Event Name - Click anywhere to focus */}

            <div className="px-3 py-3 bg-white shadow-xs rounded-xl">
              <div className="grid grid-cols-4">
                <div
                  className=" p-2 rounded-md  cursor-pointer"
                  onClick={() => eventNameRef.current?.focus()}
                >
                  <p className="font-semibold">
                    Event Name <span className="text-red-600">*</span>{" "}
                  </p>
                  <input
                    ref={eventNameRef}
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="Event name here"
                    className="w-full border text-sm border-gray-300 rounded-lg px-3 py-3 bg-transparent outline-none text-black mt-1"
                  />
                </div>

                <div
                  className=" p-2 rounded-md relative cursor-pointer"
                  onClick={() => startDateRef.current?.showPicker()}
                >
                  <p className="font-semibold">
                    Start Date <span className="text-red-600">*</span>
                  </p>
                  <div className="relative mt-1 flex items-center border border-gray-300 rounded-lg px-3 py-1">
                    <Flatpickr
                      ref={startDateRef}
                      options={{
                        // enableTime: true,
                        dateFormat: "m/d/Y",
                        time_24hr: true,
                        minuteIncrement: 30, // Only allow 00 and 30
                      }}
                      placeholder="MM/DD/YYYY"
                      value={startDate}
                      onChange={([date]) => {
                        const formatted = format(date, "MM/dd/yyyy");
                        setStartDate(formatted);
                      }}
                      className=" py-2 text-sm rounded-md focus:outline-none "
                    />
                    {/* <FaCalendarAlt className="absolute right-2 text-gray-500" />  */}
                    <img
                      src={CalendarInput}
                      alt=""
                      className="absolute right-2"
                    />
                  </div>
                </div>

                <div
                  className="p-2 rounded-md relative cursor-pointer"
                  onClick={() => endDateRef.current?.showPicker()}
                >
                  <p className="font-semibold">
                    End Date <span className="text-red-600">*</span>
                  </p>
                  <div className="relative mt-1 flex items-center rounded-lg px-3 py-1 border border-gray-300">
                    <Flatpickr
                      ref={endDateRef}
                      options={{
                        // enableTime: true,
                        dateFormat: "m/d/Y",
                        time_24hr: true,
                        minuteIncrement: 30, // Only allow 00 and 30
                      }}
                      placeholder="MM/DD/YYYY"
                      value={endDate}
                      onChange={([date]) => {
                        const formatted = format(date, "MM/dd/yyyy");
                        setEndDate(formatted);
                      }}
                      className=" py-2 text-sm rounded-md focus:outline-none"
                    />
                    <img
                      src={CalendarInput}
                      alt=""
                      className="absolute right-2"
                    />
                  </div>
                </div>

                <div
                  className=" p-2 rounded-md  cursor-pointer"
                  onClick={() => projectCodeRef.current?.focus()}
                >
                  <p className="font-semibold">
                    Project Code <span className="text-red-600">*</span>{" "}
                  </p>
                  <input
                    ref={projectCodeRef}
                    type="text"
                    value={projectCode}
                    onChange={(e) => setProjectCode(e.target.value)}
                    placeholder="Event code here"
                    className="w-full border text-sm border-gray-300 rounded-lg px-3 py-3 bg-transparent outline-none text-black mt-1"
                  />
                </div>
              </div>

              <div
                className=" p-2 rounded-md  cursor-pointer"
                onClick={() => eventCommentRef.current?.focus()}
              >
                <p className="font-semibold">
                  Comments <span className="text-red-600">*</span>{" "}
                </p>
                <input
                  ref={eventCommentRef}
                  type="text"
                  value={projectComments}
                  onChange={(e) => setProjectComments(e.target.value)}
                  placeholder="Event comment here"
                  className="w-full border text-sm border-gray-300 rounded-lg px-3 py-3 bg-transparent outline-none text-black mt-1"
                />
              </div>
            </div>

            {/* Date Fields */}

            <div className="bg-white px-5 py-4 rounded-xl font-semibold cursor-pointer">
              <label className=" mb-2 block">Select Locations</label>
              <Select
                isMulti
                options={locationOptions}
                value={selectedLocations}
                onChange={handleLocationChange}
                className="text-sm"
              />
            </div>

            {/* Contractor - Click anywhere to open */}
            {/* <div
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
            </div> */}

            {selectedLocations.map((location) => (
              <div
                key={location.value}
                className="border border-[#E4E4E4] rounded-xl p-4 bg-white shadow-sm space-y-4"
              >
                <h3 className="font-bold text-lg text-gray-800">
                  {location.label}
                </h3>

                <div className="bg-[#F5F6F7] rounded-xl px-3 py-4">
                  <div>
                    <label className="font-medium block mb-1">
                      Select Contractors
                    </label>
                    <Select
                      isMulti
                      options={contractorOptions}
                      value={contractorMap[location.value] || []}
                      onChange={(selected) =>
                        handleContractorChange(location.value, selected)
                      }
                      className="text-sm"
                    />
                  </div>

                  {contractorMap[location.value]?.length > 0 && (
                    <div className="w-full border border-[#E6E6E6] rounded-xl overflow-hidden mt-3">
                      {/* Header */}
                      <div className="grid grid-cols-3 bg-[#f8f9fa] text-sm text-gray-700 font-medium px-4 py-2">
                        <div className="flex items-center font-bold">
                          Name <span className="text-red-500 ml-1">*</span>
                        </div>
                        <div className="flex items-center font-bold">
                          Start Time{" "}
                          <span className="text-red-500 ml-1">*</span>
                        </div>
                        <div className="flex items-center font-bold">
                          End Time
                        </div>
                      </div>

                      {/* Rows */}
                      <div className="bg-white">
                        {contractorMap[location.value].map(
                          (contractor, idx) => (
                            <div
                              key={contractor.value}
                              className={`grid grid-cols-3 items-center px-4 py-2 text-sm text-gray-800 ${
                                idx !== contractorMap[location.value].length - 1
                                  ? "border-b border-gray-200"
                                  : ""
                              }`}
                            >
                              <div className="font-bold">
                                {contractor.label}
                              </div>

                              <div>
                                <Flatpickr
                                  value={contractor.startTime}
                                  options={{
                                    enableTime: true,
                                    noCalendar: true,
                                    dateFormat: "H:i",
                                    minuteIncrement: 30,
                                  }}
                                  placeholder="hh:mm"
                                  onChange={(date) =>
                                    handleTimeChange(
                                      location.value,
                                      contractor.value,
                                      "startTime",
                                      date[0]?.toTimeString().slice(0, 5) || "",
                                    )
                                  }
                                  className="border border-gray-300 p-1 rounded w-24"
                                />
                              </div>

                              <div>
                                <Flatpickr
                                  value={contractor.endTime}
                                  options={{
                                    enableTime: true,
                                    noCalendar: true,
                                    dateFormat: "H:i",
                                    minuteIncrement: 30,
                                  }}
                                  placeholder="hh:mm"
                                  onChange={(date) =>
                                    handleTimeChange(
                                      location.value,
                                      contractor.value,
                                      "endTime",
                                      date[0]?.toTimeString().slice(0, 5) || "",
                                    )
                                  }
                                  className="border border-gray-300 p-1 rounded w-24"
                                />
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </form>
        </div>
        {/* Buttons - Correct Placement */}
        <div className="flex justify-between">
          <Link to="/events">
            <button
              onClick={handleClearEvent}
              className="cursor-pointer w-1/9 absolute bottom-0 right-50 flex justify-center items-center gap-2 px-6 py-2 bg-[#E4E5E5] hover:bg-gray-200 text-gray-800 rounded-lg shadow-sm"
            >
              {/* <FaArrowLeft /> */}
              Back
            </button>
          </Link>

          {id ? (
            <button
              onClick={handleEditEvent}
              className="cursor-pointer w-1/9 absolute bottom-0 right-10 flex justify-center items-center gap-2 px-6 py-2 bg-[#008CC8] hover:bg-[#1A2D43] text-white rounded-lg shadow-md"
            >
              Save
              {/* <FaArrowRight /> */}
            </button>
          ) : (
            <button
              onClick={handleAddEvent}
              className="cursor-pointer w-1/9 absolute bottom-0 right-10 flex justify-center items-center gap-2 px-6 py-2 bg-[#008CC8] hover:bg-[#1A2D43] text-white rounded-lg shadow-md"
            >
              Save
              {/* <FaArrowRight /> */}
            </button>
          )}
        </div>
      </div>
    );
  }
};

export default AddEvents;
