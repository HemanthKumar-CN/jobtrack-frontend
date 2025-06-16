import React, { useState } from "react";
import { CiFilter, CiSettings } from "react-icons/ci";
import { PiListChecksBold } from "react-icons/pi";
import { RiArrowGoBackLine } from "react-icons/ri";
import { BsFileEarmarkArrowDown } from "react-icons/bs";
import { TbCalendarPlus } from "react-icons/tb";
import { TbEdit } from "react-icons/tb";
import { SiTicktick } from "react-icons/si";

const Confirmed = ({ activeTab }) => {
  const [editingRowId, setEditingRowId] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const appointments = [
    {
      id: 1,
      name: "Cameron Williamson",
      phone: "312-921-6724",
      capacity: "Limited lifting capacity",
      status: "Pending",
      event: "None",
      location: "None",
      class: "None",
      startTime: "None",
    },
    {
      id: 2,
      name: "Guy Hawkins",
      phone: "312-921-6724",
      capacity: "Restricted hours",
      status: "Done",
      event: "None",
      location: "None",
      class: "None",
      startTime: "None",
    },
    {
      id: 3,
      name: "Robert Fox",
      phone: "312-921-6724",
      capacity: "Limited lifting capacity",
      status: "Cancel",
      event: "None",
      location: "None",
      class: "None",
      startTime: "None",
    },
    {
      id: 4,
      name: "Annette Black",
      phone: "312-921-6724",
      capacity: "No physical limitations",
      status: "Done",
      event: "None",
      location: "None",
      class: "None",
      startTime: "None",
    },
    {
      id: 5,
      name: "Cameron Williamson",
      phone: "312-921-6724",
      capacity: "Limited lifting capacity",
      status: "Pending",
      event: "None",
      location: "None",
      class: "None",
      startTime: "None",
    },
    {
      id: 6,
      name: "Cody Fisher",
      phone: "312-921-6724",
      capacity: "Restricted hours",
      status: "Done",
      event: "None",
      location: "None",
      class: "None",
      startTime: "None",
    },
    {
      id: 7,
      name: "Devon Lane",
      phone: "312-921-6724",
      capacity: "Limited lifting capacity",
      status: "Pending",
      event: "None",
      location: "None",
      class: "None",
      startTime: "None",
    },
    {
      id: 8,
      name: "Cody Fisher",
      phone: "312-921-6724",
      capacity: "No physical limitations",
      status: "Done",
      event: "None",
      location: "None",
      class: "None",
      startTime: "None",
    },
    {
      id: 9,
      name: "Robert Fox",
      phone: "312-921-6724",
      capacity: "Limited lifting capacity",
      status: "Cancel",
      event: "None",
      location: "None",
      class: "None",
      startTime: "None",
    },
    {
      id: 10,
      name: "Cody Fisher",
      phone: "312-921-6724",
      capacity: "Restricted hours",
      status: "Done",
      event: "None",
      location: "None",
      class: "None",
      startTime: "None",
    },
    {
      id: 11,
      name: "Robert Fox",
      phone: "312-921-6724",
      capacity: "Limited lifting capacity",
      status: "Cancel",
      event: "None",
      location: "None",
      class: "None",
      startTime: "None",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancel":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvatarColor = (index) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
    ];
    return colors[index % colors.length];
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-auto">
      <div className="">
        <div className="bg-white rounded-lg border border-gray-200 p-4 px-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 flex flex-col gap-4">
              <span className="font-semibold">{activeTab}</span>
              <span>
                Total: 77, Available: 26, Limited: 25, Unavailable: 26
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <button className="flex items-center cursor-pointer space-x-2 px-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <PiListChecksBold className="w-4 h-4 border p-[0.01em] rounded-sm text-[#008CC8]" />
                <span className="text-xs">Select All</span>
              </button>
              <button className="flex items-center cursor-pointer space-x-2 px-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <RiArrowGoBackLine className="w-4 h-4 border p-[0.08em] rounded-sm" />
                <span className="text-xs">Show Previous Assignments</span>
              </button>
              <button className="flex items-center cursor-pointer space-x-2 px-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <BsFileEarmarkArrowDown className="w-4 h-4" />
                <span className="text-xs">Get Previous Assignments</span>
              </button>
              <button className="flex items-center cursor-pointer space-x-2 px-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <TbCalendarPlus className="w-4 h-4" />
                <span className="text-xs">Recommend Scheduled</span>
              </button>
              <button className="flex items-center cursor-pointer space-x-2 px-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <TbCalendarPlus className="w-4 h-4" />
                <span className="text-xs">Schedule Selected</span>
              </button>
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="p-2 border cursor-pointer border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <CiFilter className="w-4 h-4" />
              </button>
            </div>
          </div>
          {
            <div
              className={`transition-all duration-300 ease-in-out transform ${
                showFilter
                  ? "opacity-100 translate-y-0 scale-100 h-full mt-2 p-4"
                  : "opacity-0 -translate-y-2 scale-95 pointer-events-none h-0"
              } bg-gray-100 rounded-lg`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Event Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Event
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Filter by event...</option>
                    <option value="loc1">Event A</option>
                    <option value="loc2">Event B</option>
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Filter by location</option>
                    <option value="loc1">Location A</option>
                    <option value="loc2">Location B</option>
                  </select>
                </div>

                {/* Availability Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Availability
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All</option>
                    <option value="available">Available</option>
                    <option value="limited">Limited</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
      <div className="min-w-[52vw]">
        {/* Header */}
        <div
          className="grid items-center bg-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3"
          style={{
            gridTemplateColumns:
              "0.3fr 1.7fr 1fr 1fr 1fr 1fr 1fr 1fr 1.5fr 0.5fr",
          }}
        >
          <div>S/N</div>
          <div>Name</div>
          <div>Status</div>
          <div>Restrictions</div>
          <div>Event</div>
          <div>Location</div>
          <div>Class</div>
          <div>Start Time</div>
          <div>Comments</div>
          <div>Action</div>
        </div>

        {/* Rows */}
        {appointments.map((appointment, index) => (
          <div
            key={appointment.id}
            className="grid items-center border-t text-sm border-gray-200 px-4 py-4 hover:bg-gray-50"
            style={{
              gridTemplateColumns:
                "0.3fr 1.7fr 1fr 1fr 1fr 1fr 1fr 1fr 1.5fr 0.5fr",
            }}
          >
            {/* S/N */}
            <div>{index + 1}</div>

            {/* Name with avatar */}
            <div className="flex items-center space-x-3 overflow-hidden">
              <div
                className={`w-8 h-8 rounded-full ${getAvatarColor(
                  index,
                )} flex items-center justify-center text-white text-sm font-medium shrink-0`}
              >
                {appointment.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {appointment.name}
                </div>
                <div className="text-gray-500 text-xs truncate">
                  {appointment.phone}
                </div>
              </div>
            </div>

            {/* Capacity */}
            <div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                  appointment.status,
                )}`}
              >
                {appointment.status}
              </span>
            </div>

            {/* Restrictions */}
            <div>
              <span
                className={`inline-flex py-1 text-xs font-medium rounded-full `}
              >
                {appointment.capacity}
              </span>
            </div>

            {/* Event */}
            <div>
              {editingRowId === appointment.id ? (
                <select className="w-3/4 text-sm border border-gray-300 rounded px-2 py-1 bg-white">
                  <option>None</option>
                </select>
              ) : (
                <span
                  className={`inline-flex py-1 text-xs font-medium rounded-full `}
                >
                  {appointment.event}
                </span>
              )}
            </div>

            {/* Location */}
            <div>
              {editingRowId === appointment.id ? (
                <select className="w-3/4 text-sm border border-gray-300 rounded px-2 py-1 bg-white">
                  <option>None</option>
                </select>
              ) : (
                <span
                  className={`inline-flex py-1 text-xs font-medium rounded-full `}
                >
                  {appointment.location}
                </span>
              )}
            </div>

            {/* Class */}
            <div>
              {editingRowId === appointment.id ? (
                <select className="w-3/4 text-sm border border-gray-300 rounded px-2 py-1 bg-white">
                  <option>None</option>
                </select>
              ) : (
                <span
                  className={`inline-flex py-1 text-xs font-medium rounded-full `}
                >
                  {appointment.class}
                </span>
              )}
            </div>

            {/* Start Time */}
            <div>
              {editingRowId === appointment.id ? (
                <select className="w-3/4 text-sm border border-gray-300 rounded px-2 py-1 bg-white">
                  <option>None</option>
                </select>
              ) : (
                <span
                  className={`inline-flex py-1 text-xs font-medium rounded-full `}
                >
                  {appointment.startTime}
                </span>
              )}
            </div>

            {/* Comments */}
            <div>
              {editingRowId === appointment.id ? (
                <input
                  type="text"
                  placeholder="Enter comments..."
                  className="text-sm border border-gray-300 rounded px-2 py-1 w-full"
                />
              ) : (
                <span
                  className={`inline-flex py-1 text-xs font-medium rounded-full `}
                >
                  {appointment.comments || "No comments"}
                </span>
              )}
            </div>

            {/* Action */}
            <div className="flex justify-center">
              {editingRowId == appointment.id ? (
                <button
                  onClick={() => setEditingRowId(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <SiTicktick className="w-4 h-4 text-[#00AD3A] cursor-pointer" />
                </button>
              ) : (
                <button
                  onClick={() => setEditingRowId(appointment.id)}
                  className="p-2 text-gray-400 cursor-pointer hover:text-gray-600"
                >
                  <TbEdit className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Empty State */}
        {appointments.length === 0 && (
          <div className="text-center py-6 text-gray-500 text-sm border-t border-gray-200">
            No appointments found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Confirmed;
