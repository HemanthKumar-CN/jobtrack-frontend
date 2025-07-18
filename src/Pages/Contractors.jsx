import { useCallback, useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { BiSolidChevronRight } from "react-icons/bi";
import { truncateText } from "../Utils/truncateText";
import { FaPen } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteContractor,
  fetchContractors,
  resetContractors,
} from "../redux/slices/contractorsSlice";
import { useToast } from "../Components/Toast/ToastContext";
import { useModal } from "../Components/Modal/ModalProvider";
import { useNavigate } from "react-router-dom";
import Tooltip from "../Components/Tooltip";
import collapsedLogo from "../assets/collapsedLogo.svg";

const Contractors = () => {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null); // Track clicked row
  const [sortField, setSortField] = useState("company_name"); // which field
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc

  const dispatch = useDispatch();
  const searchRef = useRef(null);
  const [page, setPage] = useState(1);
  const observer = useRef();
  const listRef = useRef(null); // Track scroll position

  const showToast = useToast();
  const { openModal } = useModal();

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { contractors, loading, error, totalPages } = useSelector(
    (state) => state.contractors,
  );

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
    setSearch(searchRef.current?.value);
    setPage(1);
  };

  useEffect(() => {
    if (page <= totalPages) {
      const prevScrollHeight = listRef.current?.scrollHeight; // Store scroll height before update
      dispatch(fetchContractors({ page, search, sortField, sortOrder })).then(
        () => {
          if (listRef.current) {
            listRef.current.scrollTop = 0; // Maintain position
          }
        },
      );
    }
  }, [dispatch, page, search, sortField, sortOrder]);

  // Intersection Observer for infinite scroll
  const lastContractorRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && page < totalPages) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, page, totalPages],
  );

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteContractor(id)).unwrap();
      showToast(`Contractor deleted successfully ${id}`, "success");
    } catch (error) {
      showToast(`Failed to delete Contractor: ${error}`, "error");
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

    setSearch(searchRef.current?.value);
    setPage(1);
  };

  return (
    <div className="p-2 pt-0 rounded-xl">
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
          className="w-full p-3 pr-10 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FiSearch
          onClick={handleSearch}
          className="absolute right-3 top-1/2 cursor-pointer transform -translate-y-1/2 
            text-gray-500 transition-all duration-200 hover:text-blue-600 hover:scale-110"
          size={18}
        />
      </div>

      <div className="p-1 bg-white rounded-xl shadow-md">
        {/* Table Headers */}
        <div
          className="grid bg-gray-100 p-3 font-semibold text-gray-700 rounded-md"
          style={{ gridTemplateColumns: "20% 20% 13% 12% 15% 20%" }}
        >
          <div
            className="flex items-center gap-1 cursor-pointer select-none"
            onClick={() => handleSort("company_name")}
          >
            Company Name
            <div className="flex flex-col ml-1">
              <span
                className={`leading-none text-xs ${
                  sortField === "company_name" && sortOrder === "asc"
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                ▲
              </span>
              <span
                className={`leading-none text-xs ${
                  sortField === "company_name" && sortOrder === "desc"
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                ▼
              </span>
            </div>
          </div>
          <div>Address</div>
          <div
            className="flex items-center gap-1 cursor-pointer select-none"
            onClick={() => handleSort("city")}
          >
            City
            <div className="flex flex-col ml-1">
              <span
                className={`leading-none text-xs ${
                  sortField === "city" && sortOrder === "asc"
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                ▲
              </span>
              <span
                className={`leading-none text-xs ${
                  sortField === "city" && sortOrder === "desc"
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
            onClick={() => handleSort("state")}
          >
            State
            <div className="flex flex-col ml-1">
              <span
                className={`leading-none text-xs ${
                  sortField === "state" && sortOrder === "asc"
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                ▲
              </span>
              <span
                className={`leading-none text-xs ${
                  sortField === "state" && sortOrder === "desc"
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                ▼
              </span>
            </div>
          </div>
          <div>Email</div>
          <div>Phone</div>
        </div>

        {/* Contractor List */}
        <div
          ref={listRef}
          className="mt-2 overflow-auto max-h-[60vh] h-[60vh] custom-scrollbar"
        >
          {contractors?.map((contractor, index) => {
            const address = `${contractor.address_1}, ${contractor.address_2}`;
            return (
              <div key={index} className="relative">
                {/* Apply blur effect to everything except the selected row */}
                {selectedIndex !== null && selectedIndex !== index && (
                  <div className="absolute inset-0  border-b-orange-800 bg-white/40 backdrop-blur-md rounded-md z-10"></div>
                )}

                {/* Row */}
                <div
                  ref={
                    index === contractors.length - 1 ? lastContractorRef : null
                  }
                  className={`grid items-center p-3 rounded-md transition relative ${
                    index % 2 === 0 ? "bg-[rgba(24,105,187,0.1)]" : "bg-white"
                  } ${
                    selectedIndex === index ? "shadow-lg bg-white z-40" : "z-20"
                  }`}
                  style={{ gridTemplateColumns: "18% 22% 13% 12% 15% 20%" }}
                >
                  <div className="flex items-center relative">
                    {/* <button
                      className={`p-1 cursor-pointer rounded-lg hover:bg-blue-400 hover:text-white ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-200"
                      }`}
                      onClick={() =>
                        setSelectedIndex(selectedIndex === index ? null : index)
                      }
                    >
                      <BiSolidChevronRight />
                    </button> */}
                    <Tooltip text={contractor.company_name}>
                      <div
                        className=" text-[#008CC8] cursor-pointer hover:underline hover:font-semibold"
                        onClick={() =>
                          navigate(`/contractors/details/${contractor.id}`)
                        }
                      >
                        {truncateText(contractor.company_name)}
                      </div>
                    </Tooltip>
                  </div>
                  <div>{truncateText(address, 25)}</div>
                  <div>{truncateText(contractor.city)}</div>
                  <div>{truncateText(contractor.state)}</div>
                  <Tooltip text={contractor.email}>
                    <div>{truncateText(contractor.email, 12)}</div>
                  </Tooltip>
                  <div className="flex items-center py-1 justify-between">
                    <span>{truncateText(contractor.phone)}</span>
                    <span className="flex items-center">
                      {/* <button
                        onClick={() =>
                          navigate(`/contractors/add/${contractor.id}`)
                        }
                        className="cursor-pointer border border-gray-300 p-2 mr-2 bg-white hover:bg-gray-200 rounded-lg transition"
                      >
                        <FaPen className="mr-2 text-blue-500" /> Edit
                      </button>
                      <button
                        onClick={() =>
                          openModal({
                            title: "Delete this item?",
                            message:
                              "This action is permanent and cannot be undone.",
                            onConfirm: () => handleDelete(contractor.id), // Call delete function inside modal
                            confirmText: "Delete",
                            cancelText: "Cancel",
                          })
                        }
                        className="flex items-center cursor-pointer w-full px-3 py-2 text-sm text-gray-700 hover:bg-red-100 rounded-b-lg"
                      >
                        <RiDeleteBin6Line className="mr-2 text-red-500" />{" "}
                        Delete
                      </button> */}

                      <button
                        onClick={() =>
                          navigate(`/contractors/details/${contractor.id}`)
                        }
                        className="cursor-pointer border border-gray-300 p-2 mr-2 bg-white hover:bg-gray-200 rounded-lg transition"
                      >
                        <FaPen className="text-blue-600 hover:scale-110 transition" />
                      </button>
                      <button
                        onClick={() =>
                          openModal({
                            title: "Delete this item?",
                            message:
                              "This action is permanent and cannot be undone.",
                            onConfirm: () => handleDelete(contractor.id), // Call delete function inside modal
                            confirmText: "Delete",
                            cancelText: "Cancel",
                          })
                        }
                        className="border border-gray-300 p-2 cursor-pointer bg-white hover:bg-gray-200 rounded-lg transition"
                      >
                        <RiDeleteBin6Line className="text-red-600 cursor-pointer hover:scale-110 transition" />
                      </button>
                    </span>
                  </div>
                </div>

                {/* Dropdown Menu */}
                {selectedIndex === index && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-10 top-10 bg-white shadow-lg rounded-lg w-32 z-50"
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Contractors;
