import React from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const OverlappingAvatars = ({ employees }) => {
  console.log(employees);
  return (
    <div className="flex -space-x-2 overflow-x-auto max-w-[80%] px-2  whitespace-nowrap">
      {employees.map((emp, index) => {
        // Extract initials from name
        const initials = emp.label
          .split(" ")
          .map((word) => word[0])
          .join("")
          .toUpperCase();

        return (
          <Tippy key={index} content={emp.label} placement="top" arrow={true}>
            <div className="relative flex-shrink-0">
              {emp.image_url && emp.image_url !== "null" ? (
                // Avatar with Image
                <img
                  src={emp.image_url}
                  alt={emp.label}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover shrink-0"
                />
              ) : (
                // Avatar with Initials
                <div className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-white bg-[#008CC8] text-sm font-semibold text-white shrink-0">
                  {initials}
                </div>
              )}
            </div>
          </Tippy>
        );
      })}
    </div>
  );
};

export default OverlappingAvatars;
