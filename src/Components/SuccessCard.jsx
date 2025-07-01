import { FaCheckCircle } from "react-icons/fa";
import { HiBadgeCheck } from "react-icons/hi";
import OverlappingAvatars from "./OverlappingAvatar";
import { convertToLocalDateTime } from "../Utils/convertToLocalDateTime";
import { useEffect, useState } from "react";
import OccupiedEmployeesModal from "./OccupiedEmployeesModal";
import { useSelector } from "react-redux";
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const SuccessCard = ({ title, fields, onBack, backButton, modalData }) => {
  const { newSchedule } = useSelector((state) => state.schedules);
  const [isOccupiedModalOpen, setIsOccupiedModalOpen] = useState(false);

  useEffect(() => {
    console.log(modalData, "modalData----===", newSchedule);

    if (modalData?.occupiedEmployees?.length > 0) {
      setIsOccupiedModalOpen(true);
    }
  }, [newSchedule]);

  return (
    <div className="flex relative items-center justify-center bg-gray-100 pb-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 pt-5 md:p-10 md:pt-5 max-w-2xl w-full">
        {/* Success Icon */}
        <div className="flex flex-col items-center">
          <HiBadgeCheck className="text-[#75BB2B] text-8xl" />
          <h2 className="text-xl font-semibold mt-2">{title}</h2>
        </div>

        {/* Display Dynamic Fields */}

        <div className="">
          {fields?.map((field, index) => {
            if (field.type == "image") {
              return (
                <div
                  key={index}
                  className="bg-gray-100 p-3 rounded-lg flex justify-center items-center"
                >
                  {/* <p className="text-gray-500 text-sm">{field.label}</p> */}
                  <img
                    src={`${IMAGE_BASE_URL}${field.value}`}
                    alt="Uploaded"
                    className="w-full max-w-[300px] h-auto object-contain mx-auto rounded-lg"
                  />
                </div>
              );
            }
          })}
          <div className="grid grid-cols-2 gap-4 mt-6 ">
            {fields?.map((field, index) => {
              if (field.type == "text") {
                return (
                  <div key={index} className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-gray-500 text-sm">{field.label}</p>
                    <p className="text-gray-800 font-medium">{field.value}</p>
                  </div>
                );
              } else if (field.type == "date") {
                console.log(field.value);
                const formattedDate = convertToLocalDateTime(field.value);

                return (
                  <div key={index} className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-gray-500 text-sm">{field.label}</p>
                    <p className="text-gray-800 font-medium">{formattedDate}</p>
                  </div>
                );
              } else if (field.type == "text-block") {
                return (
                  <div
                    key={index}
                    className="bg-gray-100 p-3 rounded-lg col-span-2"
                  >
                    <p className="text-gray-500 text-sm">
                      {field.value?.title}
                    </p>
                    <p className="text-gray-800 font-medium">
                      {field.value?.description}
                    </p>
                  </div>
                );
              } else if (field.type == "avatar") {
                return (
                  <div
                    key={index}
                    className="bg-gray-100 flex justify-between p-3 rounded-lg col-span-2"
                  >
                    <p className="text-gray-500 text-sm ">{field.label}</p>

                    {/* Overlapping Avatars with Fixed Width & Horizontal Scroll */}
                    <div className="w-1/2 overflow-x-auto">
                      <div className="flex space-x-[-10px]">
                        <OverlappingAvatars employees={field.value} />
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>

      {/* Occupied Employees Modal */}
      {newSchedule && (
        <OccupiedEmployeesModal
          isOpen={isOccupiedModalOpen}
          onClose={() => setIsOccupiedModalOpen(false)}
          newSchedule={newSchedule}
        />
      )}

      {/* Back Button */}
      <div className="mt-6 text-center absolute bottom-0">
        <button
          onClick={onBack}
          className="bg-[#008CC8] hover:bg-[#008cc8bb] cursor-pointer text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          {backButton}
        </button>
      </div>
    </div>
  );
};

export default SuccessCard;
