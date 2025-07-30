import React, { Fragment, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  createBulkSchedule,
  fetchClassifications,
  fetchEventlist,
  fetchNotScheduledEmployees,
  fetchPreviousAssignments,
  setPreviousAssignments,
} from "../redux/slices/scheduleSlice";
import { format, parse } from "date-fns";
import ButtonDropdown from "../Components/ButtonDropdown";
import { useToast } from "../Components/Toast/ToastContext";
import SelectAllBlack from "../assets/selectAllBlack.svg";
import SelectAllBlue from "../assets/selectAllBlue.svg";
import GetPreviousBlack from "../assets/getPreviousBlack.svg";
import RecommendScheduled from "../assets/recommedScheduled.svg";
import ScheduleSelected from "../assets/scheduleSelected.svg";
import { FaCheck } from "react-icons/fa6";
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const NotScheduled = ({
  activeTab,
  setActiveTab,
  formattedDate,
  searchTerm,
}) => {
  const dispatch = useDispatch();
  const showToast = useToast();
  const [Total, setTotal] = useState("");
  const [Available, setAvailable] = useState("");
  const [Limited, setLimited] = useState("");
  const [Unavailable, setUnavailable] = useState("");

  const [eventData, setEventData] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [rowSelections, setRowSelections] = useState({});
  const [showPrevious, setShowPrevious] = useState(false);

  const [allSelected, setAllSelected] = useState(false);
  // const [populateFromPrevious, setPopulateFromPrevious] = useState({});

  const [
    selectedEventLocationContractorId,
    setSelectedEventLocationContractorId,
  ] = useState(null);
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

  useEffect(() => {
    if (notScheduledEmployees.length > 0) {
      setTotal(notScheduledEmployees.length);
      setAvailable(
        notScheduledEmployees.filter((emp) => emp?.capacity === "Available")
          .length,
      );
      setLimited(
        notScheduledEmployees.filter((emp) => emp?.capacity === "Limited")
          .length,
      );
      setUnavailable(
        notScheduledEmployees.filter((emp) => emp?.capacity === "Unavailable")
          .length,
      );
    }
  }, [notScheduledEmployees]);

  useEffect(() => {
    if (populateFromPrevious && Object.keys(populateFromPrevious).length > 0) {
      const updatedSelections = { ...rowSelections };

      for (const [id, data] of Object.entries(populateFromPrevious)) {
        if (data) {
          updatedSelections[id] = {
            ...(updatedSelections[id] || {}),
            checked: true,
            eventId: data.event_id,
            locationContractorId: data.event_location_contractor_id, // confirm the key if it's event_location_contractor_id
            classificationId: data.classification_id,
            startTime: format(new Date(data.start_time), "HH:mm"),
            comments: data.comments || "",
          };
        }
      }

      setRowSelections(updatedSelections);
    }
  }, [populateFromPrevious]);

  console.log("populate from previous ---:", populateFromPrevious);

  useEffect(() => {
    const dateFilter = format(formattedDate, "yyyy-MM-dd");

    dispatch(
      fetchNotScheduledEmployees({ date: dateFilter, search: searchTerm }),
    )
      .unwrap()
      .catch((error) => {
        console.log("Failed to fetch not scheduled employees:", error);
      });
  }, [formattedDate, searchTerm]);

  useEffect(() => {
    setEventData(eventList);
  }, [eventList]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-[#00AD3A1A] text-[#00AD3A]";
      case "Unavailable":
        return "bg-[#E73F3F1A] text-[#E73F3F]";
      case "Limited":
        return "bg-[#FF80001A] text-[#FF8000]";
    }
  };

  const handleEventChange = (id, eventId) => {
    setRowSelections((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        checked: true,
      },
    }));
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
    // Step 1: Get eventId for this row
    const eventId = rowSelections[id]?.eventId;

    // Step 2: Find the matching contractor from eventData
    const contractorStartTime = eventData
      .find((e) => e.id === eventId)
      ?.locations.flatMap((loc) => loc.contractors)
      .find(
        (contractor) =>
          contractor.event_location_contractor_id === locContractorId,
      )?.start_time;

    let formattedStartTime = "";

    if (contractorStartTime) {
      console.log(contractorStartTime, "???///////////////");
      const parsedDate = new Date(contractorStartTime);
      formattedStartTime = format(parsedDate, "HH:mm"); // → "09:30"
    }

    setRowSelections((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        locationContractorId: locContractorId,
        startTime: formattedStartTime || "", // fallback to empty string
      },
    }));
  };

  const handleCreateSchedulesForSelected = () => {
    const invalidRows = [];

    Object.entries(rowSelections).forEach(([id, data]) => {
      if (data?.checked) {
        const isValid =
          data.eventId &&
          data.locationContractorId &&
          data.classificationId &&
          data.startTime;

        if (!isValid) {
          const index = notScheduledEmployees.findIndex(
            (emp) => emp.id === parseInt(id),
          );
          invalidRows.push(index + 1); // SN# is index + 1
        }
      }
    });

    if (invalidRows.length > 0) {
      showToast(
        `Rows ${invalidRows.join(", ")} have missing fields. Please fill them.`,
        "error",
      );
      return;
    }

    // ✅ All valid – prepare bulk data
    const bulkData = {};

    Object.entries(rowSelections).forEach(([id, data]) => {
      if (data?.checked) {
        const parsedDate = parse(
          formattedDate + " " + data.startTime,
          "EEEE, MMMM dd, yyyy HH:mm",
          new Date(),
        );
        const offsetMinutes = parsedDate.getTimezoneOffset();
        const utcDate = new Date(parsedDate.getTime() - offsetMinutes * 60000);

        bulkData[id] = {
          classificationId: data.classificationId,
          eventId: data.eventId,
          locationContractorId: data.locationContractorId,
          startTime: format(utcDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
          comments: data?.comments || "",
        };
      }
    });

    console.log("Bulk Data to submit:", bulkData);

    dispatch(createBulkSchedule(bulkData))
      .unwrap()
      .then(() => {
        setActiveTab("Scheduled");
      })
      .catch((err) => {
        showToast("Error while creating schedules.", "error");
      });
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
        checked: true,
      },
    }));
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
        checked: true,
      },
    }));
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

    setRowSelections((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        checked: true,
      },
    }));
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

  const handleToggleSelectAll = () => {
    const newSelections = {};

    if (!allSelected) {
      notScheduledEmployees.forEach((employee) => {
        newSelections[employee.id] = {
          ...rowSelections[employee.id],
          checked: true,
        };
      });
    } else {
      notScheduledEmployees.forEach((employee) => {
        newSelections[employee.id] = {
          ...rowSelections[employee.id],
          checked: false,
        };
      });
    }

    setRowSelections(newSelections);
    setAllSelected(!allSelected);
  };

  const handleGetPrevious = () => {
    const selectedEmployeeIds = Object.entries(rowSelections)
      .filter(([_, val]) => val.checked)
      .map(([id]) => parseInt(id));

    if (selectedEmployeeIds.length == 0) {
      showToast("Select atleast one row from the table", "error");
      return false;
    }

    if (selectedEmployeeIds.length) {
      console.log(selectedEmployeeIds, "??????????");
      dispatch(setPreviousAssignments(selectedEmployeeIds))
        .unwrap()
        .then((response) => {
          // setPopulateFromPrevious(response);
        })
        .catch((error) => {});
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
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-auto">
      <div className="">
        <div className="bg-white rounded-t-lg  border-gray-200 p-4 px-3">
          <div className="flex items-center justify-between">
            <div className=" text-gray-600 flex flex-col gap-4">
              <span className="font-bold text-lg text-black">{activeTab}</span>
              <span>
                Total: {Total}, Available: {Available}, Limited: {Limited},
                Unavailable: {Unavailable}
              </span>
            </div>

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
              <button
                className="flex items-center cursor-pointer space-x-2 px-1 py-2 font-semibold border-gray-300 rounded-lg hover:shadow-md "
                onClick={handleGetPrevious}
              >
                {/* <BsFileEarmarkArrowDown className="w-4 h-4" /> */}
                <img src={GetPreviousBlack} alt="" />
                <span className="text-[13px]">Get Previous Assignments</span>
              </button>
              <button className="flex items-center cursor-pointer space-x-2 px-1 py-2 font-semibold border-gray-300 rounded-lg hover:shadow-md">
                {/* <TbCalendarPlus className="w-4 h-4" /> */}
                <img src={RecommendScheduled} alt="" />
                <span className="text-[13px]">Recommend Scheduled</span>
              </button>
              <button
                onClick={handleCreateSchedulesForSelected}
                className="flex items-center cursor-pointer space-x-2 px-1 py-2 font-semibold border-gray-300 rounded-lg hover:shadow-md"
              >
                {/* <TbCalendarPlus className="w-4 h-4" /> */}
                <img src={ScheduleSelected} alt="" />
                <span className="text-[13px]">Schedule Selected</span>
              </button>
              {/* <button className="p-2 border cursor-pointer border-gray-300 rounded-lg hover:bg-gray-50">
                <CiFilter className="w-4 h-4" />
              </button> */}
            </div>
          </div>
        </div>
      </div>

      <table className="w-full text-sm border-collapse">
        {/* Header */}
        <thead className="bg-gray-100 uppercase tracking-wider text-[#4D4E50] font-bold">
          <tr>
            <th className="px-3.5 py-3.5 ">
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
            <th>SN#</th>
            <th className="text-left pl-3">Name</th>
            <th className="text-left px-2">Capacity</th>
            <th className="text-left px-2">Restrictions</th>
            <th className="text-left px-2">Event</th>
            <th className="text-left px-2">Location</th>
            <th className="text-left px-2">Class</th>
            <th>Start Time</th>
            <th className="text-left px-2">Comments</th>
            <th className="px-3">Action</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {notScheduledEmployees?.map((appointment, index) => (
            <Fragment key={index}>
              <tr
                key={index}
                className="border-t border-gray-200 hover:bg-gray-50"
                // style={{ fontSize: "1rem" }}
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
                <td className="text-center">{appointment?.snf}</td>
                <td className="px-2 ">
                  <div className="flex items-center space-x-3">
                    {appointment.User?.image_url ? (
                      <img
                        src={`${IMAGE_BASE_URL}${appointment?.User?.image_url}`}
                        alt={appointment?.User?.first_name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div
                        className={`w-9 h-9 rounded-full bg-[#008CC8] flex items-center justify-center text-white text-sm font-medium`}
                      >
                        {appointment.User.first_name.charAt(0).toUpperCase()}
                        {appointment?.User?.last_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="">
                      <div className="font-medium text-gray-900 truncate">
                        {appointment.User.first_name}{" "}
                        {appointment.User.last_name}
                      </div>
                      <div className="flex justify-between gap-2 items-center ">
                        <div className="text-gray-500 text-xs truncate ">
                          {appointment.phone}
                        </div>
                        <div
                          className={`w-5 h-5  rounded-full  ${
                            appointment?.type == "A"
                              ? "bg-[#008CC8]"
                              : "bg-[#1A2D43]"
                          } flex items-center justify-center text-white text-xs font-mediums`}
                        >
                          {appointment.type || "A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-2">
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      appointment.capacity || "Available",
                    )}`}
                  >
                    {appointment.capacity || "Available"}
                  </span>
                </td>
                {/* <td className="px-2 py-4">
                  {appointment.restrictions.map((r, i) => (
                    <span key={i} className="block text-[13px]">
                      {r.description}
                    </span>
                  ))}
                </td> */}
                <td className="px-2 py-4 align-top">
                  <div className="h-[3.9rem] overflow-hidden">
                    {appointment.restrictions.slice(0, 3).map((r, i) => (
                      <span
                        key={i}
                        className="block text-[13px] leading-[1.3rem] truncate"
                      >
                        {r.description}
                        {i < appointment.restrictions.length - 1 && ", "}
                      </span>
                    ))}
                  </div>
                  {appointment.restrictions.length > 3 && (
                    <span className="text-[12px] text-gray-400 block mt-1">
                      + more...
                    </span>
                  )}
                </td>
                <td className="px-2">
                  <select
                    className="w-full text-sm border border-[#E6E6E6] rounded-[8px] px-2 py-1 text-[#4D4E50] cursor-pointer bg-white"
                    value={rowSelections[appointment.id]?.eventId || ""}
                    onChange={(e) =>
                      handleEventChange(
                        appointment.id,
                        parseInt(e.target.value),
                      )
                    }
                  >
                    {!eventData.length && (
                      <option value="" disabled>
                        No events available
                      </option>
                    )}
                    {eventData.length > 0 && (
                      <>
                        <option value="">Select Event</option>
                        {eventData.map((event) => (
                          <option key={event.id} value={event.id}>
                            {event.event_name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </td>
                <td className="px-2">
                  <select
                    className="w-full text-sm border border-[#E6E6E6] text-[#4D4E50] cursor-pointer rounded-[8px] px-2 py-1 bg-white"
                    onChange={(e) =>
                      handleLocationChange(
                        appointment.id,
                        parseInt(e.target.value),
                      )
                    }
                    value={
                      rowSelections[appointment.id]?.locationContractorId || ""
                    }
                    disabled={!rowSelections[appointment.id]?.eventId}
                  >
                    <option value="">Select Location - Contractor</option>
                    {eventData
                      .find(
                        (e) => e.id === rowSelections[appointment.id]?.eventId,
                      )
                      ?.locations.flatMap((loc) =>
                        loc.contractors.map((contractor) => (
                          <option
                            key={contractor.event_location_contractor_id}
                            value={contractor.event_location_contractor_id}
                          >{`${loc.name} - ${
                            contractor.name || contractor.company_name
                          }`}</option>
                        )),
                      )}
                  </select>
                </td>
                <td className="px-2">
                  <select
                    className="w-full text-sm border text-[#4D4E50] cursor-pointer border-[#E6E6E6] rounded-[8px] px-2 py-1 bg-white"
                    value={
                      rowSelections[appointment.id]?.classificationId || ""
                    }
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
                        {classification.abbreviation}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-2">
                  <select
                    className="w-full text-[#4D4E50] cursor-pointer text-sm border border-[#E6E6E6] rounded-[8px] px-2 py-1 bg-white"
                    value={rowSelections[appointment.id]?.startTime || ""}
                    onChange={(e) =>
                      handleStartTimeChange(appointment.id, e.target.value)
                    }
                  >
                    <option className="text-gray-600">None</option>
                    {[...Array(48)].map((_, i) => {
                      const hours = String(Math.floor(i / 2)).padStart(2, "0");
                      const minutes = i % 2 === 0 ? "00" : "30";
                      return (
                        <option
                          key={i}
                          value={`${hours}:${minutes}`}
                        >{`${hours}:${minutes}`}</option>
                      );
                    })}
                  </select>
                </td>
                <td className="px-2">
                  <input
                    type="text"
                    placeholder="Enter comments..."
                    className="w-full text-sm border border-[#E6E6E6] rounded-[8px] px-2 py-1"
                    value={rowSelections[appointment.id]?.comments || ""}
                    onChange={(e) =>
                      handleCommentsChange(appointment.id, e.target.value)
                    }
                  />
                </td>
                <td className="text-center">
                  <button
                    onClick={() => handleCreateSchedule(appointment.id)}
                    className=""
                  >
                    {/* <FaSave className="w-5 h-5 text-[#00AD3A] cursor-pointer" /> */}
                    <img
                      src={ScheduleSelected}
                      alt=""
                      className="cursor-pointer"
                    />
                  </button>
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
        </tbody>
      </table>
    </div>
  );
};

export default NotScheduled;
