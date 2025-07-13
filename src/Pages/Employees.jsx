import { useCallback, useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { BsChevronRight, BsChevronDown } from "react-icons/bs";
import { truncateText } from "../Utils/truncateText";
import { useDispatch, useSelector } from "react-redux";

import { BiSolidChevronRight } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaPen } from "react-icons/fa";
import {
  fetchEmployees,
  resetEmployees,
  softDeleteEmployee,
} from "../redux/slices/employeeSlice";
import { useToast } from "../Components/Toast/ToastContext";
import { useModal } from "../Components/Modal/ModalProvider";
import { Link, useNavigate } from "react-router-dom";
import CustomDropdown from "../Components/CustomDropdown";
import LocationIcon from "../assets/filter.svg";
import { GoPlus } from "react-icons/go";
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const Employees = () => {
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const { employees, hasMore, status } = useSelector(
    (state) => state.employees,
  );

  const [search, setSearch] = useState(""); // Using useState for search input
  const [page, setPage] = useState(1);

  const observer = useRef();
  const navigate = useNavigate();
  const searchRef = useRef();
  const listRef = useRef(null);
  const showToast = useToast();
  const { openModal } = useModal();

  const [selectedIndex, setSelectedIndex] = useState(null); // Track clicked row
  const [selectedStatus, setSelectedStatus] = useState({
    id: "active",
    name: "Active",
  }); // Track selected status
  const [sortField, setSortField] = useState("first_name"); // which field
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc

  const [activeTab, setActiveTab] = useState("active");

  const [typeFilter, setTypeFilter] = useState("");
  const [firstNameFilter, setFirstNameFilter] = useState("");
  const [lastNameFilter, setLastNameFilter] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSelectedIndex(null); // Close dropdown
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    setSearch(searchRef.current.value);

    dispatch(resetEmployees());
    setPage(1);
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

    dispatch(resetEmployees());
    setPage(1);
  };

  useEffect(() => {
    console.log(
      "Fetching employees...",
      typeFilter,
      firstNameFilter,
      lastNameFilter,
    );
    if (hasMore) {
      const prevScrollHeight = listRef.current?.scrollHeight; // Store scroll height before update
      dispatch(
        fetchEmployees({
          page,
          search,
          status: activeTab,
          sortField,
          sortOrder,
          typeFilter,
          firstNameFilter,
          lastNameFilter,
        }),
      ).then(() => {
        if (listRef.current) {
          listRef.current.scrollTop = 0; // Maintain position
        }
      });
    }
  }, [
    dispatch,
    page,
    search,
    activeTab,
    sortField,
    sortOrder,
    typeFilter,
    firstNameFilter,
    lastNameFilter,
  ]);

  const getStatusStyle = (status) => {
    const base = "text-xs px-2 py-1 rounded-full";
    switch (status) {
      case "active":
        return (
          <span className={`${base} text-green-600 bg-green-100`}>Active</span>
        );

      case "inactive":
        return (
          <span className={`${base} text-[#E73F3F] bg-[#E73F3F1A]`}>
            Inactive
          </span>
        );
      default:
        return base;
    }
  };

  // Intersection Observer for infinite scroll
  const lastEmployeeRef = useCallback(
    (node) => {
      if (status == "loading") return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [status, page],
  );

  const handleDeleteEmployee = async (id) => {
    try {
      await dispatch(softDeleteEmployee(id)).unwrap();
      showToast(`Employee deleted successfully: ${id}`, "success");
    } catch (error) {
      showToast(`Failed to delete employee: ${error}`, "error");
    }
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    // Optional: Trigger filtering or API call immediately here if you want.
    dispatch(resetEmployees());
    setPage(1);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    dispatch(resetEmployees());
    setPage(1);
  };

  return (
    <div className="p-2 pt-0 rounded-xl ">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="bg-white p-1 rounded-md">
          <button
            className={`${
              activeTab == "active"
                ? "text-[#00AD3A] bg-[#00AD3A1A]"
                : `text-gray-600 hover:text-gray-900`
            } px-6 py-1 rounded-md cursor-pointer `}
            onClick={() => handleTabClick("active")}
          >
            Active
          </button>
          <button
            className={` cursor-pointer rounded-md p-2 py-1 px-6 ${
              activeTab == "inactive"
                ? "text-[#E73F3F] bg-[#E73F3F1A]"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => handleTabClick("inactive")}
          >
            Inactive
          </button>
          <button
            className={` cursor-pointer rounded-md py-1 px-9 ${
              activeTab == ""
                ? "text-gradient bg-gradient-soft"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => handleTabClick("")}
          >
            All
          </button>
        </div>

        <div className="flex justify-between items-center gap-4">
          {/* Search Box */}
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
              className="w-full p-3 py-2 pr-10 border bg-white border-gray-300 rounded-lg focus:outline-none"
            />
            <FiSearch
              onClick={handleSearch}
              className="absolute right-3 top-1/2 cursor-pointer transform -translate-y-1/2 
        text-gray-500 transition-all duration-200 hover:text-blue-600 hover:scale-110"
              size={18}
            />
          </div>

          <div>
            <Link to="/employees/add">
              <button className="border border-[#008CC8] rounded-xl flex justify-center items-center p-2 px-3 cursor-pointer bg-[#008CC81A] hover:bg-[#008cc832] ">
                <GoPlus className="mr-2 text-[#008CC8]" />
                <span className="text-[#008CC8]">Add Employee</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className=" text-gray-800 bg-white w-[80vw] rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex flex-col font-bold">
            {activeTab?.toUpperCase()}{" "}
            <span className="text-sm text-gray-500">
              Total: {employees.length}
            </span>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 px-2.5 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer"
          >
            {/* <FiFilter size={16} className="text-gray-700" /> */}
            <img src={LocationIcon} alt="" width={18} />
          </button>
        </div>

        {/* Filters */}
        <div
          className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
            showFilters
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          {showFilters && (
            <div className="bg-[#F5F6F7] rounded-lg mb-3 grid grid-cols-1 sm:grid-cols-3 gap-4 mx-3 px-1 ">
              {/* Event Input */}
              <label className="block font-medium text-gray-700 p-2">
                Type
                <div className="relative mt-2">
                  <select
                    value={typeFilter}
                    onChange={(e) => {
                      setTypeFilter(e.target.value);
                      dispatch(resetEmployees());
                      setPage(1);
                    }}
                    className="w-full p-2 py-3 cursor-pointer pr-10 bg-white text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 appearance-none"
                  >
                    <option value="">Filter by type...</option>
                    <option value="A">A</option>
                    <option value="E">E</option>
                    {/* {eventList?.map((event) => (
                        <option key={event?.id} value={event?.id}>
                          {event?.event_name}
                        </option>
                      ))} */}
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
              <label className="block font-medium text-gray-700 p-2">
                First Name
                <input
                  type="text"
                  value={firstNameFilter}
                  onChange={(e) => {
                    setFirstNameFilter(e.target.value);
                    dispatch(resetEmployees());
                    setPage(1);
                  }}
                  placeholder="Filter by first name"
                  className="w-full mt-2 p-2 py-3 bg-white text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </label>

              {/* Contractors Dropdown */}
              <label className="block font-medium text-gray-700 p-2">
                Last Name
                <input
                  type="text"
                  value={lastNameFilter}
                  onChange={(e) => {
                    setLastNameFilter(e.target.value);
                    dispatch(resetEmployees());
                    setPage(1);
                  }}
                  placeholder="Filter by last name"
                  className="w-full mt-2 p-2 py-3 bg-white text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </label>
            </div>
          )}
        </div>

        <div className="">
          {/* Columns Header */}
          <div
            className="grid font-semibold text-sm text-gray-600 bg-gray-100 py-2 rounded-t-md"
            style={{
              gridTemplateColumns:
                "1fr 1.5fr 1.5fr 1fr 2fr 1.7fr 1.5fr 1fr 2fr 3fr 1fr",
            }}
          >
            <div className="ml-4">SN#</div>
            <div className="">FIRST NAME</div>
            <div>LAST NAME</div>
            <div>TYPE</div>
            <div>ADDRESS</div>
            <div>CITY</div>
            <div>STATE</div>
            <div>ZIP</div>
            <div>PHONE #</div>
            <div>EMAIL</div>
            {/* <div>SSN</div> */}
            {/* <div>COMMENTS</div>
            <div>MEMBER ID</div> */}
            <div>STATUS</div>
          </div>

          {/* Rows */}
          <div className="rounded-b-md border border-gray-200">
            {employees?.length === 0 ? (
              <div className="text-center p-4 text-gray-500">No data found</div>
            ) : (
              employees?.map((row, index) => (
                <div
                  key={row?.id}
                  className="grid text-sm border-t border-gray-100 px-2 py-3 items-center hover:bg-gray-50"
                  style={{
                    gridTemplateColumns:
                      "1fr 1.5fr 1.5fr 1fr 2fr 1.7fr 1.5fr 1fr 2fr 3fr 1fr",
                  }}
                >
                  <div className="ml-4">{index + 1}</div>
                  <div className="flex items-center gap-2">
                    {row?.User?.image_url && (
                      <img
                        src={`${IMAGE_BASE_URL}${row?.User?.image_url}`}
                        alt={row?.User?.first_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <span className="font-medium text-gray-900">
                      {row?.User?.first_name}
                    </span>
                  </div>
                  <div>{row?.User?.last_name}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      {row?.type && (
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-semibold">
                          {/* {row.first_name[0]} */}
                          {/* {row.last_name[0]} */}
                          <span>{row.type}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm">{`${row?.address_1} ${row?.address_2}`}</div>
                  <div>{row.city}</div>
                  <div>{row.state}</div>
                  <div>{row.postal_code}</div>
                  <div className="flex flex-col text-sm text-gray-900 leading-relaxed">
                    {row?.mobile_phone && (
                      <div className="flex items-center gap-2">
                        <span className="text-[#F67C1A] font-semibold">M</span>
                        <span>{row.mobile_phone}</span>
                      </div>
                    )}
                    {row?.phone && (
                      <div className="flex items-center gap-2">
                        <span className="text-[#23AA4D] font-semibold">H</span>
                        <span>{row.phone}</span>
                      </div>
                    )}
                  </div>
                  <div>{row?.User?.email}</div>
                  {/* <div>{row.ssn}</div> */}
                  {/* <div>{row.comments}</div>
                  <div>{row.number_id}</div> */}
                  <div>{getStatusStyle(row?.status)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employees;
