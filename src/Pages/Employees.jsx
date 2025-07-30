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
import EditIcon from "../assets/editIcon.svg";
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

      <div className=" text-gray-800 bg-white rounded-xl ">
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

        <div className=" rounded-md border border-gray-200">
          <table className="w-full text-left text-gray-600">
            {/* Table Head */}
            <thead className="bg-gray-100 font-semibold uppercase text-gray-600 text-sm">
              <tr>
                <th
                  className="py-2 px-4 rounded-tl-md cursor-pointer select-none"
                  onClick={() => handleSort("snf")}
                >
                  <div className="flex items-center gap-2">
                    <span>SN#</span>
                    <div className="flex flex-col text-xs leading-[0.8rem]">
                      <span
                        className={`${
                          sortField === "snf" && sortOrder === "asc"
                            ? "text-[#1A2D43]"
                            : "text-gray-400"
                        }`}
                      >
                        ▲
                      </span>
                      <span
                        className={`${
                          sortField === "snf" && sortOrder === "desc"
                            ? "text-[#1A2D43]"
                            : "text-gray-400"
                        }`}
                      >
                        ▼
                      </span>
                    </div>
                  </div>
                </th>
                {/* <th className="py-2 px-4 whitespace-nowrap">First Name</th> */}
                <th
                  className="py-2 px-4 whitespace-nowrap cursor-pointer select-none"
                  onClick={() => handleSort("first_name")}
                >
                  <div className="flex items-center gap-2">
                    <span>First Name</span>
                    <div className="flex flex-col text-xs leading-[0.8rem]">
                      <span
                        className={`${
                          sortField === "first_name" && sortOrder === "asc"
                            ? "text-[#1A2D43]"
                            : "text-gray-400"
                        }`}
                      >
                        ▲
                      </span>
                      <span
                        className={`${
                          sortField === "first_name" && sortOrder === "desc"
                            ? "text-[#1A2D43]"
                            : "text-gray-400"
                        }`}
                      >
                        ▼
                      </span>
                    </div>
                  </div>
                </th>
                {/* <th className="py-2 px-4 whitespace-nowrap">Last Name</th> */}
                <th
                  className="py-2 px-4 whitespace-nowrap cursor-pointer select-none"
                  onClick={() => handleSort("last_name")}
                >
                  <div className="flex items-center gap-2">
                    <span>Last Name</span>
                    <div className="flex flex-col text-xs leading-[0.8rem]">
                      <span
                        className={`${
                          sortField === "last_name" && sortOrder === "asc"
                            ? "text-[#1A2D43]"
                            : "text-gray-400"
                        }`}
                      >
                        ▲
                      </span>
                      <span
                        className={`${
                          sortField === "last_name" && sortOrder === "desc"
                            ? "text-[#1A2D43]"
                            : "text-gray-400"
                        }`}
                      >
                        ▼
                      </span>
                    </div>
                  </div>
                </th>
                <th className="py-2 px-2">Type</th>
                {/* <th className="py-2 px-4">Address</th> */}
                <th className="py-2 px-4">City</th>
                <th className="py-2 px-4">State</th>
                <th className="py-2 px-4">ZIP</th>
                <th className="py-2 px-4">Phone #</th>
                {/* <th className="py-2 px-4 w-32 truncate">Email</th> */}
                <th
                  className="py-2 px-4 whitespace-nowrap select-none"
                  // onClick={() => handleSort("email")}
                >
                  <div className="flex items-center gap-2">
                    <span>Email</span>
                    {/* <div className="flex flex-col text-xs leading-[0.8rem]">
                      <span
                        className={`${
                          sortField === "email" && sortOrder === "asc"
                            ? "text-[#1A2D43]"
                            : "text-gray-400"
                        }`}
                      >
                        ▲
                      </span>
                      <span
                        className={`${
                          sortField === "email" && sortOrder === "desc"
                            ? "text-[#1A2D43]"
                            : "text-gray-400"
                        }`}
                      >
                        ▼
                      </span>
                    </div> */}
                  </div>
                </th>
                <th className="py-2 px-1">Status</th>
                <th className="py-2 px-2 rounded-tr-md">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {employees?.length === 0 ? (
                <tr className="">
                  <td colSpan="12" className="text-center p-4 text-gray-500">
                    No data found
                  </td>
                </tr>
              ) : (
                employees?.map((row, index) => (
                  <tr
                    key={row?.id}
                    className="hover:bg-gray-50 border-t border-gray-100 text-sm"
                  >
                    <td className="px-4 py-3">{row?.snf}</td>

                    {/* First Name with Avatar */}
                    <td className=" py-3">
                      <div className="flex items-center gap-2">
                        {row?.User?.image_url && (
                          <img
                            src={`${IMAGE_BASE_URL}${row?.User?.image_url}`}
                            alt={row?.User?.first_name}
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        {!row?.User?.image_url && (
                          <div
                            className={`w-9 h-9 rounded-full bg-[#008CC8] flex items-center justify-center text-white text-sm font-medium`}
                          >
                            {row.User.first_name.charAt(0).toUpperCase()}
                            {row?.User?.last_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium text-gray-900">
                          {row?.User?.first_name}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">{row?.User?.last_name}</td>

                    <td className="px-2 py-3">
                      {row?.type && (
                        <div
                          className={`w-7 h-7 rounded-full text-white ${
                            row?.type == "A" ? "bg-[#008CC8]" : "bg-[#1A2D43]"
                          } flex items-center justify-center text-xs font-semibold`}
                        >
                          {row.type}
                        </div>
                      )}
                    </td>

                    {/* <td className="px-4 py-3 text-sm">
                      {`${row?.address_1 || ""} ${row?.address_2 || ""}`}
                    </td> */}

                    <td className="px-4 py-3">{row.city}</td>
                    <td className="px-4 py-3">{row.state}</td>
                    <td className="px-4 py-3">{row.postal_code}</td>

                    {/* Phone numbers */}
                    <td className="px-4 py-3 text-gray-900 text-sm leading-relaxed">
                      {row?.mobile_phone && (
                        <div className="flex items-center gap-2">
                          <span className="text-[#F67C1A] font-semibold">
                            M
                          </span>
                          <span>{row.mobile_phone}</span>
                        </div>
                      )}
                      {row?.phone && (
                        <div className="flex items-center gap-2">
                          <span className="text-[#23AA4D] font-semibold">
                            H
                          </span>
                          <span>{row.phone}</span>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 w-2 truncate">
                      {row?.User?.email}
                    </td>

                    <td className="px-1 py-3">{getStatusStyle(row?.status)}</td>
                    <td className="px-2 py-3 text-center">
                      <button
                        onClick={() => navigate(`/employees/add/${row.id}`)}
                        className="p-1 rounded-md text-xs cursor-pointer border border-[#E6E6E6]"
                      >
                        <img src={EditIcon} alt="" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employees;
