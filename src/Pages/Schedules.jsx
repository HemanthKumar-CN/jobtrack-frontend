import React, { useState } from "react";
import WeeklySchedule from "../Components/WeeklySchedule";
import DailySchedule from "../Components/DailySchedule";
import MonthlySchedule from "../Components/MonthlySchedule";

const Schedules = () => {
  const [renderCalendar, setRenderCalendar] = useState("Monthly");
  return (
    <div className=" flex-grow">
      {renderCalendar === "Weekly" && (
        <WeeklySchedule setRenderCalendar={setRenderCalendar} />
      )}
      {renderCalendar === "Daily" && (
        <DailySchedule setRenderCalendar={setRenderCalendar} />
      )}
      {renderCalendar === "Monthly" && (
        <MonthlySchedule setRenderCalendar={setRenderCalendar} />
      )}
    </div>
  );
};

export default Schedules;
