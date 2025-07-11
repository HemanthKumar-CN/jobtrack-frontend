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

import CalendarLogo from "../assets/calendar.svg";
import EmployeeIcon from "../assets/profileUser.svg";
import EventIcon from "../assets/archiveBook.svg";
import ReportIcon from "../assets/activity.svg";
import DashboardIcon from "../assets/element3.svg";
import LocationIcon from "../assets/Group.svg";
import ContractorIcon from "../assets/profile.svg";
import SMSIcon from "../assets/message.svg";

import CloseSideBar from "../assets/arrowClose.svg";
import OpenSideBar from "../assets/arrowSquareRight.svg";

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
          // icon: <FaCalendarAlt className="w-5 h-5 mr-3" />,
          icon: <img src={CalendarLogo} alt="" className="" />,
        },
        {
          menu: "Employees",
          path: "/employees",
          // icon: <FaUserLock className="w-5 h-5 mr-3" />,
          icon: <img src={EmployeeIcon} alt="" />,
        },
        {
          menu: "Events",
          path: "/events",
          icon: <img src={EventIcon} alt="" />,
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
          icon: <img src={ReportIcon} alt="" />,
        },
        {
          menu: "Dashboard",
          path: "/dashboard",
          icon: <img src={DashboardIcon} alt="" />,
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
          icon: <img src={LocationIcon} alt="" />,
        },
        {
          menu: "Contractors",
          path: "/contractors",
          icon: <img src={ContractorIcon} alt="" />,
        },
        {
          menu: "SMS Info",
          path: "/sms-info",
          icon: <img src={SMSIcon} alt="" />,
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
            <img src={grpLogo} alt="React Logo" className="w-35" />
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="cursor-pointer text-2xl"
        >
          {!collapsed && (
            // <TbLayoutSidebarLeftCollapse className=" text-white hover:text-[#008CC8] rounded-xs" />
            <img
              src={CloseSideBar}
              alt=""
              className="w-5 cursor-pointer transition duration-200 hover:brightness-150"
            />
          )}
        </button>

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="absolute cursor-pointer left-[70px] top-1/20 transform -translate-y-1/2 z-50 bg-[#1A2D43] p-1 rounded-r-md border border-l-0 border-blue-700/20 hover:bg-[#1A2D43] transition-colors"
          >
            {/* <TbLayoutSidebarRightCollapse className="text-white" /> */}
            <img src={OpenSideBar} alt="" className="w-5" />
          </button>
        )}
      </div>

      {/* Sidebar Menu */}
      <div
        className={`flex flex-col flex-grow space-y-5 mt-7 ${
          roleName == "EMPLOYEE" ? "flex-1/2" : ""
        } `}
      >
        {menuItems.map(
          (section) =>
            roleName == section.role && (
              <div key={section.heading} className="mb-4">
                {!collapsed && (
                  <h3
                    className={`text-sm pl-3 font-semibold text-white/80 mb-4 uppercase ${
                      section.heading ? "border-b" : ""
                    } border-gray-500 pb-[1vh]`}
                  >
                    {section.heading}
                  </h3>
                )}
                <ul className="space-y-2">
                  {section.subSections.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`${
                          collapsed ? "px-1 " : "px-3 py-1.5"
                        } flex items-center gap-2.5 py-1 text-white text-md ${
                          collapsed ? "rounded-full" : "rounded-[10px]"
                        } cursor-pointer transition-colors ${
                          location.pathname.includes(item.path)
                            ? "bg-[#008CC8] text-[#008CC8] sidebar-menu"
                            : "hover:text-white hover:bg-[#008CC8]"
                        } ${collapsed ? "justify-center " : "justify-start"}`}
                      >
                        {/* {item.icon} */}
                        <div
                          className={`flex justify-center items-center ${
                            collapsed ? "p-1" : ""
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

      <div className="space-y-2">
        <Link
          to="/settings"
          className={`px-3 flex items-center gap-2.5 py-2 text-white text-md transition-colors ${
            collapsed
              ? "justify-center rounded-full"
              : "justify-start rounded-[10px]"
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
          className={`px-3 w-full flex items-center gap-2.5 text-white text-md rounded-[10px] cursor-pointer transition-colors   ${
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
