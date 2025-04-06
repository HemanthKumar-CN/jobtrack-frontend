import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createLocation,
  editLocation,
  fetchLocationById,
  resetNewData,
  resetSelectedLocation,
} from "../redux/slices/locationsSlice";
import SuccessCard from "../Components/SuccessCard";
import { RiEdit2Line } from "react-icons/ri";
import { useToast } from "../Components/Toast/ToastContext";

const AddLocation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const showToast = useToast();

  const { newData, creationLoading, creationError, selectedLocation } =
    useSelector((state) => state.locations);

  console.log(selectedLocation, "=====", newData, "+++++++)))");

  const locationNameRef = useRef(null);
  const address1Ref = useRef(null);
  const address2Ref = useRef(null);
  const cityRef = useRef(null);
  const stateRef = useRef(null);
  const zipRef = useRef(null);
  const fileInputRef = useRef(null);

  const [locationName, setLocationName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zip, setZip] = useState("");
  const [file, setFile] = useState(null);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [newLocation, setNewLocation] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setFile(file);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  const handleBackToLocations = () => {
    setNewLocation(null);
    dispatch(resetNewData());
    dispatch(resetSelectedLocation());

    navigate("/locations");
  };

  useEffect(() => {
    if (newData) {
      const updatedNewData = [
        { label: "Location Name", value: newData.name, type: "text" },
        { label: "Address 1", value: newData.address_1, type: "text" },
        { label: "Address 2", value: newData.address_2 || "N/A", type: "text" },
        { label: "City", value: newData.city, type: "text" },
        { label: "State", value: newData.state, type: "text" },
        { label: "Postal Code", value: newData.postal_code, type: "text" },
        { label: "Image", value: newData.image_url, type: "image" }, // Can be rendered as an image
        // { label: "Created At", value: new Date(newData.createdAt).toLocaleString() },
        // { label: "Updated At", value: new Date(newData.updatedAt).toLocaleString() },
      ];

      setNewLocation(updatedNewData);
    }
  }, [newData]);

  // Fetch US States
  const fetchStates = async () => {
    try {
      const response = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/states",
        { country: "United States" },
      );
      setStates(response.data.data.states);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchLocationById(id));
    }
  }, [id]);

  useEffect(() => {
    if (selectedLocation && id) {
      setLocationName(selectedLocation.name);
      setAddress1(selectedLocation.address_1);
      setAddress2(selectedLocation.address_2);
      // setSelectedState(selectedLocation.state);
      fetchCities(selectedLocation.state);
      setSelectedCity(selectedLocation.city);
      setZip(selectedLocation.postal_code);
      setImagePreview(selectedLocation.image_url);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (id && selectedState) {
      setSelectedCity(selectedLocation.city);
    }
  }, [selectedState, cities]);

  // Fetch Cities Based on Selected State
  const fetchCities = async (stateName) => {
    console.log(stateName, "state Name: -=====");
    try {
      setSelectedState(stateName);
      const response = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        { country: "United States", state: stateName },
      );
      setCities(response.data.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleAddLocation = () => {
    console.log({
      locationName,
      address1,
      address2,
      zip,
      file,
    });

    dispatch(
      createLocation({
        locationName,
        address1,
        address2,
        selectedCity,
        selectedState,
        zip,
        file,
      }),
    );
  };

  const handleEditLocation = async () => {
    try {
      await dispatch(
        editLocation({
          id,
          updatedData: {
            locationName,
            address1,
            address2,
            selectedCity,
            selectedState,
            zip,
            file, // Optional image update
          },
        }),
      ).unwrap();
      dispatch(resetNewData());
      dispatch(resetSelectedLocation());
      showToast("Location updated successfully", "success");
    } catch (error) {
      showToast(`Failed to update location: ${error}`, "error");
    }
  };

  if (newLocation) {
    return (
      <SuccessCard
        title="Location Added"
        fields={newLocation}
        onBack={handleBackToLocations}
        backButton={"Back to Locations"}
      />
    );
  } else {
    return (
      <div className="flex relative justify-center items-center bg-[#F4F7FE] pb-6">
        <div className="bg-white p-8 pt-4 pb-15 rounded-2xl shadow-lg w-[60vw]">
          {/* Header */}
          <h2 className="text-xl font-semibold text-center text-[#1E1E1E]">
            {id ? "Edit location" : "Add a Location"}
          </h2>
          <p className="text-gray-500 text-center mb-6">
            {id
              ? "Edit the location details"
              : "Fill in the details to add a new location"}
          </p>

          {/* Form */}
          <form className="space-y-4">
            {id && (
              // <div className="bg-gray-100 p-3 rounded-lg flex justify-center items-center">
              //   {/* <p className="text-gray-500 text-sm">{field.label}</p> */}
              //   <img
              //     src={`http://localhost:8080${selectedLocation.image_url}`}
              //     alt="Uploaded"
              //     className="w-full max-w-[300px] h-auto object-contain mx-auto rounded-lg"
              //   />
              // </div>

              <div className="relative group w-full max-w-[300px] mx-auto">
                {/* Image Display */}
                <div className="bg-gray-100 p-3 rounded-lg flex justify-center items-center relative">
                  <img
                    src={
                      selectedLocation?.image_url == imagePreview
                        ? `http://localhost:8080${imagePreview}`
                        : imagePreview
                    }
                    alt="Uploaded"
                    className="w-full h-auto object-contain rounded-lg"
                  />
                  {/* Hidden File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="fileInput"
                    onChange={handleImageChange}
                  />
                  {/* Edit Icon (Appears on Hover) */}
                  <label
                    htmlFor="fileInput"
                    className="absolute inset-0 flex justify-center items-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg"
                  >
                    <RiEdit2Line className="text-white text-3xl" />
                  </label>
                </div>
              </div>
            )}
            <div
              className="bg-[#F4F7FE] p-2 px-4 rounded-md text-gray-600 cursor-pointer"
              onClick={() => locationNameRef.current?.focus()}
            >
              <p className="text-gray-500 text-sm">Location Name</p>
              <input
                ref={locationNameRef}
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Write here"
                className="w-full text-sm bg-transparent outline-none text-gray-700 mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="bg-[#F4F7FE] p-2 pl-3 rounded-md text-gray-600 cursor-pointer"
                onClick={() => address1Ref.current?.focus()}
              >
                <p className="text-gray-500 text-sm">Address 1</p>
                <input
                  ref={address1Ref}
                  type="text"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  placeholder="Write here"
                  className="w-full text-sm bg-transparent outline-none text-gray-700 mt-1"
                />
              </div>

              <div
                className="bg-[#F4F7FE] p-2 pl-3 rounded-md text-gray-600 cursor-pointer"
                onClick={() => address2Ref.current?.focus()}
              >
                <p className="text-gray-500 text-sm">Address 2</p>
                <input
                  ref={address2Ref}
                  type="text"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  placeholder="Write here"
                  className="w-full text-sm bg-transparent outline-none text-gray-700 mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="bg-[#F4F7FE] p-2 rounded-md cursor-pointer"
                onClick={() => stateRef.current?.click()}
              >
                <p className="text-gray-500 text-sm pl-1">State</p>
                <select
                  ref={stateRef}
                  value={selectedState}
                  onChange={(e) => fetchCities(e.target.value)}
                  className="w-full bg-transparent outline-none text-gray-700 mt-1 cursor-pointer text-sm"
                >
                  <option>Select State</option>

                  {states.map((state) => (
                    <option key={state.name} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
              <div
                className="bg-[#F4F7FE] p-2 rounded-md cursor-pointer"
                onClick={() => cityRef.current?.click()}
              >
                <p className="text-gray-500 text-sm pl-1">City</p>
                <select
                  ref={cityRef}
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full text-sm bg-transparent outline-none text-gray-700 mt-1 cursor-pointer"
                >
                  <option>Select City</option>
                  {cities.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="bg-[#F4F7FE] p-2 pl-3 rounded-md text-gray-600 cursor-pointer"
                onClick={() => zipRef.current?.focus()}
              >
                <p className="text-gray-500 text-sm">Zip</p>
                <input
                  ref={zipRef}
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="Write here"
                  className="w-full bg-transparent outline-none text-gray-700 mt-1 text-sm"
                />
              </div>

              {id ? (
                <></>
              ) : (
                <div className="flex items-center justify-between gap-2 bg-[#F4F7FE] p-3 rounded-md">
                  <p className="text-gray-500 text-sm">
                    {file ? `${file.name}` : "Upload Image (png/jpg)"}
                  </p>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png, image/jpeg"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                  />

                  {/* Custom Upload Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-md text-sm"
                  >
                    Choose Image
                  </button>
                </div>
              )}
            </div>
          </form>

          {/* Buttons */}
        </div>
        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <Link to="/locations">
            <button className="absolute cursor-pointer bottom-0 left-50 flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-sm">
              <FaArrowLeft /> Back
            </button>
          </Link>

          {id ? (
            <button
              onClick={handleEditLocation}
              className="flex cursor-pointer absolute bottom-0 right-50 items-center gap-2 px-6 py-3 bg-[#3255F0] hover:bg-blue-800 text-white rounded-lg shadow-md"
            >
              Edit Location <FaArrowRight />
            </button>
          ) : (
            <button
              onClick={handleAddLocation}
              className="flex cursor-pointer absolute bottom-0 right-50 items-center gap-2 px-6 py-3 bg-[#3255F0] hover:bg-blue-800 text-white rounded-lg shadow-md"
            >
              Add Location <FaArrowRight />
            </button>
          )}
        </div>
      </div>
    );
  }
};

export default AddLocation;
