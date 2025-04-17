import React, { useState } from "react";

const SmsInfo = () => {
  const [form, setForm] = useState({
    twilioId: "",
    twilioPassword: "",
    twilioEndpoint: "",
  });

  const [isEditable, setIsEditable] = useState(false);

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
      {/* Message Box */}
      <div className="bg-[#F1F6FB] text-gray-700 p-3 rounded-md">
        <p className="text-gray-500 mb-1.5">Outbound Message</p>
        <p className="text-sm text-semibold">
          You are scheduled for <strong>[Event]</strong> at{" "}
          <strong>[Location]</strong> from <strong>[Start Date]</strong> -{" "}
          <strong>[End Date]</strong>, <strong>[Start Time]</strong> -{" "}
          <strong>[End Time]</strong>
        </p>
      </div>

      <hr className="my-6 border-gray-300" />

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="bg-[#F1F6FB] p-4 rounded-xl">
          <label className="block text-gray-500 mb-1.5">
            Twilio Account ID
          </label>
          <input
            type="text"
            placeholder="Enter Twilio Account ID"
            disabled={!isEditable}
            className={`w-full rounded-md outline-none text-sm font-semibold p-2 transition ${
              isEditable
                ? "bg-white text-black border border-gray-300"
                : "bg-gray-100 text-gray-500 cursor-not-allowed"
            }`}
            value={form.twilioId}
            onChange={(e) => setForm({ ...form, twilioId: e.target.value })}
          />
        </div>

        <div className="bg-[#F1F6FB] p-4 rounded-xl">
          <label className="block text-gray-600 mb-1.5">Twilio Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            disabled={!isEditable}
            className={`w-full rounded-md outline-none text-sm font-semibold p-2 transition ${
              isEditable
                ? "bg-white text-black border border-gray-300"
                : "bg-gray-100 text-gray-500 cursor-not-allowed"
            }`}
            value={form.twilioPassword}
            onChange={(e) =>
              setForm({ ...form, twilioPassword: e.target.value })
            }
          />
        </div>

        <div className="bg-[#F1F6FB] p-4 rounded-xl">
          <label className="block text-gray-600 mb-1.5">Twilio Endpoint</label>
          <input
            type="text"
            disabled={!isEditable}
            placeholder="Enter here"
            className="w-full rounded-md outline-none text-sm text-semibold"
            value={form.twilioEndpoint}
            onChange={(e) =>
              setForm({ ...form, twilioEndpoint: e.target.value })
            }
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button className="bg-blue-600 text-white px-6 py-2 cursor-pointer rounded-md shadow hover:bg-blue-700">
          Save Details
        </button>
      </div>
    </div>
  );
};

export default SmsInfo;
