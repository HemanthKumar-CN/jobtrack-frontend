import React, { use, useEffect, useState } from "react";
import { CiFilter, CiSettings } from "react-icons/ci";
import { PiListChecksBold } from "react-icons/pi";
import { RiArrowGoBackLine } from "react-icons/ri";
import { BsFileEarmarkArrowDown } from "react-icons/bs";
import { TbCalendarPlus } from "react-icons/tb";
import { SiTicktick } from "react-icons/si";
import { FaSave } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import {
  createBulkSchedule,
  fetchClassifications,
  fetchEventlist,
  fetchNotScheduledEmployees,
} from "../redux/slices/scheduleSlice";
import { format, parse } from "date-fns";

const NotScheduled = ({ activeTab, setActiveTab, formattedDate }) => {
  const dispatch = useDispatch();
  const [Total, setTotal] = useState("");
  const [Available, setAvailable] = useState("");
  const [Limited, setLimited] = useState("");
  const [Unavailable, setUnavailable] = useState("");

  const [eventData, setEventData] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [rowSelections, setRowSelections] = useState({});

  const [
    selectedEventLocationContractorId,
    setSelectedEventLocationContractorId,
  ] = useState(null);

  const {
    notScheduledEmployees,
    notScheduledEmployeesLoading,
    notScheduledEmployeesError,
    classifications,
    eventList,
  } = useSelector((state) => state.schedules);

  useEffect(() => {
    if (notScheduledEmployees.length > 0) {
      setTotal(notScheduledEmployees.length);
      setAvailable(
        notScheduledEmployees.filter((emp) => emp.status === "Available")
          .length,
      );
      setLimited(
        notScheduledEmployees.filter(
          (emp) => emp.status === "Limited Availability",
        ).length,
      );
      setUnavailable(
        notScheduledEmployees.filter((emp) => emp.status === "Unavailable")
          .length,
      );
    }
  }, [notScheduledEmployees]);

  const appointments = [
    {
      id: 1,
      name: "Cameron Williamson",
      phone: "312-921-6724",
      capacity: "Limited lifting capacity",
      status: "Pending",
      event: "None",
      location: "None",
      class: "None",
      startTime: "None",
    },
    {
      id: 2,
      name: "Guy Hawkins",
      phone: "312-921-6724",
      capacity: "Restricted hours",
      status: "Done",
      event: "None",
      location: "None",
      class: "None",
      startTime: "None",
    },
    {
      id: 3,
      name: "Robert Fox",
      phone: "312-921-6724",
      capacity: "Limited lifting capacity",
      status: "Cancel",
      event: "None",
      location: "None",
      class: "None",
      startTime: "None",
    },
    {
      id: 4,
      name: "Annette Black",
      phone: "312-921-6724",
      capacity: "No physical limitations",
      status: "Done",
      event: "None",
      location: "None",
      class: "None",
      startTime: "None",
    },
    {
      id: 5,
      name: "Cameron Williamson",
      phone: "312-921-6724",
      capacity: "Limited lifting capacity",
      status: "Pending",
      event: "None",
      location: "None",
      class: "None",
      startTime: "None",
    },
    {
      id: 6,
      name: "Cody Fisher",
      phone: "312-921-6724",
      capacity: "Restricted hours",
      status: "Done",
      event: "None",
      location: "None",
      class: "None",
      startTime: "None",
    },
    {
      id: 7,
      name: "Devon Lane",
      phone: "312-921-6724",
      capacity: "Limited lifting capacity",
      status: "Pending",
      event: "None",
      location: "None",
      class: "None",
      startTime: "None",
    },
    {
      id: 8,
      name: "Cody Fisher",
      phone: "312-921-6724",
      capacity: "No physical limitations",
      status: "Done",
      event: "None",
      location: "None",
      class: "None",
      startTime: "None",
    },
    {
      id: 9,
      name: "Robert Fox",
      phone: "312-921-6724",
      capacity: "Limited lifting capacity",
      status: "Cancel",
      event: "None",
      location: "None",
      class: "None",
      startTime: "None",
    },
    {
      id: 10,
      name: "Cody Fisher",
      phone: "312-921-6724",
      capacity: "Restricted hours",
      status: "Done",
      event: "None",
      location: "None",
      class: "None",
      startTime: "None",
    },
    {
      id: 11,
      name: "Robert Fox",
      phone: "312-921-6724",
      capacity: "Limited lifting capacity",
      status: "Cancel",
      event: "None",
      location: "None",
      class: "None",
      startTime: "None",
    },
  ];

  useEffect(() => {
    dispatch(fetchNotScheduledEmployees())
      .unwrap()
      .catch((error) => {
        console.log("Failed to fetch not scheduled employees:", error);
      });
  }, []);

  useEffect(() => {
    setEventData(eventList);
  }, [eventList]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800";
      case "Unavailable":
        return "bg-yellow-100 text-yellow-800";
      case "Limited Availability":
        return "bg-red-100 text-red-800";
    }
  };

  const handleEventChange = (id, eventId) => {
    setRowSelections((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        eventId,
        locationContractorId: null, // reset location-contractor on event change
      },
    }));
  };

  const handleLocationChange = (id, locContractorId) => {
    setRowSelections((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        locationContractorId: locContractorId,
      },
    }));
  };

  const handleCreateSchedule = (id) => {
    const rowData = rowSelections[id];
    console.log("Row:", id, "Data to submit:", rowData, formattedDate);

    // Parse the date and time
    const parsedDate = parse(
      formattedDate + " " + rowData.startTime,
      "EEEE, MMMM dd, yyyy HH:mm",
      new Date(),
    );

    // Get the system's timezone offset
    const offsetMinutes = parsedDate.getTimezoneOffset();

    // Convert to UTC
    const utcDate = new Date(parsedDate.getTime() - offsetMinutes * 60000);

    // Format it as an ISO UTC timestamp
    console.log(format(utcDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"));

    const scheduleData = {
      classificationId: rowData.classificationId,
      eventId: rowData.eventId,
      locationContractorId: rowData.locationContractorId,
      startTime: format(utcDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      comments: rowData.comments,
    };

    console.log("Schedule Data:", { [id]: scheduleData });

    dispatch(createBulkSchedule({ [id]: scheduleData }))
      .unwrap()
      .then(() => {
        console.log("Schedule created successfully for ID:", id);
        // Optionally, reset the row selection after successful creation

        setActiveTab("Scheduled");
      });
  };

  const handleClassificationChange = (id, classificationId) => {
    setRowSelections((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        classificationId,
      },
    }));
  };

  const handleStartTimeChange = (id, startTime) => {
    setRowSelections((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        startTime,
      },
    }));
  };

  const handleCommentsChange = (id, comments) => {
    setRowSelections((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        comments,
      },
    }));
  };

  console.log("Row selections:", rowSelections);

  const handleCheckboxToggle = (id) => {
    setRowSelections((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        checked: !prev[id]?.checked,
      },
    }));
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
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-auto">
      <div className="">
        <div className="bg-white rounded-lg border border-gray-200 p-4 px-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 flex flex-col gap-4">
              <span className="font-semibold">{activeTab}</span>
              <span>
                Total: {Total}, Available: {Available}, Limited: {Limited},
                Unavailable: {Unavailable}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <button className="flex items-center cursor-pointer space-x-2 px-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <PiListChecksBold className="w-4 h-4 border p-[0.01em] rounded-sm text-[#008CC8]" />
                <span className="text-xs">Select All</span>
              </button>
              <button className="flex items-center cursor-pointer space-x-2 px-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <RiArrowGoBackLine className="w-4 h-4 border p-[0.08em] rounded-sm" />
                <span className="text-xs">Show Previous Assignments</span>
              </button>
              <button className="flex items-center cursor-pointer space-x-2 px-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <BsFileEarmarkArrowDown className="w-4 h-4" />
                <span className="text-xs">Get Previous Assignments</span>
              </button>
              <button className="flex items-center cursor-pointer space-x-2 px-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <TbCalendarPlus className="w-4 h-4" />
                <span className="text-xs">Recommend Scheduled</span>
              </button>
              <button className="flex items-center cursor-pointer space-x-2 px-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <TbCalendarPlus className="w-4 h-4" />
                <span className="text-xs">Schedule Selected</span>
              </button>
              {/* <button className="p-2 border cursor-pointer border-gray-300 rounded-lg hover:bg-gray-50">
                <CiFilter className="w-4 h-4" />
              </button> */}
            </div>
          </div>
        </div>
      </div>
      <div className="min-w-[52vw]">
        {/* Header */}
        <div
          className="grid items-center bg-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3"
          style={{
            gridTemplateColumns:
              "0.2fr 0.3fr 1.7fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 0.3fr",
          }}
        >
          <div></div>
          <div>S/N</div>
          <div>Name</div>
          <div>Capacity</div>
          <div>Restrictions</div>
          <div>Event</div>
          <div>Location</div>
          <div>Class</div>
          <div>Start Time</div>
          <div>Comments</div>
          <div>Action</div>
        </div>

        {/* Rows */}
        {notScheduledEmployees.map((appointment, index) => (
          <div
            key={appointment.id}
            className="grid items-center border-t text-sm border-gray-200 px-4 py-4 hover:bg-gray-50"
            style={{
              gridTemplateColumns:
                "0.2fr 0.3fr 1.7fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 0.3fr",
            }}
          >
            <div className=" flex items-center justify-center">
              <input
                type="checkbox"
                checked={!!rowSelections[appointment.id]?.checked}
                onChange={() => handleCheckboxToggle(appointment.id)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
            </div>
            {/* S/N */}
            <div className="flex items-center justify-center">{index + 1}</div>

            {/* Name with avatar */}
            <div className="flex items-center space-x-3 overflow-hidden">
              <div
                className={`w-8 h-8 rounded-full ${getAvatarColor(
                  index,
                )} flex items-center justify-center text-white text-sm font-medium shrink-0`}
              >
                {appointment.User.first_name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {appointment.User.first_name} {appointment.User.last_name}
                </div>
                <div className="text-gray-500 text-xs truncate">
                  {appointment.phone}
                </div>
              </div>
            </div>

            {/* Capacity */}
            <div>
              <span
                className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(
                  appointment.status || "Available",
                )}`}
              >
                {appointment.status || "Available"}
              </span>
            </div>

            {/* Restrictions */}
            <div className="">
              <span className={` py-1 text-xs font-medium rounded-full `}>
                {appointment.restrictions.map((restriction, idx) => {
                  return (
                    <span key={idx} className="mt-1.5 rounded-md inline-block">
                      {restriction.description}
                    </span>
                  );
                })}
              </span>
            </div>

            {/* Event */}
            <div className="flex items-center">
              <select
                className="w-[90%] text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                onChange={(e) =>
                  handleEventChange(appointment.id, parseInt(e.target.value))
                }
                value={rowSelections[appointment.id]?.eventId || ""}
              >
                <option value="" className="bg-gray-200 font-semibold">
                  Select Event
                </option>
                {eventData.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.event_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <select
                className="w-3/4 text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                onChange={(e) =>
                  handleLocationChange(appointment.id, parseInt(e.target.value))
                }
                value={
                  rowSelections[appointment.id]?.locationContractorId || ""
                }
                disabled={!rowSelections[appointment.id]?.eventId}
              >
                <option value="" className="bg-gray-200 font-semibold">
                  Select Location - Contractor
                </option>
                {eventData
                  .find((e) => e.id === rowSelections[appointment.id]?.eventId)
                  ?.locations.flatMap((loc) =>
                    loc.contractors.map((contractor) => (
                      <option
                        key={contractor.event_location_contractor_id}
                        value={contractor.event_location_contractor_id}
                      >
                        {`${loc.name} - ${
                          contractor.name || contractor.company_name
                        }`}
                      </option>
                    )),
                  )}
              </select>
            </div>

            {/* Class */}
            <div>
              <select
                className="w-3/4 text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                value={rowSelections[appointment.id]?.classificationId || ""}
                onChange={(e) =>
                  handleClassificationChange(
                    appointment.id,
                    parseInt(e.target.value),
                  )
                }
              >
                <option value="none">None</option>
                {classifications?.map((classification) => (
                  <option key={classification.id} value={classification.id}>
                    {classification.abbreviation} - {classification.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Time */}
            <div>
              <select
                className="w-3/4 text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                value={rowSelections[appointment.id]?.startTime || ""}
                onChange={(e) =>
                  handleStartTimeChange(appointment.id, e.target.value)
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
            </div>

            {/* Comments */}
            <div className="flex justify-start">
              <input
                type="text"
                placeholder="Enter comments..."
                className="text-sm border border-gray-300 rounded px-2 py-1 w-full"
                value={rowSelections[appointment.id]?.comments || ""}
                onChange={(e) =>
                  handleCommentsChange(appointment.id, e.target.value)
                }
              />
            </div>

            {/* Action */}
            <div className="flex justify-end">
              <button
                className="p-2 text-gray-400 hover:text-gray-600"
                onClick={() => handleCreateSchedule(appointment.id)}
              >
                <FaSave className="w-5 h-5 text-[#00AD3A] cursor-pointer" />
              </button>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {appointments.length === 0 && (
          <div className="text-center py-6 text-gray-500 text-sm border-t border-gray-200">
            No appointments found.
          </div>
        )}
      </div>
    </div>
  );
};

export default NotScheduled;
