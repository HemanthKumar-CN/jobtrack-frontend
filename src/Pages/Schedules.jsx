import React, { useEffect, useState } from "react";
import WeeklySchedule from "../Components/WeeklySchedule";
import DailySchedule from "../Components/DailySchedule";
import MonthlySchedule from "../Components/MonthlySchedule";
import SchedulingInterface from "./SchedulingInterface";
import { PiListChecksBold } from "react-icons/pi";
import { RiArrowGoBackLine } from "react-icons/ri";
import { BsFileEarmarkArrowDown } from "react-icons/bs";
import { TbCalendarPlus } from "react-icons/tb";

import {
  CiCalendar,
  CiClock1,
  CiFilter,
  CiSearch,
  CiSettings,
} from "react-icons/ci";
import { IoCalendarOutline } from "react-icons/io5";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import NotScheduled from "./NotScheduled";
import Scheduled from "./Scheduled";
import Pending from "./Pending";
import Confirmed from "./Confirmed";
import Declined from "./Declined";
import { useDispatch } from "react-redux";
import {
  fetchClassifications,
  fetchEventlist,
} from "../redux/slices/scheduleSlice";
import { fetchLocationsList } from "../redux/slices/dropDownSlice";
import CalendarInput from "../assets/calendarInput.svg";

const Schedules = () => {
  const [renderCalendar, setRenderCalendar] = useState("Monthly");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Not Scheduled");

  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const dispatch = useDispatch();

  const formattedDate = format(date, "EEEE, MMMM d, yyyy"); // Tuesday, May 20, 2025
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    dispatch(fetchClassifications());
    dispatch(fetchEventlist());
    dispatch(fetchLocationsList());
  }, []);

  return (
    <div className=" flex-grow">
      <div className="mb-2">
        <div className="p-1">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3 bg-white border-2 border-gray-200 rounded-xl p-1">
              <button
                className={`${
                  activeTab == "Not Scheduled"
                    ? "text-[#008CC8] bg-[#e6f3f9]"
                    : `text-gray-600 hover:text-gray-900`
                } p-2 rounded-lg cursor-pointer font-semibold `}
                onClick={() => handleTabClick("Not Scheduled")}
              >
                Not Scheduled
              </button>
              <button
                className={` p-2 rounded-lg font-semibold cursor-pointer ${
                  activeTab == "Scheduled"
                    ? "text-[#008CC8] bg-[#e6f3f9]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => handleTabClick("Scheduled")}
              >
                Scheduled
              </button>
              <button
                className={` cursor-pointer font-semibold rounded-lg p-2 ${
                  activeTab == "Pending"
                    ? "text-[#FF8000] bg-[#FF80001A]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => handleTabClick("Pending")}
              >
                Pending
              </button>
              <button
                className={`font-semibold cursor-pointer rounded-lg p-2 ${
                  activeTab == "Confirmed"
                    ? "text-[#00AD3A] bg-[#00AD3A1A]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => handleTabClick("Confirmed")}
              >
                Confirmed
              </button>
              <button
                className={`font-semibold cursor-pointer rounded-lg p-2 ${
                  activeTab == "Declined"
                    ? "text-[#E73F3F] bg-[#E73F3F1A]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => handleTabClick("Declined")}
              >
                Declined
              </button>
            </div>

            <div className="flex-1"></div>

            <div className="relative inline-block">
              {/* Input with icon inside */}
              <div
                className="flex items-center border border-gray-300 px-4 py-3 rounded-xl shadow-sm bg-white cursor-pointer w-72"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <input
                  type="text"
                  readOnly
                  value={formattedDate}
                  className="bg-transparent focus:outline-none flex-grow cursor-pointer rounded-lg font-semibold"
                />
                {/* <IoCalendarOutline className="text-xl text-gray-500 ml-2" /> */}
                <img src={CalendarInput} alt="" />
              </div>

              {showCalendar && (
                <div className="absolute z-50 mt-2">
                  <Calendar
                    onChange={(newDate) => {
                      setDate(newDate);
                      setShowCalendar(false);
                    }}
                    value={date}
                  />
                </div>
              )}
            </div>

            <div className="relative">
              <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border bg-white border-gray-300 rounded-xl placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#008CC8] focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {activeTab == "Not Scheduled" && (
        <NotScheduled
          activeTab={activeTab}
          formattedDate={formattedDate}
          setActiveTab={setActiveTab}
          searchTerm={searchTerm}
        />
      )}

      {activeTab == "Scheduled" && (
        <Scheduled
          activeTab={activeTab}
          formattedDate={formattedDate}
          setActiveTab={setActiveTab}
          searchTerm={searchTerm}
        />
      )}

      {activeTab == "Pending" && (
        <Pending
          activeTab={activeTab}
          formattedDate={formattedDate}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab == "Confirmed" && (
        <Confirmed
          activeTab={activeTab}
          formattedDate={formattedDate}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab == "Declined" && (
        <Declined
          activeTab={activeTab}
          formattedDate={formattedDate}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
};

export default Schedules;
