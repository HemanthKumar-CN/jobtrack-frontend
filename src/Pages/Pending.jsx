import React, { useEffect, useState } from "react";
import { CiFilter, CiSettings } from "react-icons/ci";
import { PiListChecksBold } from "react-icons/pi";
import { RiArrowGoBackLine } from "react-icons/ri";
import { BsFileEarmarkArrowDown } from "react-icons/bs";
import { TbCalendarPlus } from "react-icons/tb";
import { TbEdit } from "react-icons/tb";
import { SiTicktick } from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import { fetchSchedule, updateSchedule } from "../redux/slices/scheduleSlice";
import { format, parse } from "date-fns";
import { capitalizeFirst } from "../Utils/capitalizeFirst";

const Pending = ({ activeTab, formattedDate, searchTerm }) => {
  const [editingRowId, setEditingRowId] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [filterEvent, setFilterEvent] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  const dispatch = useDispatch();

  const { schedules } = useSelector((state) => state.schedules);
  const { locationsList, employees } = useSelector(
    (state) => state.dropDownList,
  );
  const {
    notScheduledEmployees,
    notScheduledEmployeesLoading,
    notScheduledEmployeesError,
    classifications,
    eventList,
  } = useSelector((state) => state.schedules);

  const handleEditClick = (appointment) => {
    setEditingRowId(appointment.id);
    setEditedData((prev) => ({
      ...prev,
      [appointment.id]: {
        event_id: appointment.event.event_id,
        event_location_contractor_id: appointment.location_contractor.id,
        classification_id: appointment.class.id,
        start_time: format(new Date(appointment.start_time), "HH:mm"),
        comments: appointment.comments || "",
      },
    }));
  };

  const handleSave = (id) => {
    var payload = editedData[id];
    console.log("Saving edited data:", payload);

    if (payload?.start_time) {
      // Parse the date and time
      const parsedDate = parse(
        formattedDate + " " + payload.start_time,
        "EEEE, MMMM dd, yyyy HH:mm",
        new Date(),
      );

      // Get the system's timezone offset
      const offsetMinutes = parsedDate.getTimezoneOffset();
      const sample1 = parsedDate.getTime() + offsetMinutes * 60 * 1000;

      // Convert to UTC
      const utcDate = new Date(sample1);
      console.log(utcDate, "?>>>?????=======+++");

      const startTime = format(utcDate, "yyyy-MM-dd'T'HH:mm:ss'Z'");

      payload = {
        ...payload,
        start_time: startTime,
      };
    }

    console.log(payload, "???????????");

    dispatch(updateSchedule({ id: id, updatedData: payload }))
      .unwrap()
      .then(() => {
        setEditingRowId(null);
        const dateFilter = format(formattedDate, "yyyy-MM-dd");

        dispatch(
          fetchSchedule({
            date: dateFilter,
            event_id: filterEvent,
            location_id: filterLocation,
            search: searchTerm,
          }),
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const dateFilter = format(formattedDate, "yyyy-MM-dd");

    dispatch(
      fetchSchedule({
        date: dateFilter,
        event_id: filterEvent,
        location_id: filterLocation,
        search: searchTerm,
        status: "pending",
      }),
    );
  }, [formattedDate, filterEvent, filterLocation, searchTerm]);

  console.log(searchTerm, "?////////");

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "text-[#00AD3A] bg-[#00AD3A1A]";
      case "pending":
        return "text-[#FF8000] bg-[#FF80001A]";
      case "declined":
        return "text-[#E73F3F] bg-[#E73F3F1A]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvatarColor = (index) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
    ];
    return colors[index % colors.length];
  };

  console.log(editedData, "???///////////");

  console.log(eventList);
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-auto">
      <div className="">
        <div className="bg-white rounded-lg border border-gray-200 p-4 px-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 flex flex-col gap-4">
              <span className="font-semibold">{activeTab}</span>
              <span>
                Total: {schedules.length}, Available: 26, Limited: 25,
                Unavailable: 26
              </span>
            </div>

            <div className="flex items-center space-x-1">
              {/* <button className="flex items-center cursor-pointer space-x-2 px-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <PiListChecksBold className="w-4 h-4 border p-[0.01em] rounded-sm text-[#008CC8]" />
                <span className="text-xs">Select All</span>
              </button> */}
              <button className="flex items-center cursor-pointer space-x-2 px-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <RiArrowGoBackLine className="w-4 h-4 border p-[0.08em] rounded-sm" />
                <span className="text-xs">Show Previous Assignments</span>
              </button>
              <button className="flex items-center cursor-pointer space-x-2 px-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <BsFileEarmarkArrowDown className="w-4 h-4" />
                <span className="text-xs">Get Previous Assignments</span>
              </button>
              {/* <button className="flex items-center cursor-pointer space-x-2 px-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <TbCalendarPlus className="w-4 h-4" />
                <span className="text-xs">Recommend Scheduled</span>
              </button> */}
              {/* <button className="flex items-center cursor-pointer space-x-2 px-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <TbCalendarPlus className="w-4 h-4" />
                <span className="text-xs">Schedule Selected</span>
              </button> */}
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="p-2 border cursor-pointer border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <CiFilter className="w-4 h-4" />
              </button>
            </div>
          </div>
          {
            <div
              className={`transition-all duration-300 ease-in-out transform ${
                showFilter
                  ? "opacity-100 translate-y-0 scale-100 h-full mt-2 p-4"
                  : "opacity-0 -translate-y-2 scale-95 pointer-events-none h-0"
              } bg-gray-100 rounded-lg`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Event Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Event
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setFilterEvent(e.target.value)}
                  >
                    <option value="">Filter by event...</option>
                    {eventList.map((event) => {
                      return (
                        <option key={event?.id} value={event?.id}>
                          {event?.event_name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setFilterLocation(e.target.value)}
                  >
                    <option value="">Filter by location</option>
                    {locationsList?.map((location) => (
                      <option value={location?.id}>{location?.name}</option>
                    ))}
                  </select>
                </div>

                {/* Availability Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Availability
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All</option>
                    <option value="available">Available</option>
                    <option value="limited">Limited</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
      <div className="w-[80vw]">
        {/* Header */}
        <div
          className="grid items-center bg-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3"
          style={{
            gridTemplateColumns:
              "0.3fr 1.7fr 1fr 1fr 1fr 1fr 1fr 1fr 1.5fr 0.5fr",
          }}
        >
          <div>SN#</div>
          <div>Name</div>
          <div>Status</div>
          <div>Restrictions</div>
          <div>Event</div>
          <div>Location</div>
          <div>Class</div>
          <div>Start Time</div>
          <div>Comments</div>
          <div>Action</div>
        </div>

        {/* Rows */}
        {schedules.map((appointment, index) => (
          <div
            key={appointment.id}
            className="grid items-center border-t text-sm border-gray-200 px-4 py-4 hover:bg-gray-50 gap-1.5"
            style={{
              gridTemplateColumns:
                "0.3fr 1.7fr 1fr 1fr 1fr 1fr 1fr 1fr 1.5fr 0.5fr",
            }}
          >
            {/* SN# */}
            <div>{index + 1}</div>

            {/* Name with avatar */}
            <div className="flex items-center space-x-3 overflow-hidden">
              <div
                className={`w-8 h-8 rounded-full ${getAvatarColor(
                  index,
                )} flex items-center justify-center text-white text-sm font-medium shrink-0`}
              >
                {appointment.first_name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {appointment.first_name} {appointment.last_name}
                </div>
                <div className="text-gray-500 text-xs truncate">
                  {appointment.phone}
                </div>
              </div>
            </div>

            {/* Capacity */}
            <div className="">
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                  appointment.status,
                )}`}
              >
                {capitalizeFirst(appointment.status)}
              </span>
            </div>

            {/* Restrictions */}
            <div>
              <span
                className={`inline-flex py-1 text-xs font-medium rounded-full `}
              >
                {appointment.employee_restrictions
                  .map((r) => r.description)
                  .join(", ")}
              </span>
            </div>

            {/* Event */}
            <div>
              {editingRowId === appointment.id ? (
                <select
                  className="w-3/4 text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                  onChange={(e) =>
                    setEditedData((prev) => ({
                      ...prev,
                      [appointment.id]: {
                        ...prev[appointment.id],
                        event_id: e.target.value,
                        event_location_contractor_id: "",
                      },
                    }))
                  }
                  value={
                    editedData[appointment.id]?.event_id ||
                    appointment?.event?.event_id
                  }
                >
                  <option value="" className="bg-gray-200 font-semibold">
                    Select Event
                  </option>
                  {eventList.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.event_name}
                    </option>
                  ))}
                </select>
              ) : (
                <span
                  className={`inline-flex py-1 text-xs font-medium rounded-full `}
                >
                  {appointment?.event?.eventName}
                </span>
              )}
            </div>

            {/* Location */}
            <div>
              {editingRowId === appointment.id ? (
                <select
                  className="w-3/4 text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                  onChange={(e) =>
                    setEditedData((prev) => ({
                      ...prev,
                      [appointment.id]: {
                        ...prev[appointment.id],
                        event_location_contractor_id: e.target.value,
                      },
                    }))
                  }
                  value={
                    editedData[appointment.id]?.event_location_contractor_id ||
                    appointment?.location_contractor?.id
                  }
                >
                  {(() => {
                    const selectedEventId =
                      editedData[appointment.id]?.event_id ??
                      appointment?.event?.event_id;

                    // console.log(
                    //   "🔍 Selected Event ID:",
                    //   typeof selectedEventId,
                    // );

                    const selectedEvent = eventList.find(
                      (e) => e.id == selectedEventId,
                    );
                    // console.log(
                    //   "🔍 Selected Event Object:",
                    //   selectedEvent,
                    //   eventList,
                    // );

                    if (!selectedEvent) {
                      //   console.warn("⚠️ No matching event found in eventList");
                      return null;
                    }

                    const locations = selectedEvent.locations || [];
                    // console.log("📍 Event Locations:", locations);

                    const allOptions = locations.flatMap((loc) => {
                      //   console.log("➡️ Current Location:", loc);

                      return loc.contractors.map((contractor) => {
                        // console.log("👷 Contractor:", contractor);

                        return (
                          <option
                            key={contractor.event_location_contractor_id}
                            value={contractor.event_location_contractor_id}
                          >
                            {`${loc.name} - ${
                              contractor.name || contractor.company_name
                            }`}
                          </option>
                        );
                      });
                    });

                    return allOptions;
                  })()}
                </select>
              ) : (
                <span
                  className={`inline-flex py-1 text-xs font-medium rounded-full `}
                >
                  {appointment.location_contractor.name}
                </span>
              )}
            </div>

            {/* Class */}
            <div className="ml-3">
              {editingRowId === appointment.id ? (
                <select
                  className="w-3/4 text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                  value={
                    editedData[appointment.id]?.classification_id ||
                    appointment?.class?.id
                  }
                  onChange={(e) =>
                    setEditedData((prev) => ({
                      ...prev,
                      [appointment.id]: {
                        ...prev[appointment.id],
                        classification_id: e.target.value,
                      },
                    }))
                  }
                >
                  <option>None</option>
                  {classifications?.map((classification) => (
                    <option key={classification.id} value={classification.id}>
                      {classification.abbreviation} -{" "}
                      {classification.description}
                    </option>
                  ))}
                </select>
              ) : (
                <span
                  className={`inline-flex py-1 text-xs font-medium rounded-full `}
                >
                  {appointment.class.abbreviation}
                </span>
              )}
            </div>

            {/* Start Time */}
            <div>
              {editingRowId === appointment.id ? (
                <select
                  className="w-3/4 text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                  value={
                    editedData[appointment.id]?.start_time ||
                    format(new Date(appointment.start_time), "HH:mm")
                  }
                  onChange={(e) =>
                    setEditedData((prev) => ({
                      ...prev,
                      [appointment.id]: {
                        ...prev[appointment.id],
                        start_time: e.target.value,
                      },
                    }))
                  }
                >
                  <option>None</option>
                  <option value="00:00">0:00</option>
                  <option value="00:30">00:30</option>
                  <option value="01:00">01:00</option>
                  <option value="01:30">01:30</option>
                  <option value="02:00">02:00</option>
                  <option value="02:30">02:30</option>
                  <option value="03:00">03:00</option>
                  <option value="03:30">03:30</option>
                  <option value="04:00">04:00</option>
                  <option value="04:30">04:30</option>
                  <option value="05:00">05:00</option>
                  <option value="05:30">05:30</option>
                  <option value="06:00">06:00</option>
                  <option value="06:30">06:30</option>
                  <option value="07:00">07:00</option>
                  <option value="07:30">07:30</option>
                  <option value="08:00">08:00</option>
                  <option value="08:30">08:30</option>
                  <option value="09:00">09:00</option>
                  <option value="09:30">09:30</option>
                  <option value="10:00">10:00</option>
                  <option value="10:30">10:30</option>
                  <option value="11:00">11:00</option>
                  <option value="11:30">11:30</option>
                  <option value="12:00">12:00</option>
                  <option value="12:30">12:30</option>
                  <option value="13:00">13:00</option>
                  <option value="13:30">13:30</option>
                  <option value="14:00">14:00</option>
                  <option value="14:30">14:30</option>
                  <option value="15:00">15:00</option>
                  <option value="15:30">15:30</option>
                  <option value="16:00">16:00</option>
                  <option value="16:30">16:30</option>
                  <option value="17:00">17:00</option>
                  <option value="17:30">17:30</option>
                  <option value="18:00">18:00</option>
                  <option value="18:30">18:30</option>
                  <option value="19:00">19:00</option>
                  <option value="19:30">19:30</option>
                  <option value="20:00">20:00</option>
                  <option value="20:30">20:30</option>
                  <option value="21:00">21:00</option>
                  <option value="21:30">21:30</option>
                  <option value="22:00">22:00</option>
                  <option value="22:30">22:30</option>
                  <option value="23:00">23:00</option>
                  <option value="23:30">23:30</option>
                  <option value="23:59">23:59</option>
                </select>
              ) : (
                <span
                  className={`inline-flex py-1 text-xs font-medium rounded-full `}
                >
                  {format(new Date(appointment.start_time), "h:mm a")}
                  {/* {appointment.start_time} */}
                </span>
              )}
            </div>

            {/* Comments */}
            <div>
              {editingRowId === appointment.id ? (
                <input
                  type="text"
                  placeholder="Enter comments..."
                  className="text-sm border border-gray-300 rounded px-2 py-1 w-full"
                  value={
                    editedData[appointment.id]?.comments || appointment.comments
                  }
                  onChange={(e) =>
                    setEditedData((prev) => ({
                      ...prev,
                      [appointment.id]: {
                        ...prev[appointment.id],
                        comments: e.target.value,
                      },
                    }))
                  }
                />
              ) : (
                <span
                  className={`inline-flex py-1 text-xs font-medium rounded-full `}
                >
                  {appointment.comments || "No comments"}
                </span>
              )}
            </div>

            {/* Action */}
            <div className="flex justify-center">
              {editingRowId == appointment.id ? (
                <button
                  onClick={() => handleSave(appointment.id)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <SiTicktick className="w-4 h-4 text-[#00AD3A] cursor-pointer" />
                </button>
              ) : (
                <button
                  onClick={() => handleEditClick(appointment)}
                  className="p-2 text-gray-400 cursor-pointer hover:text-gray-600"
                >
                  <TbEdit className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Empty State */}
        {schedules.length === 0 && (
          <div className="text-center py-6 text-gray-500 text-sm border-t border-gray-200">
            No schedules found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Pending;
