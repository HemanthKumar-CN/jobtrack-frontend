import { useEffect, useState, useRef, useCallback } from "react";
import { FaPen } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

import { useDispatch, useSelector } from "react-redux";
import { deleteLocation, fetchLocations } from "../redux/slices/locationsSlice";
import { Loader } from "../Components/Loader";
import { useToast } from "../Components/Toast/ToastContext";
import { useModal } from "../Components/Modal/ModalProvider";
import { useNavigate } from "react-router-dom";
import { truncateText } from "../Utils/truncateText";
import Tooltip from "../Components/Tooltip";
import { TbEdit } from "react-icons/tb";

const Locations = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name"); // which field
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc

  const searchRef = useRef(null);
  const [page, setPage] = useState(1);
  const observer = useRef();
  const listRef = useRef(null); // Track scroll position

  const showToast = useToast();
  const { openModal } = useModal();

  const dispatch = useDispatch();
  const {
    data: locations,
    loading,
    error,
    totalPages,
  } = useSelector((state) => state.locations);

  const handleSearch = () => {
    setSearch(searchRef.current?.value);
    setPage(1);
  };

  // Fetch Locations when page changes
  useEffect(() => {
    if (page <= totalPages) {
      const prevScrollHeight = listRef.current?.scrollHeight; // Store scroll height before update
      dispatch(fetchLocations({ page, search, sortField, sortOrder })).then(
        () => {
          if (listRef.current) {
            listRef.current.scrollTop =
              listRef.current.scrollHeight - prevScrollHeight; // Maintain position
          }
        },
      );
    }
  }, [dispatch, page, search, sortField, sortOrder]);

  // Intersection Observer for infinite scroll
  const lastLocationRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && page < totalPages) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, page, totalPages],
  );

  // if (error) return <p>Error loading locations</p>;
  // if (!loading && locations.length === 0) return <p>No locations found</p>;

  const handleDeleteLocation = async (id) => {
    try {
      await dispatch(deleteLocation(id)).unwrap();
      showToast(`Location deleted successfully ${id}`, "success");
    } catch (error) {
      showToast(`Failed to delete location: ${error}`, "error");
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      // If same field clicked, toggle the order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If different field clicked, set new field and reset to asc
      setSortField(field);
      setSortOrder("asc");
    }

    setPage(1);
  };

  return (
    <div className="p-2 pt-0 rounded-lg">
      {/* Search Bar */}
      <div className="relative mb-2">
        <input
          type="text"
          placeholder="Search"
          ref={searchRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className="w-full p-3 pr-10 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FiSearch
          onClick={handleSearch}
          className="absolute right-3 top-1/2 cursor-pointer transform -translate-y-1/2 
            text-gray-500 transition-all duration-200 hover:text-blue-600 hover:scale-110"
          size={18}
        />
      </div>

      <div className="w-full border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex justify-between items-center mb-3 mx-4">
          <h2 className=" font-bold text-gray-900">Events</h2>
        </div>
        {/* Table Header */}
        <div className="grid grid-cols-5 text-left bg-[#F8F9FA] text-gray-600 text-sm font-bold px-4 py-3 border-b border-gray-200">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleSort("name")}
          >
            <span>LOCATION NAME</span>
            <div className="flex flex-col text-xs leading-[0.8rem]">
              <span
                className={`${
                  sortField === "name" && sortOrder === "asc"
                    ? "text-[#1A2D43]"
                    : "text-gray-400"
                }`}
              >
                ▲
              </span>
              <span
                className={`${
                  sortField === "name" && sortOrder === "desc"
                    ? "text-[#1A2D43]"
                    : "text-gray-400"
                }`}
              >
                ▼
              </span>
            </div>
          </div>

          <div>ADDRESS</div>

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleSort("city")}
          >
            <span>CITY</span>
            <div className="flex flex-col text-xs leading-[0.8rem]">
              <span
                className={`${
                  sortField === "city" && sortOrder === "asc"
                    ? "text-[#1A2D43]"
                    : "text-gray-400"
                }`}
              >
                ▲
              </span>
              <span
                className={`${
                  sortField === "city" && sortOrder === "desc"
                    ? "text-[#1A2D43]"
                    : "text-gray-400"
                }`}
              >
                ▼
              </span>
            </div>
          </div>

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleSort("state")}
          >
            <span>STATE</span>
            <div className="flex flex-col text-xs leading-[0.8rem]">
              <span
                className={`${
                  sortField === "state" && sortOrder === "asc"
                    ? "text-[#1A2D43]"
                    : "text-gray-400"
                }`}
              >
                ▲
              </span>
              <span
                className={`${
                  sortField === "state" && sortOrder === "desc"
                    ? "text-[#1A2D43]"
                    : "text-gray-400"
                }`}
              >
                ▼
              </span>
            </div>
          </div>

          <div className="text-left pr-4">ZIP / ACTIONS</div>
        </div>

        {/* Locations List */}
        <div className="" ref={listRef}>
          {locations.map((warehouse, index) => {
            let formattedAddress =
              warehouse?.address_1 +
              `${warehouse?.address_2 ? ", " + warehouse?.address_2 : ""}`;

            return (
              <div
                key={warehouse.id}
                ref={index === locations.length - 1 ? lastLocationRef : null}
                className="grid grid-cols-5 items-center text-sm text-gray-800 px-4 py-3 border-b border-gray-100"
              >
                <div
                  onClick={() => navigate(`/locations/add/${warehouse.id}`)}
                  className="font-bold hover:underline cursor-pointer truncate"
                >
                  {truncateText(warehouse.name)}
                </div>

                <Tooltip text={formattedAddress}>
                  <div className="break-words whitespace-pre-wrap truncate">
                    {formattedAddress}
                  </div>
                </Tooltip>

                <div>{warehouse.city}</div>
                <div>{warehouse.state}</div>

                <div className="flex justify-between items-center gap-2">
                  <span>{warehouse.postal_code}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        openModal({
                          title: "Delete this item?",
                          message:
                            "This action is permanent and cannot be undone.",
                          onConfirm: () => handleDeleteLocation(warehouse.id),
                          confirmText: "Delete",
                          cancelText: "Cancel",
                        })
                      }
                      className="p-1.5 rounded-md hover:bg-gray-100"
                    >
                      <RiDeleteBin6Line className="text-red-600 w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/locations/add/${warehouse.id}`)}
                      className="p-1.5 rounded-md hover:bg-gray-100"
                    >
                      <TbEdit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-center items-center py-4">
              <Loader />
            </div>
          )}
        </div>

        {locations.length === 0 && !loading && (
          <div className="flex justify-center items-center text-gray-500 py-6 h-[30vh]">
            🏢 No locations found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Locations;
