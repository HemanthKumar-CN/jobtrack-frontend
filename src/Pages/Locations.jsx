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

      <div className="p-1 bg-white rounded-xl shadow-md">
        <div
          className="grid bg-gray-100 p-3 font-semibold text-gray-700 rounded-md"
          style={{ gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr" }}
        >
          <div
            className="flex items-center gap-1 cursor-pointer select-none"
            onClick={() => handleSort("name")}
          >
            Location Name
            <div className="flex flex-col ml-1">
              <span
                className={`leading-none text-xs ${
                  sortField === "name" && sortOrder === "asc"
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                ▲
              </span>
              <span
                className={`leading-none text-xs ${
                  sortField === "name" && sortOrder === "desc"
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                ▼
              </span>
            </div>
          </div>
          <div className="ml-1">Address</div>
          <div
            className="flex items-center gap-1 cursor-pointer select-none"
            onClick={() => handleSort("city")}
          >
            City
            <div className="flex flex-col ml-1">
              <span
                className={`leading-none text-xs ${
                  sortField === "city" && sortOrder === "asc"
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                ▲
              </span>
              <span
                className={`leading-none text-xs ${
                  sortField === "city" && sortOrder === "desc"
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                ▼
              </span>
            </div>
          </div>
          <div
            className="flex items-center gap-1 cursor-pointer select-none"
            onClick={() => handleSort("state")}
          >
            State
            <div className="flex flex-col ml-1">
              <span
                className={`leading-none text-xs ${
                  sortField === "state" && sortOrder === "asc"
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                ▲
              </span>
              <span
                className={`leading-none text-xs ${
                  sortField === "state" && sortOrder === "desc"
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                ▼
              </span>
            </div>
          </div>
          <div className="ml-4">Zip</div>
        </div>

        <div
          ref={listRef}
          className="mt-2 overflow-auto max-h-[60vh] custom-scrollbar"
        >
          {locations.map((warehouse, index) => {
            let formattedAddress =
              warehouse?.address_1 +
              `${warehouse?.address_2 ? ", " + warehouse?.address_2 : ""}`;

            return (
              <div
                key={warehouse.id}
                ref={index === locations.length - 1 ? lastLocationRef : null}
                className={`grid items-center rounded-md ${
                  index % 2 === 0 ? "bg-[rgba(24,105,187,0.1)]" : "bg-white"
                }`}
                style={{ gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr" }}
              >
                <Tooltip text={warehouse.name}>
                  <div
                    onClick={() => navigate(`/locations/add/${warehouse.id}`)}
                    className="border border-white p-3 py-4.5 text-[#008CC8] cursor-pointer hover:underline hover:font-semibold"
                  >
                    {truncateText(warehouse.name)}
                  </div>
                </Tooltip>
                <Tooltip text={formattedAddress}>
                  <div className="border border-white p-3 py-4.5 break-words whitespace-pre-wrap">
                    {formattedAddress}
                  </div>
                </Tooltip>
                <div className="border border-white p-3 py-4.5">
                  {warehouse.city}
                </div>
                <div className="border border-white p-3 py-4.5">
                  {warehouse.state}
                </div>
                <div className="border border-white p-3 flex justify-between items-center">
                  <span className="">{warehouse.postal_code}</span>
                  <span>
                    <button
                      onClick={() =>
                        openModal({
                          title: "Delete this item?",
                          message:
                            "This action is permanent and cannot be undone.",
                          onConfirm: () => handleDeleteLocation(warehouse.id), // Call delete function inside modal
                          confirmText: "Delete",
                          cancelText: "Cancel",
                        })
                      }
                      className="border border-gray-300 p-2 mr-3 bg-white hover:bg-gray-200 rounded-lg transition"
                    >
                      <RiDeleteBin6Line className="text-red-600 cursor-pointer hover:scale-110 transition" />
                    </button>
                    <button
                      onClick={() => navigate(`/locations/add/${warehouse.id}`)}
                      className="border border-gray-300 p-2 bg-white hover:bg-gray-200 rounded-lg transition"
                    >
                      <FaPen className="text-blue-600 cursor-pointer hover:scale-110 transition" />
                    </button>
                  </span>
                </div>
              </div>
            );
          })}
          {loading && <Loader />}
        </div>
      </div>
    </div>
  );
};

export default Locations;
