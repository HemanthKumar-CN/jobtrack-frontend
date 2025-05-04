import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createContractor,
  fetchContractorById,
  resetContractors,
  updateContractor,
} from "../redux/slices/contractorsSlice";
import SuccessCard from "../Components/SuccessCard";
import { useToast } from "../Components/Toast/ToastContext";

const AddContractors = () => {
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const address1Ref = useRef(null);
  const address2Ref = useRef(null);
  const companyNameRef = useRef(null);
  const cityRef = useRef(null);
  const stateRef = useRef(null);
  const zipRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const showToast = useToast();

  const { contractors, loading, error, newContractor, contractor } =
    useSelector((state) => state.contractors);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [successContractor, setSuccessContractor] = useState(null);

  const handleCreateContractor = () => {
    dispatch(
      createContractor({
        first_name: firstName,
        last_name: lastName,
        company_name: companyName,
        email,
        address_1: address1,
        address_2: address2,
        zip,
        phone,
        state: stateRef.current.value,
        city: cityRef.current.value,
      }),
    );
  };

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(fetchContractorById(id));
    }
  }, [id]);

  useEffect(() => {
    if (id && contractor) {
      setFirstName(contractor.first_name);
      setLastName(contractor.last_name);
      setAddress1(contractor.address_1);
      setAddress2(contractor.address_2);
      setEmail(contractor.email);
      setPhone(contractor.phone);
      setCompanyName(contractor.company_name);
      setZip(contractor.zip);
      setSelectedState(contractor.state);
      fetchCities(contractor.state);

      console.log(contractor.state, "::::::::");
    }
  }, [contractor]);

  useEffect(() => {
    if (newContractor) {
      const updatedNewContractor = [
        { label: "First Name", value: newContractor.first_name, type: "text" },
        { label: "Last Name", value: newContractor.last_name, type: "text" },
        { label: "Address 1", value: newContractor.address_1, type: "text" },
        {
          label: "Address 2",
          value: newContractor.address_2 || "N/A",
          type: "text",
        },
        { label: "Email", value: newContractor.email, type: "text" },
        { label: "Phone", value: newContractor.phone, type: "text" },
        {
          label: "Company Name",
          value: newContractor.company_name,
          type: "text",
        },

        { label: "City", value: newContractor.city, type: "text" },
        { label: "State", value: newContractor.state, type: "text" },
        { label: "Zip", value: newContractor.zip, type: "text" },
      ];

      setSuccessContractor(updatedNewContractor);
    }
  }, [newContractor]);

  useEffect(() => {
    if (id && selectedState) {
      setSelectedCity(contractor.city);
    }
  }, [cities, selectedState]);

  // Fetch US States
  const fetchStates = async () => {
    try {
      const response = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/states",
        { country: "United States" },
      );
      setStates(response.data.data.states);
      fetchCities("Illinois");
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  // Fetch Cities Based on Selected State
  const fetchCities = async (stateName) => {
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

  const handleBackToContractors = () => {
    navigate("/contractors");
    dispatch(resetContractors());
    setSuccessContractor(null);
  };

  const handleEditContractor = async () => {
    const contractorData = {
      first_name: firstName,
      last_name: lastName,
      company_name: companyName,
      email,
      address_1: address1,
      address_2: address2,
      zip,
      phone,
      state: stateRef.current.value,
      city: cityRef.current.value,
    };
    try {
      await dispatch(updateContractor({ id, contractorData })).unwrap();
      showToast("Contractor updated successfully", "success");
    } catch (error) {
      showToast(`Failed to update contractor: ${error}`, "error");
    }
  };

  console.log(successContractor, "successContractor===---");

  if (successContractor) {
    return (
      <SuccessCard
        title="Contractor Added"
        fields={successContractor}
        onBack={handleBackToContractors}
        backButton={"Back to Contractors"}
      />
    );
  } else {
    return (
      <div className="flex relative pb-6 justify-center items-center bg-[#F4F7FE]">
        <div className="bg-white p-8 pb-15 pt-2 rounded-2xl shadow-lg w-[70vw]">
          {/* Header */}
          <h2 className="text-2xl font-semibold text-center text-[#1E1E1E]">
            {id ? "Contractor - Edit" : "Contractor - Add"}
          </h2>
          <p className="text-gray-500 text-center mb-4">
            {id ? "" : "Enter contractor details"}
          </p>

          {/* Profile Image */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full overflow-hidden">
              <svg
                className="size-full text-gray-300"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.62854"
                  y="0.359985"
                  width="15"
                  height="15"
                  rx="7.5"
                  fill="white"
                ></rect>
                <path
                  d="M8.12421 7.20374C9.21151 7.20374 10.093 6.32229 10.093 5.23499C10.093 4.14767 9.21151 3.26624 8.12421 3.26624C7.0369 3.26624 6.15546 4.14767 6.15546 5.23499C6.15546 6.32229 7.0369 7.20374 8.12421 7.20374Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M11.818 10.5975C10.2992 12.6412 7.42106 13.0631 5.37731 11.5537C5.01171 11.2818 4.69296 10.9631 4.42107 10.5975C4.28982 10.4006 4.27107 10.1475 4.37419 9.94123L4.51482 9.65059C4.84296 8.95684 5.53671 8.51624 6.30546 8.51624H9.95231C10.7023 8.51624 11.3867 8.94749 11.7242 9.62249L11.8742 9.93184C11.968 10.1475 11.9586 10.4006 11.818 10.5975Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4  custom-scrollbar">
            <div className="grid grid-cols-2 gap-4">
              <div
                className="bg-[#F4F7FE] p-2 rounded-md text-gray-600 cursor-pointer"
                onClick={() => firstNameRef.current?.focus()}
              >
                <p className="text-gray-500 text-sm">Contractor First Name</p>
                <input
                  ref={firstNameRef}
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Write here"
                  className="w-full bg-transparent outline-none text-gray-700 mt-1 text-sm"
                />
              </div>

              <div
                className="bg-[#F4F7FE] p-2 rounded-md text-gray-600 cursor-pointer"
                onClick={() => lastNameRef.current?.focus()}
              >
                <p className="text-gray-500 text-sm">Contractor Last Name</p>
                <input
                  ref={lastNameRef}
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Write here"
                  className="w-full bg-transparent outline-none text-gray-700 mt-1 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div
                className="bg-[#F4F7FE] p-2 rounded-md text-gray-600 cursor-pointer"
                onClick={() => companyNameRef.current?.focus()}
              >
                <p className="text-gray-500 text-sm">Company Name</p>
                <input
                  ref={companyNameRef}
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Write here"
                  className="w-full bg-transparent outline-none text-gray-700 mt-1 text-sm"
                />
              </div>

              <div
                className="bg-[#F4F7FE] p-2 rounded-md text-gray-600 cursor-pointer"
                onClick={() => emailRef.current?.focus()}
              >
                <p className="text-gray-500 text-sm">Email</p>
                <input
                  ref={emailRef}
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Write your email"
                  className="w-full bg-transparent outline-none text-gray-700 mt-1 text-sm"
                />
              </div>
              <div
                className="bg-[#F4F7FE] p-2 rounded-md text-gray-600 cursor-pointer"
                onClick={() => phoneRef.current?.focus()}
              >
                <p className="text-gray-500 text-sm">Phone</p>
                <input
                  ref={phoneRef}
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Write here"
                  className="w-full bg-transparent outline-none text-gray-700 mt-1 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="bg-[#F4F7FE] p-2 rounded-md text-gray-600 cursor-pointer"
                onClick={() => address1Ref.current?.focus()}
              >
                <p className="text-gray-500 text-sm">Address 1</p>
                <input
                  ref={address1Ref}
                  type="text"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  placeholder="Write here"
                  className="w-full bg-transparent outline-none text-gray-700 mt-1 text-sm"
                />
              </div>
              <div
                className="bg-[#F4F7FE] p-2 rounded-md text-gray-600 cursor-pointer"
                onClick={() => address2Ref.current?.focus()}
              >
                <p className="text-gray-500 text-sm">Address 2</p>
                <input
                  ref={address2Ref}
                  type="text"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  placeholder="Write here"
                  className="w-full bg-transparent outline-none text-gray-700 mt-1 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div
                className="bg-[#F4F7FE] p-2 rounded-md cursor-pointer"
                onClick={() => cityRef.current?.click()}
              >
                <p className="text-gray-500 text-sm ml-0.5">City</p>
                <select
                  ref={cityRef}
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-transparent outline-none text-gray-700 mt-1 cursor-pointer text-sm"
                >
                  <option>Select City</option>
                  {cities.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div
                className="bg-[#F4F7FE] p-2 rounded-md cursor-pointer"
                onClick={() => stateRef.current?.click()}
              >
                <p className="text-gray-500 text-sm ml-0.5">State</p>
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
                className="bg-[#F4F7FE] p-2 rounded-md text-gray-600 cursor-pointer"
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
            </div>

            <div className="grid grid-cols-2 gap-4"></div>
          </form>
        </div>
        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <Link to="/contractors">
            <button className="cursor-pointer flex absolute bottom-0 left-50 items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-sm">
              <FaArrowLeft /> Back
            </button>
          </Link>

          {id ? (
            <button
              onClick={handleEditContractor}
              className="cursor-pointer flex items-center gap-2 px-6 py-3 absolute bottom-0 right-50  bg-[#3255F0] hover:bg-blue-800 text-white rounded-lg shadow-md"
            >
              Edit Contractor <FaArrowRight />
            </button>
          ) : (
            <button
              onClick={handleCreateContractor}
              className="cursor-pointer flex items-center gap-2 px-6 py-3 absolute bottom-0 right-50  bg-[#3255F0] hover:bg-blue-800 text-white rounded-lg shadow-md"
            >
              Save <FaArrowRight />
            </button>
          )}
        </div>
      </div>
    );
  }
};

export default AddContractors;
