import { useEffect, useRef, useState } from "react";
import { FaPen, FaUserFriends } from "react-icons/fa";
import { FiEdit2, FiFilter, FiSearch } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { deleteEvent, fetchEvents } from "../redux/slices/eventSlice";
import { truncateText } from "../Utils/truncateText";
import { Link, useNavigate } from "react-router-dom";
import { useModal } from "../Components/Modal/ModalProvider";
import { useToast } from "../Components/Toast/ToastContext";
import { formatDateTimeLocal } from "../Utils/formatDateTimeLocal";
import { format, parseISO } from "date-fns";
import React from "react";
import { GoPlus } from "react-icons/go";
import LocationContractorIcon from "../assets/locationContractorIcon.svg";
import LocationContractorBlackIcon from "../assets/locationContractorIconBlack.svg";
import LocationIcon from "../assets/filter.svg";
import {
  fetchContractorsDropdown,
  fetchEventsDropdown,
  fetchLocationsList,
} from "../redux/slices/dropDownSlice";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

const Events = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Current");
  const searchRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const showToast = useToast();

  const [sortField, setSortField] = useState(""); // which field
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc

  const [eventFilter, setEventFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [contractorsFilter, setContractorsFilter] = useState("");

  const [expandedEventIds, setExpandedEventIds] = useState([]);
  const [allExpanded, setAllExpanded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { locationsList, contractors, eventList } = useSelector(
    (state) => state.dropDownList,
  );

  const [showLocationAndContractors, setShowLocationAndContractors] =
    useState(false);

  const { events } = useSelector((state) => state.events);

  const toggleExpand = (id) => {
    setExpandedEventIds((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id],
    );
  };

  const toggleAllEvents = () => {
    if (allExpanded) {
      setExpandedEventIds([]);
      setAllExpanded(false);
    } else {
      const allIds = events.map((event) => event.id);
      setExpandedEventIds(allIds);
      setAllExpanded(true);
    }
  };

  const getStatusStyle = (status) => {
    const base = "px-2 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case "Current":
        return `${base} text-green-600 bg-green-100`;
      case "Future":
        return `${base} text-orange-500 bg-orange-100`;
      case "Past":
        return `${base} text-[#E73F3F] bg-[#E73F3F1A]`;
      default:
        return base;
    }
  };

  useEffect(() => {
    dispatch(
      fetchEvents({
        search,
        sortField,
        sortOrder,
        activeTab,
        eventFilter,
        locationFilter,
        contractorsFilter,
      }),
    );
  }, [
    dispatch,
    search,
    sortField,
    sortOrder,
    activeTab,
    eventFilter,
    locationFilter,
    contractorsFilter,
  ]);

  useEffect(() => {
    dispatch(fetchLocationsList());
    dispatch(fetchContractorsDropdown());
    dispatch(fetchEventsDropdown());
  }, []);

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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  console.log(eventFilter, locationFilter, contractorsFilter, "++ Filter ids");

  return (
    <>
      <div className="flex items-center justify-between  rounded-md">
        <div className="bg-white p-1 rounded-md">
          <button
            className={`${
              activeTab == "Current"
                ? "text-[#008CC8] bg-[#e6f3f9]"
                : `text-gray-600 hover:text-gray-900`
            } p-2 py-1 rounded-md cursor-pointer `}
            onClick={() => handleTabClick("Current")}
          >
            Current
          </button>
          <button
            className={` cursor-pointer rounded-md p-2 py-1 px-6 ${
              activeTab == "Past"
                ? "text-[#E73F3F] bg-[#E73F3F1A]"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => handleTabClick("Past")}
          >
            Past
          </button>

          <button
            className={` cursor-pointer rounded-md p-2 py-1 px-4 ${
              activeTab == "Future"
                ? "text-[#FF8000] bg-[#FF80001A]"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => handleTabClick("Future")}
          >
            Future
          </button>
          <button
            className={` cursor-pointer rounded-md p-2 py-1 px-6 ${
              activeTab == ""
                ? "text-gradient bg-gradient-soft"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => handleTabClick("")}
          >
            All
          </button>
        </div>

        <div className="flex items-center justify-between gap-5">
          {/* Search Bar */}
          <div className="relative">
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
              className="w-full p-3 py-2 pr-10 border bg-white border-gray-300 rounded-lg focus:outline-none"
            />
            <FiSearch
              onClick={handleSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={18}
            />
          </div>

          <div>
            <Link to="/events/add">
              <button className="border border-[#008CC8] rounded-xl flex justify-center items-center p-2 px-3 cursor-pointer bg-[#008CC81A] hover:bg-[#008cc832] ">
                <GoPlus className="mr-2 text-[#008CC8]" />
                <span className="text-[#008CC8]">Add Event</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-5 bg-white pt-3 rounded-xl shadow-md">
        <div className="w-full">
          <div className="flex justify-between items-center mb-3 mx-4">
            <h2 className=" font-bold text-gray-900">Events</h2>

            <div className="flex items-center gap-2">
              <span className="border p-0.5 border-[#E4E4E4] rounded-md ">
                {showLocationAndContractors ? (
                  <button
                    onClick={() => {
                      setShowLocationAndContractors(false);
                      toggleAllEvents();
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#008CC8] bg-[#008CC81A] rounded-md  border-[#008CC8]/30 hover:bg-[#008CC83d] transition cursor-pointer"
                  >
                    <img src={LocationContractorIcon} alt="" />
                    Hide Locations & Contractors
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowLocationAndContractors(true);
                      toggleAllEvents();
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-gray-100 rounded-md  border-[#008CC8]/30 hover:bg-[#008CC83d] transition cursor-pointer"
                  >
                    <img src={LocationContractorBlackIcon} alt="" />
                    Show Locations & Contractors
                  </button>
                )}
              </span>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 px-2.5 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                {/* <FiFilter size={16} className="text-gray-700" /> */}
                <img src={LocationIcon} alt="" />
              </button>
            </div>
          </div>

          <div
            className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
              showFilters
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            {showFilters && (
              <div className="bg-[#F5F6F7] rounded-lg mb-3 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 mx-3">
                {/* Event Input */}
                <label className="block font-medium text-gray-700">
                  Event
                  <div className="relative mt-2">
                    <select
                      value={eventFilter}
                      onChange={(e) => setEventFilter(e.target.value)}
                      className="w-full p-2 py-3 pr-10 bg-white text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 appearance-none"
                    >
                      <option value="">Filter by Event...</option>
                      {eventList?.map((event) => (
                        <option key={event?.id} value={event?.id}>
                          {event?.event_name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </label>

                {/* Location Dropdown */}
                <label className="block font-medium text-gray-700">
                  Location
                  <div className="relative mt-2">
                    <select
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full p-2 py-3 pr-10 bg-white text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 appearance-none"
                    >
                      <option value="">Filter by Location...</option>
                      {locationsList?.map((location) => (
                        <option key={location?.id} value={location?.id}>
                          {location?.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </label>

                {/* Contractors Dropdown */}
                <label className="block font-medium text-gray-700">
                  Contractors
                  <div className="relative mt-2">
                    <select
                      value={contractorsFilter}
                      onChange={(e) => setContractorsFilter(e.target.value)}
                      className="w-full p-2 py-3 pr-10 bg-white text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 appearance-none"
                    >
                      <option value="">Filter by Contractors...</option>
                      {contractors?.map((contractor) => (
                        <option key={contractor?.id} value={contractor?.id}>
                          {contractor?.company_name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </label>
              </div>
            )}
          </div>
        </div>
        {/* Headers */}
        <div className="w-full  border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-6 text-left bg-[#F8F9FA] text-gray-600 text-sm font-bold px-4 py-3 border-b border-gray-200">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleSort("event_name")}
            >
              <span>EVENT NAME</span>
              <div className="flex flex-col text-xs leading-[0.8rem]">
                <span
                  className={`${
                    sortField === "event_name" && sortOrder === "asc"
                      ? "text-[#1A2D43]"
                      : "text-gray-400"
                  }`}
                >
                  ▲
                </span>
                <span
                  className={`${
                    sortField === "event_name" && sortOrder === "desc"
                      ? "text-[#1A2D43]"
                      : "text-gray-400"
                  }`}
                >
                  ▼
                </span>
              </div>
            </div>
            <div>STATUS</div>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleSort("start_date")}
            >
              <span>START DATE</span>
              <div className="flex flex-col text-xs leading-[0.8rem]">
                <span
                  className={`${
                    sortField === "start_date" && sortOrder === "asc"
                      ? "text-[#1A2D43]"
                      : "text-gray-400"
                  }`}
                >
                  ▲
                </span>
                <span
                  className={`${
                    sortField === "start_date" && sortOrder === "desc"
                      ? "text-[#1A2D43]"
                      : "text-gray-400"
                  }`}
                >
                  ▼
                </span>
              </div>
            </div>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleSort("end_date")}
            >
              <span>END DATE</span>
              <div className="flex flex-col text-xs leading-[0.8rem]">
                <span
                  className={`${
                    sortField === "end_date" && sortOrder === "asc"
                      ? "text-[#1A2D43]"
                      : "text-gray-400"
                  }`}
                >
                  ▲
                </span>
                <span
                  className={`${
                    sortField === "end_date" && sortOrder === "desc"
                      ? "text-[#1A2D43]"
                      : "text-gray-400"
                  }`}
                >
                  ▼
                </span>
              </div>
            </div>

            <div>PROJECT CODE</div>
            <div className="text-left pr-4">COMMENTS</div>
          </div>

          {/* Events List */}
          {events.map((event) => (
            <div key={event.id} className="border-b border-gray-100">
              <div className="grid grid-cols-6 items-center text-gray-800 px-4 py-3">
                <div
                  onClick={() => navigate(`/events/add/${event.id}`)}
                  className="font-bold hover:underline cursor-pointer"
                >
                  {event.event_name}
                </div>
                <div>
                  <span className={getStatusStyle(event.status)}>
                    {event.status}
                  </span>
                </div>
                <div>{format(new Date(event.start_date), "MM/dd/yyyy")}</div>
                <div>{format(new Date(event.end_date), "MM/dd/yyyy")}</div>
                <div>{event.project_code}</div>
                <div className="flex justify-between items-center gap-2">
                  <span>{event.project_comments}</span>
                  <button
                    className="border border-gray-400 p-1 rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleExpand(event.id)}
                  >
                    {expandedEventIds.includes(event.id) ? (
                      <BsChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <BsChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Nested Table */}
              {expandedEventIds.includes(event.id) && (
                <div className="bg-[#F2F9FC] p-3.5">
                  <div className=" border border-[#E6E6E6] rounded-xl ">
                    <div className="grid grid-cols-4 rounded-t-xl font-bold border-b border-gray-300 bg-[#F8F9FA]">
                      <div className="p-3 border-r border-[#E6E6E6]  ">
                        Locations
                      </div>
                      <div className="p-3 border-r border-[#E6E6E6] ">
                        Contractor
                      </div>
                      <div className="p-3 border-r border-[#E6E6E6] ">
                        Start Time
                      </div>
                      <div className="p-3">End Time</div>
                    </div>

                    {event?.EventLocations?.map((loc) =>
                      loc?.EventLocationContractors?.map(
                        (contractor, index) => (
                          <div
                            key={`${loc?.id}-${contractor?.id}`}
                            className={`${
                              loc?.EventLocationContractors?.length ==
                                index + 1 && "rounded-b-xl"
                            } grid grid-cols-4 text-sm text-gray-800 border-b border-gray-200 bg-white`}
                          >
                            {/* Show Location name only on the first row for this location */}
                            <div className="p-2 px-3 border-r border-[#E6E6E6]">
                              {loc?.Location?.name}
                            </div>
                            <div className="p-2 px-3 border-r border-[#E6E6E6]">
                              {contractor?.Contractor?.company_name}
                            </div>
                            <div className="p-2 px-3 border-r border-[#E6E6E6]">
                              {contractor?.start_time
                                ? format(
                                    parseISO(contractor.start_time),
                                    "HH:mm",
                                  )
                                : "--"}
                            </div>
                            <div className="p-2 px-3">
                              {contractor?.end_time
                                ? format(parseISO(contractor.end_time), "HH:mm")
                                : "--"}
                            </div>
                          </div>
                        ),
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {events.length == 0 && (
            <div className="flex justify-center items-center text-gray-500 py-6 h-[30vh]">
              📅 No events found for the selected filters.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Events;
