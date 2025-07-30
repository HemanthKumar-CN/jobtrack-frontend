import { useState, useRef, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { hidePreviousAssignments } from "../redux/slices/scheduleSlice";
import ShowPreviousBlue from "../assets/showPreviousBlue.svg";
import ShowPreviousBlack from "../assets/ShowPreviousBlack.svg";

export default function ButtonDropdown({
  show,
  onToggle,
  handleShowPreviousAssignments,
}) {
  const dispatch = useDispatch();

  const handleClick = () => {
    if (show) {
      // Hide previous assignments
      dispatch(hidePreviousAssignments());
      onToggle(false);
    } else {
      // Show previous assignments
      const shouldShow = handleShowPreviousAssignments();
      if (shouldShow) onToggle(true);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center cursor-pointer px-3 py-2 text-[13px] font-semibold rounded-md  hover:shadow-md transition ${
        show ? "text-[#008CC8] bg-[#e6f3f9]" : " bg-white"
      }`}
    >
      <img
        src={show ? ShowPreviousBlue : ShowPreviousBlack}
        alt=""
        className="mr-2 w-4 h-4"
      />
      {show ? "Hide Previous Assignments" : "Show Previous Assignments"}
    </button>
  );
}
