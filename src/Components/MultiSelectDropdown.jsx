import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaTimes } from "react-icons/fa";

/**
 * props:
 * @param {string} label — Label text above the dropdown
 * @param {Object[]} options — List of all available options (each must have `id` and `description`)
 * @param {Object[]} selected — Currently selected items (same shape as options)
 * @param {function} setSelected — Setter function for selected values
 */
const MultiSelectDropdown = ({
  label,
  options = [],
  selected,
  setSelected,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    if (!selected.some((item) => item.id === option.id)) {
      setSelected([...selected, option]);
    }
  };

  const handleRemove = (option) => {
    setSelected(selected.filter((item) => item.id !== option.id));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mb-6 relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-semibold mb-2">{label}</label>
      )}

      <div
        className="flex flex-wrap gap-2 border border-gray-300 rounded-lg px-4 py-3 text-sm cursor-pointer relative"
        onClick={toggleDropdown}
      >
        {selected.length === 0 && (
          <span className="text-gray-400">Select restrictions...</span>
        )}

        {selected.map((item) => (
          <span
            key={item.id}
            className="bg-gray-100 border border-gray-200 flex items-center gap-1 rounded-md px-3 py-2"
            onClick={(e) => e.stopPropagation()}
          >
            {item.description}
            <FaTimes
              className="cursor-pointer text-xs"
              onClick={() => handleRemove(item)}
            />
          </span>
        ))}

        <FaChevronDown className="absolute top-4 right-4 text-gray-400 pointer-events-none" />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-48 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.id}
              className={`px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm ${
                selected.some((item) => item.id === option.id)
                  ? "bg-blue-50"
                  : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
