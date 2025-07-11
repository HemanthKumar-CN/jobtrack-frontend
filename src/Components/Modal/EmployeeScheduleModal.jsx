import React from "react";
import { format } from "date-fns";
import { FaTimes } from "react-icons/fa";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EmployeeScheduleModal = ({ event, onClose, formattedDate }) => {
  if (!event) return null;

  const address = `${event.Event.Location.name}, ${event.Event.Location.address_1}, ${event.Event.Location.address_2}, ${event.Event.Location.city}, ${event.Event.Location.state}, ${event.Event.Location.postal_code},`;

  return (
    <div className="fixed inset-0 bg-black/40  flex items-center justify-center p-4 mt-0">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <FaTimes size={18} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center mb-4">Task Details</h2>

        {/* Date & Time */}
        <div className="bg-[#f5f6f7] p-3 text-start rounded-md mb-4">
          <p className="text-sm font-semibold text-gray-600">Date & Time</p>
          <p className="text-md text-gray-800">
            {/* {format(
              new Date(event.start_date + "T" + event.start_time),
              "MMMM do yyyy 'at' hh:mm a",
            )} */}
            {formattedDate} at {event.start_time}
          </p>
        </div>

        {/* Task Title & Description */}
        <div className="bg-[#f5f6f7] p-3 text-start rounded-md mb-4">
          <p className="text-md font-semibold text-gray-800">{event.title}</p>
          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
        </div>

        {/* Address */}
        <div className="bg-[#f5f6f7] p-3 text-start rounded-md mb-4">
          <p className="text-sm font-semibold text-gray-600">Address</p>
          <p className="text-md text-gray-800">
            {address || "No address provided"}
          </p>
        </div>

        {}

        {/* Map Placeholder (Replace with actual image) */}
        <div className="rounded-md overflow-hidden flex justify-center">
          <img
            src={`${API_BASE_URL}${event.Event.Location.image_url}`} // Replace with actual map image
            alt="Event Location"
            className="w-3xs object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeScheduleModal;
