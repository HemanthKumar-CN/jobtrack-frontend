import { useEffect, useRef, useState } from "react";
import { FaPen } from "react-icons/fa";
import { FiEdit2, FiSearch } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { deleteEvent, fetchEvents } from "../redux/slices/eventSlice";
import { truncateText } from "../Utils/truncateText";
import { useNavigate } from "react-router-dom";
import { useModal } from "../Components/Modal/ModalProvider";
import { useToast } from "../Components/Toast/ToastContext";
import { formatDateTimeLocal } from "../Utils/formatDateTimeLocal";
import { format, parseISO } from "date-fns";
import React from "react";

const Events = () => {
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const showToast = useToast();

  const [sortField, setSortField] = useState("event_name"); // which field
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc

  const { events } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents({ search, sortField, sortOrder }));
  }, [dispatch, search, sortField, sortOrder]);

  const handleSearch = () => {
    setSearch(searchRef.current?.value);
  };

  const handleDeleteEvent = async (id) => {
    try {
      await dispatch(deleteEvent(id)).unwrap();
      showToast(`Event deleted successfully ${id}`, "success");
    } catch (error) {
      showToast(`Failed to delete Event: ${error}`, "error");
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      // If same field clicked, toggle the order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If different field clicked, set new field and reset to asc
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <>
      {/* Search Bar */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search"
          ref={searchRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          // onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 pr-10 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A2D43]"
        />
        <FiSearch
          onClick={handleSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          size={18}
        />
      </div>

      <div className="p-1 bg-white rounded-xl shadow-md">
        {/* Headers */}
        <div
          className="grid bg-gray-100 p-3 font-semibold text-gray-700 rounded-md"
          style={{ gridTemplateColumns: "20% 20% 15% 15% 30%" }}
        >
          <div
            className="flex items-center gap-1 cursor-pointer select-none"
            onClick={() => handleSort("event_name")}
          >
            Event Name
            <div className="flex flex-col ml-1">
              <span
                className={`leading-none text-xs ${
                  sortField === "event_name" && sortOrder === "asc"
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                ▲
              </span>
              <span
                className={`leading-none text-xs ${
                  sortField === "event_name" && sortOrder === "desc"
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                ▼
              </span>
            </div>
          </div>

          <div
            className="flex items-center gap-1 cursor-pointer select-none"
            onClick={() => handleSort("location")}
          >
            Location
            <div className="flex flex-col ml-1">
              <span
                className={`leading-none text-xs ${
                  sortField === "location" && sortOrder === "asc"
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                ▲
              </span>
              <span
                className={`leading-none text-xs ${
                  sortField === "location" && sortOrder === "desc"
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                ▼
              </span>
            </div>
          </div>
          <div
            className="flex items-center gap-1 cursor-pointer select-none"
            onClick={() => handleSort("contractor")}
          >
            Contractors
            <div className="flex flex-col ml-1">
              <span
                className={`leading-none text-xs ${
                  sortField === "contractor" && sortOrder === "asc"
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                ▲
              </span>
              <span
                className={`leading-none text-xs ${
                  sortField === "contractor" && sortOrder === "desc"
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                ▼
              </span>
            </div>
          </div>

          <div
            className="flex items-center gap-1 cursor-pointer select-none"
            onClick={() => handleSort("start_date")}
          >
            Start Date
            <div className="flex flex-col ml-1">
              <span
                className={`leading-none text-xs ${
                  sortField === "start_date" && sortOrder === "asc"
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                ▲
              </span>
              <span
                className={`leading-none text-xs ${
                  sortField === "start_date" && sortOrder === "desc"
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                ▼
              </span>
            </div>
          </div>
          <div
            className="flex items-center gap-1 cursor-pointer select-none"
            onClick={() => handleSort("end_date")}
          >
            End Date
            <div className="flex flex-col ml-1">
              <span
                className={`leading-none text-xs ${
                  sortField === "end_date" && sortOrder === "asc"
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                ▲
              </span>
              <span
                className={`leading-none text-xs ${
                  sortField === "end_date" && sortOrder === "desc"
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                ▼
              </span>
            </div>
          </div>
        </div>

        {/* Event List */}
        <div className="mt-2">
          {/* {events.map((event, index) => {
            return (
              <div
                key={index}
                style={{ gridTemplateColumns: "20% 20% 15% 20% 25%" }}
                className={`grid items-center rounded-md ${
                  index % 2 === 0 ? "bg-[rgba(24,105,187,0.1)]" : "bg-white"
                }`}
              >
                <div
                  onClick={() => navigate(`/events/add/${event.id}`)}
                  className=" border-white p-3 py-4.5 text-[#008CC8] cursor-pointer hover:underline hover:font-semibold"
                >
                  {truncateText(event.event_name)}
                </div>
                <div className="border-l-2 border-white p-3 py-4.5">
                  {truncateText(event?.Location?.name)}
                </div>
                <div className="border-l-2 border-white p-3 py-4.5">
                  {truncateText(event.Contractor?.company_name)}
                </div>
                <div className="border-l-2 border-white p-3 py-4.5">
                  {format(
                    parseISO(event.start_date),
                    // "MMMM d, yyyy 'at' h:mm a",
                    "MM/dd/yyyy - h:mm a",
                  )}
                </div>
                <div className=" border-x-2 border-white p-3 flex justify-between items-center">
                  <span className="">
                    {" "}
                    {format(parseISO(event.end_date), "MM/dd/yyyy - h:mm a")}
                  </span>
                  <span>
                    <button
                      onClick={() =>
                        openModal({
                          title: "Delete this item?",
                          message:
                            "This action is permanent and cannot be undone.",
                          onConfirm: () => handleDeleteEvent(event.id), // Call delete function inside modal
                          confirmText: "Delete",
                          cancelText: "Cancel",
                        })
                      }
                      className="border border-gray-300 p-2 mr-3 cursor-pointer bg-white hover:bg-gray-200 rounded-lg transition"
                    >
                      <RiDeleteBin6Line className="text-red-600 cursor-pointer hover:scale-110 transition" />
                    </button>

                    <button
                      onClick={() => navigate(`/events/add/${event.id}`)}
                      className="cursor-pointer border border-gray-300 p-2 bg-white hover:bg-gray-200 rounded-lg transition"
                    >
                      <FaPen className="text-blue-600 hover:scale-110 transition" />
                    </button>
                  </span>
                </div>
              </div>
            );
          })} */}

          {events.map((event, eventIndex) => {
            const eventRows = [];

            let totalContractorCount = 0;
            event.EventLocations?.forEach((loc) => {
              totalContractorCount += loc.EventLocationContractors?.length || 0;
            });

            event.EventLocations?.forEach((eventLocation, locIndex) => {
              const hasContractors =
                eventLocation.EventLocationContractors &&
                eventLocation.EventLocationContractors.length > 0;

              if (hasContractors) {
                eventLocation.EventLocationContractors.forEach(
                  (contractor, conIndex) => {
                    const isFirstRow = locIndex === 0 && conIndex === 0;

                    eventRows.push(
                      <div
                        key={`${event.id}-${eventLocation.id}-${contractor.id}`}
                        style={{
                          gridTemplateColumns: "18% 18% 15% 15% 24% 10%",
                        }}
                        className={`grid items-start rounded-md ${
                          eventIndex % 2 === 0
                            ? "bg-[rgba(24,105,187,0.1)]"
                            : "bg-white"
                        }`}
                      >
                        {/* Event Name (only on first row) */}
                        {isFirstRow ? (
                          <div
                            className="p-3 py-4.5 text-[#008CC8] font-medium cursor-pointer hover:underline hover:font-semibold"
                            onClick={() => navigate(`/events/add/${event.id}`)}
                          >
                            {truncateText(event.event_name)}
                          </div>
                        ) : (
                          <div></div>
                        )}

                        {/* Location Name */}
                        <div className="border-l-2 border-white p-3 py-4.5">
                          {truncateText(eventLocation.Location.name)}
                        </div>

                        {/* Contractor Name */}
                        <div className="border-l-2 border-white p-3 py-4.5">
                          {contractor.Contractor.company_name}
                        </div>

                        {/* Start Time */}
                        <div className="border-l-2 border-white p-3 py-4.5">
                          {format(
                            parseISO(contractor.start_time),
                            "MM/dd/yyyy - h:mm a",
                          )}
                        </div>

                        {/* End Time */}
                        <div className="border-l-2 border-white p-3 py-4.5">
                          {format(
                            parseISO(contractor.end_time),
                            "MM/dd/yyyy - h:mm a",
                          )}
                        </div>

                        {/* Buttons (only on first row) */}
                        {isFirstRow ? (
                          <div className="border-l-2 border-white p-3 py-4.5 flex justify-end gap-2">
                            <button
                              onClick={() =>
                                openModal({
                                  title: "Delete this event?",
                                  message:
                                    "This action is permanent and cannot be undone.",
                                  onConfirm: () => handleDeleteEvent(event.id),
                                  confirmText: "Delete",
                                  cancelText: "Cancel",
                                })
                              }
                              className="border border-gray-300 p-2 bg-white hover:bg-gray-200 rounded-lg transition cursor-pointer"
                            >
                              <RiDeleteBin6Line className="text-red-600 hover:scale-110 transition" />
                            </button>
                            <button
                              onClick={() =>
                                navigate(`/events/add/${event.id}`)
                              }
                              className="border border-gray-300 p-2 bg-white hover:bg-gray-200 rounded-lg transition cursor-pointer"
                            >
                              <FaPen className="text-blue-600 hover:scale-110 transition" />
                            </button>
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>,
                    );
                  },
                );
              } else {
                // No contractors for this location
                const isFirstRow = locIndex === 0;

                eventRows.push(
                  <div
                    key={`${event.id}-${eventLocation.id}-nocontractors`}
                    style={{
                      gridTemplateColumns: "18% 18% 15% 15% 24% 10%",
                    }}
                    className={`grid items-start rounded-md ${
                      eventIndex % 2 === 0
                        ? "bg-[rgba(24,105,187,0.1)]"
                        : "bg-white"
                    }`}
                  >
                    {/* Event Name */}
                    {isFirstRow ? (
                      <div
                        className="p-3 py-4.5 text-[#008CC8] font-medium cursor-pointer hover:underline hover:font-semibold"
                        onClick={() => navigate(`/events/add/${event.id}`)}
                      >
                        {truncateText(event.event_name)}
                      </div>
                    ) : (
                      <div></div>
                    )}

                    {/* Location Name */}
                    <div className="border-l-2 border-white p-3 py-4.5">
                      {truncateText(eventLocation.Location.name)}
                    </div>

                    {/* Empty contractor columns */}
                    <div className="border-l-2 border-white p-3 py-4.5 italic text-gray-500 col-span-3">
                      No contractors assigned
                    </div>

                    {/* Buttons (only on first row) */}
                    {isFirstRow ? (
                      <div className="border-l-2 border-white p-3 py-4.5 flex justify-end gap-2">
                        <button
                          onClick={() =>
                            openModal({
                              title: "Delete this event?",
                              message:
                                "This action is permanent and cannot be undone.",
                              onConfirm: () => handleDeleteEvent(event.id),
                              confirmText: "Delete",
                              cancelText: "Cancel",
                            })
                          }
                          className="border border-gray-300 p-2 bg-white hover:bg-gray-200 rounded-lg transition cursor-pointer"
                        >
                          <RiDeleteBin6Line className="text-red-600 hover:scale-110 transition" />
                        </button>
                        <button
                          onClick={() => navigate(`/events/add/${event.id}`)}
                          className="border border-gray-300 p-2 bg-white hover:bg-gray-200 rounded-lg transition cursor-pointer"
                        >
                          <FaPen className="text-blue-600 hover:scale-110 transition" />
                        </button>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>,
                );
              }
            });

            return <React.Fragment key={event.id}>{eventRows}</React.Fragment>;
          })}
        </div>
      </div>
    </>
  );
};

export default Events;
