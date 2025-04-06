import React, { useState } from "react";
import { changePassword } from "../../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { useToast } from "../Toast/ToastContext";

const ChangePasswordModal = ({ setIsModalOpen }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 🟨 State to toggle password visibility

  const dispatch = useDispatch();
  const showToast = useToast();

  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("Fill all fields", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    try {
      await dispatch(changePassword({ currentPassword, newPassword })).unwrap();
      setIsModalOpen(false);
      showToast("Passwords updated successfully", "success");
    } catch (error) {
      console.error("Failed to update password", error);
      showToast("Passwords updation failed", "error");
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-40 flex items-center justify-center">
      <div className="bg-[#F4F7FE] p-6 rounded-xl shadow-xl w-96">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          🔐 Change Password
        </h2>

        <div className="space-y-3">
          {/* Input Fields */}
          <div className="bg-white p-2 rounded-md text-gray-600">
            <p className="text-gray-500 text-sm">Current Password</p>
            <input
              type={showPassword ? "text" : "password"} // 🟨 Toggle password visibility
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full bg-transparent outline-none text-gray-700 mt-1 text-sm"
            />
          </div>

          <div className="bg-white p-2 rounded-md text-gray-600">
            <p className="text-gray-500 text-sm">New Password</p>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full bg-transparent outline-none text-gray-700 mt-1 text-sm"
            />
          </div>

          <div className="bg-white p-2 rounded-md text-gray-600">
            <p className="text-gray-500 text-sm">Confirm Password</p>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full bg-transparent outline-none text-gray-700 mt-1 text-sm"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleSavePassword}
            className="px-4 py-2 cursor-pointer bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg shadow-md hover:scale-105 transition-transform"
          >
            Save
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 cursor-pointer bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
