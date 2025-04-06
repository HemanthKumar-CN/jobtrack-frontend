import { useEffect, useRef, useState } from "react";
import { FaPen } from "react-icons/fa";
import { FiEdit2, FiSearch } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { deleteEvent, fetchEvents } from "../redux/slices/eventSlice";
import { truncateText } from "../Utils/truncateText";
import { useNavigate } from "react-router-dom";
import { useModal } from "../Components/Modal/ModalProvider";
import { useToast } from "../Components/Toast/ToastContext";
import { formatDateTimeLocal } from "../Utils/formatDateTimeLocal";

const Events = () => {
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const showToast = useToast();

  const { events } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents(search));
  }, [dispatch, search]);

  const handleSearch = () => {
    setSearch(searchRef.current?.value);
  };

  const handleDeleteEvent = async (id) => {
    try {
      await dispatch(deleteEvent(id)).unwrap();
      showToast(`Event deleted successfully ${id}`, "success");
    } catch (error) {
      showToast(`Failed to delete Event: ${error}`, "error");
    }
  };

  return (
    <>
      {/* Search Bar */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search"
          ref={searchRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          // onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 pr-10 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FiSearch
          onClick={handleSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          size={18}
        />
      </div>

      <div className="p-1 bg-white rounded-xl shadow-md">
        {/* Headers */}
        <div
          className="grid bg-gray-100 p-3 font-semibold text-gray-700 rounded-md"
          style={{ gridTemplateColumns: "25% 20% 20% 15% 20%" }}
        >
          <div>Event Name</div>
          <div>Location</div>
          <div>Contractors</div>
          <div>Start Date</div>
          <div>End Date</div>
        </div>

        {/* Event List */}
        <div className="mt-2 overflow-auto max-h-[60vh] custom-scrollbar">
          {events.map((event, index) => {
            return (
              <div
                key={index}
                style={{ gridTemplateColumns: "25% 20% 20% 15% 20%" }}
                className={`grid items-center rounded-md ${
                  index % 2 === 0 ? "bg-[rgba(24,105,187,0.1)]" : "bg-white"
                }`}
              >
                <div className="border border-white p-3 py-4.5">
                  {truncateText(event.event_name)}
                </div>
                <div className="border border-white p-3 py-4.5">
                  {truncateText(event?.Location?.name)}
                </div>
                <div className="border border-white p-3 py-4.5 font-semibold">
                  {truncateText(event.Contractor?.company_name)}
                </div>
                <div className="border border-white p-3 py-4.5 font-semibold">
                  {formatDateTimeLocal(event.start_date)}
                </div>
                <div className=" border border-white p-3 flex justify-between items-center">
                  <span className="font-semibold">
                    {" "}
                    {formatDateTimeLocal(event.end_date)}
                  </span>
                  <span>
                    <button
                      onClick={() =>
                        openModal({
                          title: "Delete this item?",
                          message:
                            "This action is permanent and cannot be undone.",
                          onConfirm: () => handleDeleteEvent(event.id), // Call delete function inside modal
                          confirmText: "Delete",
                          cancelText: "Cancel",
                        })
                      }
                      className="border border-gray-300 p-2 mr-3 cursor-pointer bg-white hover:bg-gray-200 rounded-lg transition"
                    >
                      <RiDeleteBin6Line className="text-red-600 cursor-pointer hover:scale-110 transition" />
                    </button>

                    <button
                      onClick={() => navigate(`/events/add/${event.id}`)}
                      className="cursor-pointer border border-gray-300 p-2 bg-white hover:bg-gray-200 rounded-lg transition"
                    >
                      <FaPen className="text-blue-600 hover:scale-110 transition" />
                    </button>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Events;
