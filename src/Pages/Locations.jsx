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

const Locations = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
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
      dispatch(fetchLocations({ page, search })).then(() => {
        if (listRef.current) {
          listRef.current.scrollTop =
            listRef.current.scrollHeight - prevScrollHeight; // Maintain position
        }
      });
    }
  }, [dispatch, page, search]);

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

  return (
    <div className="p-2 rounded-lg">
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
        {/* Headers */}
        <div className="grid grid-cols-5 bg-gray-100 p-3 font-semibold text-gray-700 rounded-md">
          <div>Location Name</div>
          <div className="ml-1">Address</div>
          <div className="ml-2">City</div>
          <div className="ml-3">State</div>
          <div className="ml-4">Zip</div>
        </div>

        {/* Warehouse List */}
        <div
          ref={listRef}
          className="mt-2 overflow-auto max-h-[60vh] custom-scrollbar"
        >
          {locations.map((warehouse, index) => {
            let formattedAddress =
              warehouse?.address_1 + ", " + warehouse?.address_2;

            return (
              <div
                key={warehouse.id}
                ref={index === locations.length - 1 ? lastLocationRef : null}
                className={`grid grid-cols-5 items-center rounded-md ${
                  index % 2 === 0 ? "bg-[rgba(24,105,187,0.1)]" : "bg-white"
                }`}
              >
                <div
                  onClick={() => navigate(`/locations/add/${warehouse.id}`)}
                  className="border border-white p-3 py-4.5 text-[#3255f0] cursor-pointer hover:underline hover:font-semibold"
                >
                  {truncateText(warehouse.name)}
                </div>
                <div className="border border-white p-3 py-4.5">
                  {formattedAddress.length > 25 ? (
                    <span title={formattedAddress}>
                      {`${formattedAddress.substring(0, 22)}...`}
                    </span>
                  ) : (
                    formattedAddress
                  )}
                </div>
                <div className="border border-white p-3 py-4.5">
                  {warehouse.city}
                </div>
                <div className="border border-white p-3 py-4.5">
                  {warehouse.state}
                </div>
                <div className="border border-white p-3 flex justify-between items-center">
                  <span className="font-semibold">{warehouse.postal_code}</span>
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
