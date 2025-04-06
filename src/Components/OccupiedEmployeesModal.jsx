import React from "react";
import { IoCloseSharp } from "react-icons/io5";

const OccupiedEmployeesModal = ({ isOpen, onClose, newSchedule }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-[450px] relative transition-all duration-300 ease-in-out scale-100">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <IoCloseSharp size={22} />
        </button>

        {/* Modal Title */}
        <h3 className="text-xl font-semibold text-gray-800 my-4 text-center">
          Some Employees Are Already Occupied
        </h3>
        <hr className="text-gray-300" />

        {/* Employee List */}
        <div className="max-h-[30vh] overflow-y-auto pr-2">
          <ul className="space-y-4 my-3">
            {newSchedule?.occupiedEmployees?.map((emp) => (
              <li key={emp.id} className="flex items-center space-x-4">
                {/* Employee Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-lg">
                  {emp.image_url ? (
                    <img
                      src={emp.image_url}
                      alt={emp.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    emp.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  )}
                </div>
                {/* Employee Name */}
                <span className="text-gray-700 font-medium text-lg">
                  {emp.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {newSchedule?.scheduledData && (
          <div>
            <small>Created schedules for those employees available *</small>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-6 cursor-pointer bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 w-full transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OccupiedEmployeesModal;
