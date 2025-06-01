import React, { useState } from "react";
import {
  FaUserLock,
  FaCalendarAlt,
  FaCalendarCheck,
  FaHardHat,
  FaSignOutAlt,
} from "react-icons/fa";
import { CiLogout } from "react-icons/ci";

import { GrUserWorker } from "react-icons/gr";
import grpLogo from "../assets/logoGrp.png";
import collapsedLogo from "../assets/collapsedLogo.svg";

import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
  TbReportAnalytics,
} from "react-icons/tb";
import { HiLocationMarker } from "react-icons/hi";

import { BiSolidDashboard } from "react-icons/bi";
import { IoNotificationsSharp, IoSettingsOutline } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";

import { IoCall } from "react-icons/io5";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";

const Sidebar = ({ setCollapsed, collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
          icon: <FaCalendarAlt className="w-5 h-5 mr-3" />,
        },
        {
          menu: "Contact Info",
          path: "/contact",
          icon: <IoCall className="w-5 h-5 mr-3" />,
        },
        {
          menu: "Settings",
          path: "/settings",
          icon: <IoMdSettings className="w-5 h-5 mr-3" />,
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
          icon: <FaCalendarAlt className="w-5 h-5 mr-3" />,
        },
        {
          menu: "Employees",
          path: "/employees",
          icon: <FaUserLock className="w-5 h-5 mr-3" />,
        },
        {
          menu: "Events",
          path: "/events",
          icon: <FaCalendarCheck className="w-5 h-5 mr-3" />,
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
          icon: <TbReportAnalytics className="w-5 h-5 mr-3" />,
        },
        {
          menu: "Dashboard",
          path: "/dashboard",
          icon: <BiSolidDashboard className="w-5 h-5 mr-3" />,
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
          icon: <HiLocationMarker className="w-5 h-5 mr-3" />,
        },
        {
          menu: "Contractors",
          path: "/contractors",
          icon: <GrUserWorker className="w-5 h-5 mr-3" />,
        },
        {
          menu: "SMS Info",
          path: "/sms-info",
          icon: <IoNotificationsSharp className="w-5 h-5 mr-3" />,
        },
      ],
    },
  ];

  const handleLogout = async () => {
    const result = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(result)) {
      navigate("/login");
    } else {
      console.error("Logout failed", result);
    }
  };

  return (
    <div
      className={`transition-all duration-300 ease-in-out h-screen flex flex-col justify-between ${
        collapsed ? "w-[70px]" : "w-1/7 max-w-xs min-w-[180px]"
      } bg-[#1A2D43] border-r border-blue-700/20 p-4 `}
    >
      <div
        className={`flex justify-between items-center ${
          collapsed ? "" : "gap-2"
        } `}
      >
        <div className="">
          {collapsed ? (
            <img src={collapsedLogo} alt="calendar Logo" className="" />
          ) : (
            <img src={grpLogo} alt="React Logo" className="w-37" />
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="cursor-pointer text-2xl"
        >
          {!collapsed && (
            <TbLayoutSidebarLeftCollapse className=" text-white hover:text-[#008CC8] rounded-xs" />
          )}
        </button>

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="absolute cursor-pointer left-[70px] top-1/20 transform -translate-y-1/2 z-50 bg-[#008CC8] p-1 rounded-r-md border border-l-0 border-blue-700/20 hover:bg-[#008CC8] transition-colors"
          >
            <TbLayoutSidebarRightCollapse className="text-white" />
          </button>
        )}
      </div>

      {/* Sidebar Menu */}
      <div className="space-y-5">
        {menuItems.map(
          (section) =>
            roleName == section.role && (
              <div key={section.heading} className="mb-4">
                {!collapsed && (
                  <h3 className="text-sm font-semibold text-white/80 mb-4 uppercase border-b border-gray-500 pb-[1vh] ">
                    {section.heading}
                  </h3>
                )}
                <ul className="space-y-2">
                  {section.subSections.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`px-3 flex items-center gap-2.5 py-1 text-white text-sm ${
                          collapsed ? "rounded-full" : "rounded-[10px]"
                        } cursor-pointer transition-colors ${
                          location.pathname.includes(item.path)
                            ? "bg-[#008CC8] text-[#008CC8] sidebar-menu"
                            : "hover:text-black hover:bg-[#008CC8]"
                        } ${collapsed ? "justify-center " : "justify-start"}`}
                      >
                        {/* {item.icon} */}
                        <div
                          className={`flex justify-center items-center ${
                            collapsed ? "pl-3 py-1" : ""
                          }`}
                        >
                          {item.icon}
                        </div>
                        {collapsed ? "" : item.menu}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ),
        )}
      </div>

      <div className="">
        <Link
          to="/settings"
          className={`px-3 mb-3 flex items-center gap-2.5 py-2 text-white text-sm ${
            collapsed ? "rounded-full" : "rounded-[10px]"
          }  cursor-pointer transition-colors hover:text-[#008CC8] hover:bg-[#008CC8] ${
            collapsed ? "justify-center" : "justify-start"
          } ${
            location.pathname.includes("/settings")
              ? "bg-[#008CC8] text-[#008CC8] sidebar-menu"
              : "hover:text-black hover:bg-[#008CC8]"
          } `}
        >
          <div
            className={`flex justify-center items-center ${
              collapsed ? "pl-2.5" : ""
            } `}
          >
            <IoSettingsOutline className="w-5 h-5" />
          </div>
          <div>{!collapsed && "Settings"}</div>
        </Link>

        <button
          onClick={handleLogout}
          className={`px-3 w-full flex items-center gap-2.5 text-white text-sm rounded-[10px] cursor-pointer transition-colors   ${
            collapsed ? "justify-center" : "justify-start"
          }`}
        >
          <div
            className={` mr-0 flex-shrink-0 text-red-500 ${
              collapsed ? "pl-2.5" : ""
            }`}
          >
            <CiLogout className="w-5 h-5" />
          </div>
          <div className="text-red-500">{!collapsed && "Logout"}</div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
