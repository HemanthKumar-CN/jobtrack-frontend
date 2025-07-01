import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getScheduleByToken,
  respondToSchedule,
} from "../redux/slices/authSlice";
import { format } from "date-fns";
import { useToast } from "../Components/Toast/ToastContext";

export default function ScheduleResponse() {
  const dispatch = useDispatch();

  const { responseToken } = useParams();
  const showToast = useToast();

  const { tokenSchedule, tokenScheduleLoading, tokenScheduleError } =
    useSelector((state) => state.auth);

  useEffect(() => {
    if (responseToken) {
      dispatch(getScheduleByToken(responseToken));
    }
  }, [responseToken, dispatch]);

  const handleResponse = (response) => {
    dispatch(respondToSchedule({ responseToken, response }))
      .unwrap()
      .then(() => {
        showToast("Schedule updated successfully", "success");

        dispatch(getScheduleByToken(responseToken));
      })
      .catch((err) => {
        console.log(err);
        showToast(
          `Failed to update schedule: Try after some time ${err}`,
          "error",
        );
      });
  };

  if (tokenScheduleLoading)
    return <div className="text-center p-6">Loading schedule...</div>;

  if (tokenSchedule?.status !== "pending") {
    console.log("Going to if statement ---");
    return (
      <div
        className={`min-h-screen flex flex-col justify-center items-center px-6 py-12 ${
          tokenSchedule?.status === "confirmed"
            ? "bg-[#E6F6EF]"
            : "bg-[#FDEAEA]"
        }`}
      >
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center border">
          <h1
            className={`text-2xl font-bold mb-4 ${
              tokenSchedule?.status === "confirmed"
                ? "text-[#00AD3A]"
                : "text-red-600"
            }`}
          >
            You have{" "}
            {tokenSchedule?.status === "confirmed" ? "accepted" : "declined"}{" "}
            the schedule
          </h1>

          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {tokenSchedule?.start_time &&
                format(
                  new Date(tokenSchedule?.start_time),
                  "MMM dd, yyyy — h:mm a",
                )}
            </p>

            <p>
              <span className="font-semibold">Location:</span>{" "}
              {tokenSchedule?.location || "N/A"}
            </p>
          </div>

          <div className="mt-6 text-gray-500 text-xs">
            Contact your admin for any support.
          </div>
        </div>
      </div>
    );
  } else {
    console.log(
      "Going to else statement",
      !tokenSchedule?.status == "pending",
      tokenSchedule?.status,
    );
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#F9FAFB] px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
          <h2 className="text-xl font-bold text-[#1A2D43] mb-3">
            🗓️ You have a new task scheduled
          </h2>

          <div className="text-sm text-gray-700 space-y-3">
            <p>
              <span className="font-semibold text-[#1A2D43]">Event:</span>{" "}
              {tokenSchedule?.event_name}
            </p>
            <p>
              <span className="font-semibold text-[#1A2D43]">Location:</span>{" "}
              {tokenSchedule?.location}
            </p>
            <p>
              <span className="font-semibold text-[#1A2D43]">Contractor:</span>{" "}
              {tokenSchedule?.contractor}
            </p>
            <p>
              <span className="font-semibold text-[#1A2D43]">Comment:</span>{" "}
              {tokenSchedule?.comment || "No comments"}
            </p>
            <p>
              <span className="font-semibold text-[#1A2D43]">
                Scheduled at:
              </span>{" "}
              {tokenSchedule?.start_time &&
                format(
                  new Date(tokenSchedule?.start_time),
                  "MMM dd, yyyy — h:mm a",
                )}
            </p>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => handleResponse("confirmed")}
              className="px-5 py-2 rounded-md text-white bg-[#00AD3A] hover:bg-[#00AD3A]/90 transition-colors text-sm font-medium cursor-pointer"
            >
              ✅ Yes
            </button>
            <button
              onClick={() => handleResponse("declined")}
              className="px-5 py-2 rounded-md text-white bg-[#DC2626] hover:bg-[#DC2626]/90 transition-colors text-sm font-medium cursor-pointer"
            >
              ❌ No
            </button>
          </div>
        </div>
      </div>
    );
  }
}
