import React, { useState } from "react";
import {
  CiSearch,
  CiFilter,
  CiCalendar,
  CiClock1,
  CiSettings,
} from "react-icons/ci";

const SchedulingInterface = () => {
  const [searchTerm, setSearchTerm] = useState("");

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
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-8">
            <button className="text-blue-600 border-b-2 border-blue-600 pb-2 font-medium">
              Not Schedule
            </button>
            <button className="text-gray-600 hover:text-gray-900 pb-2">
              Schedule
            </button>
            <button className="text-gray-600 hover:text-gray-900 pb-2">
              Pending
            </button>
            <button className="text-gray-600 hover:text-gray-900 pb-2">
              Confirmed
            </button>
            <button className="text-gray-600 hover:text-gray-900 pb-2">
              Decline
            </button>

            <div className="flex-1"></div>

            <div className="relative">
              <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Controls */}
        <div className="mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Not Scheduled</span>
                <br />
                <span>Total: 77-Avail: 26, Part-Avail: 25, Unavail: 26</span>
              </div>

              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <CiCalendar className="w-4 h-4" />
                  <span>Select All</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <CiClock1 className="w-4 h-4" />
                  <span>Show Previous Assignments</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <span>Recommend Scheduled</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <span>Schedule Selected</span>
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <CiFilter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S/N
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NAME
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CAPACITY
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RESTRICTIONS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    EVENT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    LOCATION
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CLASS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    START TIME
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    COMMENTS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment, index) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full ${getAvatarColor(
                            index,
                          )} flex items-center justify-center text-white text-sm font-medium mr-3`}
                        >
                          {appointment.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          appointment.status,
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.capacity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select className="text-sm border border-gray-300 rounded px-2 py-1 bg-white">
                        <option>None</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select className="text-sm border border-gray-300 rounded px-2 py-1 bg-white">
                        <option>None</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select className="text-sm border border-gray-300 rounded px-2 py-1 bg-white">
                        <option>None</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select className="text-sm border border-gray-300 rounded px-2 py-1 bg-white">
                        <option>None</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        placeholder="Enter comments..."
                        className="text-sm border border-gray-300 rounded px-2 py-1 w-32"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <CiSettings className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">1 - 4 of 69 entries</div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <span>&lt;</span>
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">
              1
            </button>
            <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">
              2
            </button>
            <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">
              3
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <span>&gt;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulingInterface;
