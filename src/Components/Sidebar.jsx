import React, { useState } from "react";
import {
  FaUserLock,
  FaCalendarAlt,
  FaCalendarCheck,
  FaHardHat,
} from "react-icons/fa";

import { GrUserWorker } from "react-icons/gr";

import { TbReportAnalytics } from "react-icons/tb";
import { HiLocationMarker } from "react-icons/hi";

import { BiSolidDashboard } from "react-icons/bi";
import { IoNotificationsSharp } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";

import { IoCall } from "react-icons/io5";

import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const location = useLocation();

  const { auth, roleName, isLoading, error } = useSelector(
    (state) => state.auth,
  );

  const menuItems = [
    {
      heading: "",
      role: "EMPLOYEE",
      subSections: [
        {
          menu: "My Schedule",
          path: "/mySchedule",
          icon: <FaCalendarAlt className="w-6 h-6 mr-3" />,
        },
        {
          menu: "Contact Info",
          path: "/contact",
          icon: <IoCall className="w-6 h-6 mr-3" />,
        },
        {
          menu: "Settings",
          path: "/settings",
          icon: <IoMdSettings className="w-6 h-6 mr-3" />,
        },
      ],
    },
    {
      heading: "Scheduling",
      role: "ADMIN",
      subSections: [
        {
          menu: "Schedules",
          path: "/schedules",
          icon: <FaCalendarAlt className="w-6 h-6 mr-3" />,
        },
        {
          menu: "Employees",
          path: "/employees",
          icon: <FaUserLock className="w-6 h-6 mr-3" />,
        },
        {
          menu: "Events",
          path: "/events",
          icon: <FaCalendarCheck className="w-6 h-6 mr-3" />,
        },
      ],
    },
    {
      heading: "Analytics",
      role: "ADMIN",
      subSections: [
        {
          menu: "Reports",
          path: "/reports",
          icon: <TbReportAnalytics className="w-6 h-6 mr-3" />,
        },
        {
          menu: "Dashboard",
          path: "/dashboard",
          icon: <BiSolidDashboard className="w-6 h-6 mr-3" />,
        },
      ],
    },
    {
      heading: "ADMIN",
      role: "ADMIN",
      subSections: [
        {
          menu: "Locations",
          path: "/locations",
          icon: <HiLocationMarker className="w-6 h-6 mr-3" />,
        },
        {
          menu: "Contractors",
          path: "/contractors",
          icon: <GrUserWorker className="w-6 h-6 mr-3" />,
        },
        {
          menu: "SMS Info",
          path: "/sms-info",
          icon: <IoNotificationsSharp className="w-6 h-6 mr-3" />,
        },
      ],
    },
  ];

  return (
    <div className="flex-none w-1/7 max-w-xs min-w-[180px] bg-[#3255F0] border-r border-blue-700/20 p-4 ">
      {/* Sidebar Menu */}
      <div className="space-y-8">
        {menuItems.map(
          (section) =>
            roleName == section.role && (
              <div key={section.heading} className="mb-4">
                <h3 className="text-sm font-semibold text-white/80 mb-4">
                  {section.heading}
                </h3>
                <ul className="space-y-2">
                  {section.subSections.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`px-3 flex font-bold items-center py-2 text-white text-sm rounded-[10px] cursor-pointer transition-colors ${
                          location.pathname.includes(item.path)
                            ? "bg-gray-100 text-[#3255F0] sidebar-menu"
                            : "hover:text-[#3255F0] hover:bg-gray-100"
                        }`}
                      >
                        {item.icon}
                        {item.menu}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ),
        )}
      </div>
    </div>
  );
};

export default Sidebar;
