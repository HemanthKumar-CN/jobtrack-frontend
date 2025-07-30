import React, { Fragment, useEffect, useState } from "react";
import { CiFilter, CiSettings } from "react-icons/ci";
import { PiListChecksBold } from "react-icons/pi";
import { RiArrowGoBackLine } from "react-icons/ri";
import { BsFileEarmarkArrowDown } from "react-icons/bs";
import { TbCalendarPlus } from "react-icons/tb";
import { TbEdit } from "react-icons/tb";
import { SiTicktick } from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPreviousAssignments,
  fetchSchedule,
  setPreviousAssignments,
  updateSchedule,
} from "../redux/slices/scheduleSlice";
import { format, parse } from "date-fns";
import { capitalizeFirst } from "../Utils/capitalizeFirst";
import ButtonDropdown from "../Components/ButtonDropdown";
import SelectAllBlack from "../assets/selectAllBlack.svg";
import SelectAllBlue from "../assets/selectAllBlue.svg";
import GetPreviousBlack from "../assets/getPreviousBlack.svg";
import RecommendScheduled from "../assets/recommedScheduled.svg";
import ScheduleSelected from "../assets/scheduleSelected.svg";
import LocationIcon from "../assets/filter.svg";
import { FaCheck } from "react-icons/fa";
import { useToast } from "../Components/Toast/ToastContext";

const Pending = ({ activeTab, formattedDate, searchTerm }) => {
  const [editingRowId, setEditingRowId] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [filterEvent, setFilterEvent] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("");
  const [allSelected, setAllSelected] = useState(false);

  const [Total, setTotal] = useState("");
  const [Available, setAvailable] = useState("");
  const [Limited, setLimited] = useState("");
  const [Unavailable, setUnavailable] = useState("");

  const [showPrevious, setShowPrevious] = useState(false);

  const [rowSelections, setRowSelections] = useState({});

  const dispatch = useDispatch();
  const showToast = useToast();

  const { schedules } = useSelector((state) => state.schedules);
  const { locationsList, employees } = useSelector(
    (state) => state.dropDownList,
  );
  const { previousAssignments, populateFromPrevious } = useSelector(
    (state) => state.schedules,
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

  useEffect(() => {
    {
      setTotal(schedules.length);
      setAvailable(
        schedules.filter((emp) => emp?.capacity === "Available").length || 0,
      );
      setLimited(
        schedules.filter((emp) => emp?.capacity === "Limited").length || 0,
      );
      setUnavailable(
        schedules.filter((emp) => emp?.capacity === "Unavailable").length || 0,
      );
    }
  }, [schedules]);

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
            status: "pending",
            capacity: filterAvailability,
          }),
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleToggleSelectAll = () => {
    const newSelections = {};

    if (!allSelected) {
      schedules.forEach((employee) => {
        newSelections[employee.id] = {
          ...rowSelections[employee.id],
          checked: true,
        };
      });
    } else {
      schedules.forEach((employee) => {
        newSelections[employee.id] = {
          ...rowSelections[employee.id],
          checked: false,
        };
      });
    }

    setRowSelections(newSelections);
    setAllSelected(!allSelected);
  };

  const handleCheckboxToggle = (id) => {
    setRowSelections((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        checked: !prev[id]?.checked,
      },
    }));
  };

  useEffect(() => {
    const dateFilter = format(formattedDate, "yyyy-MM-dd");

    dispatch(
      fetchSchedule({
        date: dateFilter,
        event_id: filterEvent,
        location_id: filterLocation,
        search: searchTerm,
        capacity: filterAvailability,
        status: "pending",
      }),
    );
  }, [
    formattedDate,
    filterEvent,
    filterLocation,
    searchTerm,
    filterAvailability,
  ]);

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

  const handleShowPreviousAssignments = () => {
    const selectedEmployeeIds = Object.entries(rowSelections)
      .filter(([_, val]) => val.checked)
      .map(([id]) => parseInt(id));

    if (selectedEmployeeIds.length == 0) {
      showToast("Select atleast one row from the table", "error");
      return false;
    }

    if (selectedEmployeeIds.length) {
      console.log(selectedEmployeeIds, "??????????");
      dispatch(fetchPreviousAssignments(selectedEmployeeIds));
    }

    return true;
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
        <div className="bg-white rounded-lg border-gray-200 p-4 px-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 flex flex-col gap-4">
              <span className="font-bold text-lg text-black">{activeTab}</span>
              <span>
                Total: {Total}, Available: {Available}, Limited:{Limited},
                Unavailable:{Unavailable}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 rounded-xl px-1 py-1 border border-gray-300">
                <button
                  className={`flex items-center cursor-pointer space-x-2 px-2 py-2 font-semibold rounded-lg hover:shadow-md ${
                    allSelected ? "text-[#008CC8] bg-[#008CC81A]" : ""
                  }`}
                  onClick={handleToggleSelectAll}
                >
                  {/* <PiListChecksBold className="w-4 h-4 border p-[0.01em] rounded-sm " /> */}
                  {allSelected ? (
                    <img src={SelectAllBlue} alt="" />
                  ) : (
                    <img src={SelectAllBlack} alt="" />
                  )}
                  <span className="text-[13px]">
                    {allSelected ? "Deselect All" : "Select All"}
                  </span>
                </button>

                <ButtonDropdown
                  show={showPrevious}
                  onToggle={(value) => setShowPrevious(value)}
                  handleShowPreviousAssignments={handleShowPreviousAssignments}
                />

                <button className="flex items-center cursor-pointer space-x-2 px-1 py-2 font-semibold border-gray-300 rounded-lg hover:shadow-md">
                  {/* <TbCalendarPlus className="w-4 h-4" /> */}
                  <img src={RecommendScheduled} alt="" />
                  <span className="text-[13px]">Recommend Scheduled</span>
                </button>
              </div>
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="p-2.5 border cursor-pointer border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {/* <CiFilter className="w-4 h-4" /> */}
                <img src={LocationIcon} alt="" width={18} />
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
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setFilterAvailability(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="Available">Available</option>
                    <option value="Limited">Limited</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
      <table className="w-full text-sm border-collapse">
        {/* Header */}
        <thead className="bg-gray-100 text-[#4D4E50] font-bold uppercase tracking-wider">
          <tr>
            <th className="px-3.5 py-3 ">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="peer hidden"
                  checked={allSelected}
                  onChange={handleToggleSelectAll}
                />
                <div className="h-4 w-4 border-2 border-gray-400 rounded-sm flex items-center justify-center peer-checked:bg-[#008cc8] peer-checked:border-[#008cc8]">
                  {allSelected && <FaCheck className="text-white text-xs" />}
                </div>
              </label>
            </th>
            <th className="">SN#</th>
            <th className="px-2 text-left">Name</th>
            <th className="px-2">Status</th>
            <th className="px-2 text-left">Restrictions</th>
            <th className="px-2 text-left">Event</th>
            <th className="px-2">Location</th>
            <th className="px-2 text-center">Class</th>
            <th className="px-2 text-center">Start Time</th>
            <th className="px-2">Comments</th>
            <th className="px-2">Action</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {schedules.map((appointment, index) => (
            <Fragment key={appointment.id}>
              <tr
                key={appointment.id}
                className="border-t text-sm border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!rowSelections[appointment.id]?.checked}
                      onChange={() => handleCheckboxToggle(appointment.id)}
                      className="peer hidden"
                    />
                    <div className="h-4 w-4 border-2 border-gray-400 rounded-sm flex items-center justify-center peer-checked:bg-[#008cc8] peer-checked:border-[#008cc8]">
                      {!!rowSelections[appointment.id]?.checked && (
                        <FaCheck className="text-white text-xs" />
                      )}
                    </div>
                  </label>
                </td>
                {/* SN# */}
                <td className="px-2 py-2 text-center">{appointment?.snf}</td>

                {/* Name with avatar */}
                <td className="px-2 py-2">
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
                      <div className="text-gray-500 text-sm truncate">
                        {appointment.phone}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="px-2 py-2 text-center">
                  <span
                    className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${getStatusColor(
                      appointment.status,
                    )}`}
                  >
                    {capitalizeFirst(appointment.status)}
                  </span>
                </td>

                {/* Restrictions */}
                <td className="px-2 py-2 text-left">
                  <span className="inline-flex py-1 text-sm rounded-full">
                    {appointment.employee_restrictions
                      .map((r) => r.description)
                      .join(", ")}
                  </span>
                </td>

                {/* Event */}
                <td className="px-2 py-2 text-left">
                  {editingRowId === appointment.id ? (
                    <select
                      className="w-full text-sm border border-gray-300 rounded px-2 py-1 bg-white"
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
                    <span className="inline-flex py-1 text-sm font-medium rounded-full">
                      {appointment?.event?.eventName}
                    </span>
                  )}
                </td>

                {/* Location */}
                <td className="px-2 py-2 text-center">
                  {editingRowId === appointment.id ? (
                    <select
                      className="w-full text-sm border border-gray-300 rounded px-2 py-1 bg-white"
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
                        editedData[appointment.id]
                          ?.event_location_contractor_id ||
                        appointment?.location_contractor?.id
                      }
                    >
                      {(() => {
                        const selectedEventId =
                          editedData[appointment.id]?.event_id ??
                          appointment?.event?.event_id;

                        const selectedEvent = eventList.find(
                          (e) => e.id == selectedEventId,
                        );

                        if (!selectedEvent) return null;

                        return selectedEvent.locations?.flatMap((loc) =>
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
                        );
                      })()}
                    </select>
                  ) : (
                    <span className="inline-flex py-1 text-sm font-medium rounded-full">
                      {appointment.location_contractor.name}
                    </span>
                  )}
                </td>

                {/* Class */}
                <td className="px-2 py-2 text-center">
                  {editingRowId === appointment.id ? (
                    <select
                      className="w-full text-sm border border-gray-300 rounded px-2 py-1 bg-white"
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
                        <option
                          key={classification.id}
                          value={classification.id}
                        >
                          {classification.abbreviation} -{" "}
                          {classification.description}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="inline-flex py-1 text-sm font-medium rounded-full">
                      {appointment.class.abbreviation}
                    </span>
                  )}
                </td>

                {/* Start Time */}
                <td className="px-2 py-2 text-center">
                  {editingRowId === appointment.id ? (
                    <select
                      className="w-full text-sm border border-gray-300 rounded px-2 py-1 bg-white"
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
                      {[...Array(48)].map((_, i) => {
                        const hour = String(Math.floor(i / 2)).padStart(2, "0");
                        const minute = i % 2 === 0 ? "00" : "30";
                        return (
                          <option key={i} value={`${hour}:${minute}`}>
                            {`${hour}:${minute}`}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <span className="inline-flex py-1 text-sm font-medium rounded-full">
                      {format(new Date(appointment.start_time), "h:mm a")}
                    </span>
                  )}
                </td>

                {/* Comments */}
                <td className="px-2 py-2 text-center">
                  {editingRowId === appointment.id ? (
                    <input
                      type="text"
                      placeholder="Enter comments..."
                      className="text-sm border border-gray-300 rounded px-2 py-1 w-full"
                      value={
                        editedData[appointment.id]?.comments ||
                        appointment.comments
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
                    <span className="inline-flex py-1 text-sm font-medium rounded-full">
                      {appointment.comments || "No comments"}
                    </span>
                  )}
                </td>

                {/* Action */}
                <td className="px-2 py-2 text-center">
                  {editingRowId === appointment.id ? (
                    <button
                      onClick={() => handleSave(appointment.id)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <SiTicktick className="w-4 h-4 text-[#00AD3A] cursor-pointer" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditClick(appointment)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <TbEdit className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
              {/* Previous Assignment */}
              {previousAssignments?.[appointment.id] !== undefined && (
                <tr className="border border-[#E6E6E6] border-dashed bg-[#008CC80D] text-gray-700 text-sm">
                  {/* Checkbox column */}
                  <td></td>

                  {/* SN# */}
                  <td className="">
                    {previousAssignments[appointment.id] ? "" : "-"}
                  </td>

                  {/* Name column - "Previous Assignment" label */}
                  <td className=" text-[#848484]">Previous Assignment</td>

                  {/* Capacity */}
                  <td></td>

                  {/* Restrictions */}
                  <td></td>

                  {/* Event */}
                  <td className="px-2">
                    {previousAssignments[appointment.id]?.event_name ||
                      "No assignments found"}
                  </td>

                  {/* Location */}
                  <td className="px-2 py-4">
                    {previousAssignments[appointment.id]
                      ? `${
                          previousAssignments[appointment.id].location || "N/A"
                        } - ${
                          previousAssignments[appointment.id].contractor ||
                          "N/A"
                        }`
                      : "-"}
                  </td>

                  {/* Class */}
                  <td className="px-2">
                    {previousAssignments[appointment.id]?.classification_name ||
                      "-"}
                  </td>

                  {/* Start Time */}
                  <td className="text-[#FF8000]">
                    {previousAssignments[appointment.id]?.start_time
                      ? format(
                          new Date(
                            previousAssignments[appointment.id].start_time,
                          ),
                          "HH:mm a",
                        )
                      : "-"}
                  </td>

                  {/* Comments */}
                  <td></td>

                  {/* Action */}
                  <td></td>
                </tr>
              )}
            </Fragment>
          ))}

          {/* Empty State */}
          {schedules.length === 0 && (
            <tr>
              <td colSpan="10" className="text-center py-6 text-gray-500">
                No schedules found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Pending;
