import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

const CustomDropdown = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select",
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.id === value.id);

  return (
    <div className="relative bg-white rounded-xl shadow p-4" ref={wrapperRef}>
      <label className="text-sm text-gray-500">{label}</label>
      <div
        className="border border-gray-300 rounded-md px-3 py-2 mt-1 flex items-center justify-between cursor-pointer bg-white"
        onClick={() => setOpen(!open)}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <FaChevronDown className="ml-2 text-gray-400" />
      </div>

      {open && (
        <div className="absolute z-30 w-96 bg-white border border-gray-200 mt-1 rounded-md shadow max-h-48 overflow-y-auto custom-scrollbar">
          {options.map((opt) => (
            <div
              key={opt.id}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`px-3 py-2 hover:bg-blue-100 cursor-pointer ${
                value === opt.id ? "bg-blue-50 text-blue-700 font-medium" : ""
              }`}
            >
              {opt.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
