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
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    if (hasMore) {
      const prevScrollHeight = listRef.current?.scrollHeight; // Store scroll height before update
      dispatch(fetchEmployees({ page, search })).then(() => {
        if (listRef.current) {
          listRef.current.scrollTop = 0; // Maintain position
        }
      });
    }
  }, [dispatch, page, search]);

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

  return (
    <div className="p-4 pt-0 rounded-xl ">
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
          style={{ gridTemplateColumns: "13vw 13vw 21vw 7vw 8vw 5vw 8vw" }}
        >
          <div>First Name</div>
          <div>Last Name</div>
          <div>Address</div>
          <div>City</div>
          <div>State</div>
          <div>Zip</div>
          <div>Type</div>
        </div>

        {/* Employee List */}
        <div
          ref={listRef}
          className="mt-2 overflow-auto max-h-[60vh] h-[60vh] custom-scrollbar"
        >
          {employees.map((employee, index) => {
            const formattedAddress = `${employee.address_1}, ${employee.address_2}`;
            return (
              <div key={index} className="relative">
                {selectedIndex !== null && selectedIndex !== index && (
                  <div className="absolute inset-0  border-b-orange-800 bg-white/40 backdrop-blur-md rounded-md z-10"></div>
                )}
                <div
                  ref={index === employees.length - 1 ? lastEmployeeRef : null} // Attach observer to last element
                  className={`grid grid-cols-7 items-center p-3 rounded-md  transition relative ${
                    index % 2 === 0 ? "bg-[rgba(24,105,187,0.1)]" : "bg-white"
                  } ${
                    selectedIndex === index ? "shadow-lg bg-white z-40" : "z-20"
                  }`}
                  style={{
                    gridTemplateColumns: "13vw 13vw 21vw 7vw 8vw 5vw 8vw",
                  }}
                >
                  <div className="flex items-center relative">
                    <button
                      className={`p-1 cursor-pointer rounded-lg hover:bg-blue-400 hover:text-white ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-200"
                      } `}
                      onClick={() =>
                        setSelectedIndex(selectedIndex === index ? null : index)
                      }
                    >
                      <BiSolidChevronRight className="" />
                    </button>
                    <div className="ml-4">
                      {truncateText(employee?.User?.first_name)}
                    </div>
                  </div>
                  <div>{truncateText(employee?.User?.last_name)}</div>
                  <div>{truncateText(formattedAddress, 30)}</div>
                  <div>{truncateText(employee.city)}</div>
                  <div>{truncateText(employee.state)}</div>
                  <div>{truncateText(employee.postal_code)}</div>
                  <div>{truncateText(employee.type)}</div>
                </div>

                {/* Dropdown Menu */}
                {selectedIndex === index && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-10 top-0 bg-white shadow-lg rounded-lg w-32 z-50"
                  >
                    <button
                      onClick={() => navigate(`/employees/add/${employee.id}`)}
                      className="flex items-center cursor-pointer w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-100 rounded-t-lg"
                    >
                      <FaPen className="mr-2 text-blue-500" /> Edit
                    </button>
                    <button
                      onClick={() =>
                        openModal({
                          title: "Delete this item?",
                          message:
                            "This action is permanent and cannot be undone.",
                          onConfirm: () => handleDeleteEmployee(employee.id), // Call delete function inside modal
                          confirmText: "Delete",
                          cancelText: "Cancel",
                        })
                      }
                      className="flex items-center cursor-pointer w-full px-3 py-2 text-sm text-gray-700 hover:bg-red-100 rounded-b-lg"
                    >
                      <RiDeleteBin6Line className="mr-2 text-red-500" /> Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Employees;
