import React, { useEffect, useRef, useState } from "react";
import { FaPen } from "react-icons/fa";
import { RxUpdate } from "react-icons/rx";
import {
  fetchEmployeeData,
  updateEmployeeInfo,
} from "../redux/slices/employeeSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useToast } from "../Components/Toast/ToastContext";

const Contact = () => {
  const cityRef = useRef(null);
  const stateRef = useRef(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [email, setEmail] = useState("");

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [updateForm, setUpdateForm] = useState(false);

  const dispatch = useDispatch();
  const showToast = useToast();

  const { employeeData } = useSelector((state) => state.employees);

  useEffect(() => {
    dispatch(fetchEmployeeData());
  }, []);

  useEffect(() => {
    fetchStates();
  }, []);

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

  // Fetch Cities Based on Selected State
  const fetchCities = async (stateName) => {
    try {
      setState(stateName);
      const response = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        { country: "United States", state: stateName },
      );
      setCities(response.data.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  useEffect(() => {
    if (employeeData) {
      setFirstName(employeeData?.User?.first_name);
      setLastName(employeeData.User?.last_name);
      setAddress1(employeeData?.address_1);
      setAddress2(employeeData?.address_2);
      setCity(employeeData?.city);
      setState(employeeData?.state);
      setZip(employeeData?.postal_code);
      setEmail(employeeData?.User?.email);
      fetchCities(employeeData?.state);
    }
  }, [employeeData]);

  useEffect(() => {
    if (state && employeeData) {
      setCity(employeeData?.city);
    }
  }, [state, employeeData]);

  const handleEmployeeInfoUpdate = async () => {
    setUpdateForm(false);

    const updatedData = {
      firstName,
      lastName,
      email,
      address1,
      address2,
      city,
      state,
      zip,
    };

    try {
      await dispatch(
        updateEmployeeInfo({ employeeId: employeeData.id, data: updatedData }),
      ).unwrap();
      showToast("Your info updated successfully", "success");
    } catch (error) {
      console.error(error, "Failed Info update");
      showToast("Your info updated successfully", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-end">
        {updateForm ? (
          <button
            onClick={handleEmployeeInfoUpdate}
            className="flex items-center cursor-pointer px-4 py-2 border border-gray-300 bg-green-500 text-white hover:bg-green-600 rounded-lg transition"
          >
            <RxUpdate className="mr-2 cursor-pointer" /> Update
          </button>
        ) : (
          <button
            onClick={() => setUpdateForm(true)}
            className="flex cursor-pointer items-center px-4 py-2 border border-gray-300 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            <FaPen className="text-gray-700 mr-2 cursor-pointer" /> Edit
          </button>
        )}
      </div>
      {/* Form Fields */}
      <div className="grid grid-cols-2 gap-4 mt-6 ">
        <div
          className="bg-[#F4F7FE] p-2 rounded-md text-gray-600 cursor-pointer mt-4"
          //   onClick={() => titleRef.current?.focus()}
        >
          <p className="text-gray-500 text-sm">First Name</p>
          <input
            // ref={titleRef}
            type="text"
            readOnly={!updateForm}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Write here"
            className="w-full bg-transparent outline-none text-gray-700 mt-1 text-sm"
          />
        </div>
        <div
          className="bg-[#F4F7FE] p-2 rounded-md text-gray-600 cursor-pointer mt-4"
          //   onClick={() => titleRef.current?.focus()}
        >
          <p className="text-gray-500 text-sm">Last Name</p>
          <input
            // ref={titleRef}
            readOnly={!updateForm}
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Write here"
            className="w-full bg-transparent outline-none text-gray-700 mt-1 text-sm"
          />
        </div>
        <div
          className="bg-[#F4F7FE] p-2 rounded-md text-gray-600 cursor-pointer mt-4"
          //   onClick={() => titleRef.current?.focus()}
        >
          <p className="text-gray-500 text-sm">Address 1</p>
          <input
            // ref={titleRef}
            type="text"
            readOnly={!updateForm}
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
            placeholder="Write here"
            className="w-full bg-transparent outline-none text-gray-700 mt-1 text-sm"
          />
        </div>
        <div
          className="bg-[#F4F7FE] p-2 rounded-md text-gray-600 cursor-pointer mt-4"
          //   onClick={() => titleRef.current?.focus()}
        >
          <p className="text-gray-500 text-sm">Adress 2</p>
          <input
            // ref={titleRef}
            readOnly={!updateForm}
            type="text"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            placeholder="Write here"
            className="w-full bg-transparent outline-none text-gray-700 mt-1 text-sm"
          />
        </div>

        <div
          className="bg-[#F4F7FE] p-2 rounded-md cursor-pointer"
          onClick={() => stateRef.current?.click()}
        >
          <p className="text-gray-500 text-sm ml-0.5">State</p>
          <select
            ref={stateRef}
            disabled={!updateForm}
            value={state}
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
          <p className="text-gray-500 text-sm ml-0.5">City</p>
          <select
            ref={cityRef}
            disabled={!updateForm}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-transparent outline-none text-gray-700 mt-1 cursor-pointer text-sm"
          >
            <option>Select City</option>
            {cities.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </div>

        <div
          className="bg-[#F4F7FE] p-2 rounded-md text-gray-600 cursor-pointer mt-4"
          //   onClick={() => titleRef.current?.focus()}
        >
          <p className="text-gray-500 text-sm">Zip</p>
          <input
            // ref={titleRef}
            readOnly={!updateForm}
            type="text"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="Write here"
            className="w-full bg-transparent outline-none text-gray-700 mt-1 text-sm"
          />
        </div>
        <div
          className="bg-[#F4F7FE] p-2 rounded-md text-gray-600 cursor-pointer mt-4"
          //   onClick={() => titleRef.current?.focus()}
        >
          <p className="text-gray-500 text-sm">Email</p>
          <input
            // ref={titleRef}
            readOnly={!updateForm}
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Write here"
            className="w-full bg-transparent outline-none text-gray-700 mt-1 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
