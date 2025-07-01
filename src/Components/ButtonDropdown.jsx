import { useState, useRef, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { hidePreviousAssignments } from "../redux/slices/scheduleSlice";

export default function ButtonDropdown({
  show,
  onToggle,
  handleShowPreviousAssignments,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const dispatch = useDispatch();

  const handleHidePreviousAssignment = () => {
    dispatch(hidePreviousAssignments());
  };

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative inline-block items-center cursor-pointer space-x-2 px-1 py-1  border-gray-300 rounded-lg hover:bg-gray-50"
      ref={dropdownRef}
    >
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center px-1.5 py-2 text-xs font-medium  hover:bg-blue-200 rounded-md focus:outline-none cursor-pointer ${
          show ? "text-[#008CC8] bg-[#e6f3f9]" : " border border-gray-300"
        }`}
      >
        <FaEye className="mr-2" />
        {"Show Previous Assignments"}
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 rounded-md bg-white shadow-lg ">
          <div className="py-1">
            <button
              onClick={() => {
                if (handleShowPreviousAssignments()) {
                  onToggle(true);
                  setOpen(false);
                }
              }}
              className="flex items-center w-full px-1.5 py-3 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <FaEye className="mr-2" />
              Show Previous Assignments
            </button>
            <button
              onClick={() => {
                onToggle(false);
                setOpen(false);
                handleHidePreviousAssignment();
              }}
              className="flex items-center w-full px-1.5 py-3 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <FaEyeSlash className="mr-2" />
              Hide Previous Assignments
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
