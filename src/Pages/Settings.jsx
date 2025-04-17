import React, { useEffect, useState } from "react";
import ProfileBg from "../assets/ProfileBg.svg";
import AvatarImage from "../assets/Oval.svg";
import { FaPen, FaSave } from "react-icons/fa";
import { TbMoodEdit } from "react-icons/tb";
import { useSelector, useDispatch } from "react-redux";
import { getUserProfile, uploadProfilePic } from "../redux/slices/userSlice";
import { useToast } from "../Components/Toast/ToastContext";
import ChangePasswordModal from "../Components/Modal/ChangePasswordModal";
import { updateNotificationPreference } from "../redux/slices/employeeSlice";
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const Settings = () => {
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);
  const [isNotificationEditable, setIsNotificationEditable] = useState(false);
  const [password, setPassword] = useState("***************");
  const [notificationPreference, setNotificationPreference] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const { profile, isLoading, error } = useSelector((state) => state.user);
  const { notificationPreference: notification } = useSelector(
    (state) => state.employees,
  );

  const dispatch = useDispatch();
  const showToast = useToast();

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setNotificationPreference(profile?.notification_preference);
    }
  }, [profile]);

  // Function to handle Save
  const handleSave = (field) => {
    if (field === "password") {
      setIsPasswordEditable(false);
      // API call to update password can go here
    } else if (field === "notification") {
      setIsNotificationEditable(false);
      // API call to update notification preference can go here
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    console.log(file, "TRying to upload", URL.createObjectURL(file));

    if (!file) return;

    setSelectedImage(URL.createObjectURL(file));

    try {
      await dispatch(uploadProfilePic(file)).unwrap();
      showToast("Profile image updated successfully", "success");
    } catch (error) {
      console.error("Failed Image updation", error);
      showToast(`Failed to update: ${error}`, "error");
    }
  };

  const handleNotificationPreference = async () => {
    console.log(notificationPreference, "????????.......");

    try {
      await dispatch(
        updateNotificationPreference(notificationPreference),
      ).unwrap();
      showToast("Notification preference updated successfully", "success");

      setIsNotificationEditable(false);
    } catch (error) {
      showToast("Notification preference updation failed", "error");
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto h-[30vh] bg-white rounded-lg shadow-md">
        {/* Background Image - Relative Container */}
        <div className="relative rounded-lg  ">
          <img
            src={ProfileBg}
            alt="Profile Background"
            className="w-full h-[20vh]  rounded-lg"
          />

          {/* Avatar - Positioned Relative to Image */}
          {/* <div className="absolute left-1/2 bottom-[-0.5em] transform -translate-x-1/2 w-20 h-20 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
            <img
              src={AvatarImage} // Replace with actual avatar URL
              alt="User Avatar"
              className="w-full h-full object-cover rounded-full"
            />
          </div> */}

          <div className="relative w-24 h-24 mx-auto -mt-24 ">
            {/* Profile Image */}
            <img
              src={
                selectedImage || profile?.image_url
                  ? `${IMAGE_BASE_URL}${profile.image_url}`
                  : AvatarImage
              }
              alt="Profile"
              className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
            />

            {/* Edit Icon (Appears on Hover) */}
            <label
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 hover:opacity-50 transition"
              htmlFor="fileInput"
            >
              <TbMoodEdit className="text-white text-2xl" />
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
        <div className="flex justify-center mt-3 text-gray-600">
          {profile?.first_name} {profile?.last_name}
        </div>
        <div className="flex justify-center text-gray-500 text-xs">
          Technician
        </div>
      </div>

      <div className="text-gray-700 my-3.5 text-xl">User Details</div>

      <div className="max-w-7xl mx-auto rounded-md p-6 mt-5 bg-white shadow-md">
        {/* Password Field */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <label className="text-gray-600 block">Password</label>
            <input
              type="password"
              value={password}
              disabled={!isPasswordEditable}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 p-2 border rounded-md w-80 ${
                isPasswordEditable
                  ? "border-gray-400"
                  : "border-transparent bg-gray-100"
              }`}
            />
          </div>
          {isPasswordEditable ? (
            <ChangePasswordModal setIsModalOpen={setIsPasswordEditable} />
          ) : (
            <button
              onClick={() => setIsPasswordEditable(true)}
              className="flex items-center cursor-pointer px-4 py-2 border border-gray-300 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              <FaPen className="text-gray-700 mr-2 cursor-pointer" /> Edit
            </button>
          )}
        </div>

        {/* Notification Preference Field */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-gray-600 block">
              Notification Preference
            </label>
            <div className="mt-2 space-x-4 flex">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="notification"
                  value="email"
                  checked={notificationPreference === "email"}
                  disabled={!isNotificationEditable}
                  onChange={() => setNotificationPreference("email")}
                  className="mr-2"
                />
                Email
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="notification"
                  value="sms"
                  checked={notificationPreference === "sms"}
                  disabled={!isNotificationEditable}
                  onChange={() => setNotificationPreference("sms")}
                  className="mr-2"
                />
                SMS
              </label>
            </div>
          </div>
          {isNotificationEditable ? (
            <button
              onClick={handleNotificationPreference}
              className="flex items-center cursor-pointer px-4 py-2 border border-gray-300 bg-green-500 text-white hover:bg-green-600 rounded-lg transition"
            >
              <FaSave className="mr-2 cursor-pointer" /> Save
            </button>
          ) : (
            <button
              onClick={() => setIsNotificationEditable(true)}
              className="flex cursor-pointer items-center px-4 py-2 border border-gray-300 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              <FaPen className="text-gray-700 mr-2 cursor-pointer" /> Edit
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Settings;
