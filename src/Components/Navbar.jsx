import React from "react";

import { FaBell, FaBars } from "react-icons/fa";
import grpLogo from "../assets/logoGrp.svg";
import { FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getHeaderAndBreadcrumb } from "../Utils/getHeaderAndBreadcrumb";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { heading, breadcrumb } = getHeaderAndBreadcrumb(location.pathname);

  const handleLogout = async () => {
    const result = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(result)) {
      navigate("/login");
    } else {
      console.error("Logout failed", result);
    }
  };
  return (
    <div className="flex  justify-between items-center bg-white shadow-md px-6 py-3">
      {/* Left Section - Page Title & Breadcrumbs */}

      {/* Logo Section */}
      <div className="flex w-1/3 justify-between items-end ">
        <div className="flex py-2">
          <img src={grpLogo} alt="React Logo" className="w-60" />
        </div>
        <div className="text-center  w-full">
          <h1 className="text-black text-[16px] font-[700] leading-[19.5px]">
            {heading}
          </h1>
          <span className="text-gray-500 text-[12px] font-[600] leading-[14.63px]">
            {breadcrumb}
          </span>
        </div>
      </div>

      {/* Right Section - Buttons & Profile */}
      <div className="flex items-center space-x-4 ">
        {location.pathname === "/events" && (
          <div className="flex space-x-4 border-r border-gray-300 pr-5">
            {/* Add an Event Button */}
            <Link to="/events/add">
              <button
                className="flex cursor-pointer items-center bg-[#3255F0] text-white px-4 py-2 rounded-md shadow-md 
          hover:bg-[#1F4BCC] transition font-montserrat font-bold text-[12px] leading-[14.63px] tracking-[0px]"
              >
                {/* <Plus size={18} className="mr-2" /> */}
                <BsFillPlusCircleFill className="mr-2 w-6 h-6" />
                Add an Event
              </button>
            </Link>
          </div>
        )}

        {location.pathname === "/schedules" && (
          <div className="flex space-x-4 border-r border-gray-300 pr-5">
            {/* Add an Event Button */}
            <Link to="/schedules/new-task">
              <button
                className="flex cursor-pointer items-center bg-[#3255F0] text-white px-4 py-2 rounded-md shadow-md 
          hover:bg-[#1F4BCC] transition font-montserrat font-bold text-[12px] leading-[14.63px] tracking-[0px]"
              >
                <BsFillPlusCircleFill className="mr-2 w-6 h-6" />
                Add a Task
              </button>
            </Link>
          </div>
        )}

        {location.pathname === "/locations" && (
          <div className="flex space-x-4 border-r border-gray-300 pr-5">
            {/* Add an Event Button */}
            <Link to="/locations/add">
              <button className="flex cursor-pointer items-center bg-[#3255F0] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#1F4BCC] transition font-montserrat font-bold text-[12px] leading-[14.63px] tracking-[0px]">
                <BsFillPlusCircleFill className="mr-2 w-6 h-6" /> Add a Location
              </button>
            </Link>
          </div>
        )}

        {location.pathname === "/employees" && (
          <div className="flex space-x-4 border-r border-gray-300 pr-5">
            <Link to="/employees/add">
              <button className="flex cursor-pointer items-center bg-[#3255F0] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#1F4BCC] transition font-montserrat font-bold text-[12px] leading-[14.63px] tracking-[0px]">
                <BsFillPlusCircleFill className="mr-2 w-6 h-6" /> Add an
                Employee
              </button>
            </Link>
          </div>
        )}

        {location.pathname === "/contractors" && (
          <div className="flex space-x-4 border-r border-gray-300 pr-5">
            <Link to="/contractors/add">
              <button className="flex cursor-pointer items-center bg-[#3255F0] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#1F4BCC] transition font-montserrat font-bold text-[12px] leading-[14.63px] tracking-[0px]">
                <BsFillPlusCircleFill className="mr-2 w-6 h-6" /> Add a
                Contractor
              </button>
            </Link>
          </div>
        )}

        {/* Notification Icon */}
        <button className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200">
          <FaBell className="text-gray-600 text-lg" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Picture */}
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Profile"
          className="w-9 h-9 rounded-full border-2 border-gray-300"
        />
        <div className="border-l border-gray-300 pl-7 ml-4">
          {" "}
          <FaSignOutAlt
            onClick={handleLogout}
            className="text-[#1869BB] cursor-pointer hover:text-[#5097dd] text-lg w-6 h-6"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
