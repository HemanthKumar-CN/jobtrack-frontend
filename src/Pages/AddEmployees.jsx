import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaCamera,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createEmployee,
  getEmployeeById,
  resetEmployees,
  updateEmployee,
} from "../redux/slices/employeeSlice";
import SuccessCard from "../Components/SuccessCard";
import { useToast } from "../Components/Toast/ToastContext";
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const AddEmployees = () => {
  const firstNameRef = useRef(null);
  const dobRef = useRef(null);
  const lastNameRef = useRef(null);
  const address1Ref = useRef(null);
  const address2Ref = useRef(null);
  const cityRef = useRef(null);
  const stateRef = useRef(null);
  const zipRef = useRef(null);
  const emailRef = useRef(null);
  const employeeTypeRef = useRef(null);
  const employeePhoneRef = useRef(null);
  const emergencyContactNameRef = useRef(null);
  const emergencyContactPhoneRef = useRef(null);
  const hireDateRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const showToast = useToast();

  const [firstName, setFirstName] = useState("");
  const [Dob, setDob] = useState("");
  const [lastName, setLastName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zip, setZip] = useState("");
  const [file, setFile] = useState(null);
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [employeePhone, setEmployeePhone] = useState("");
  const [email, setEmail] = useState("");

  const [employeeFields, setEmployeeFields] = useState([]);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [employeeType, setEmployeeType] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const { status, error, newEmployee, employeeDetails } = useSelector(
    (state) => state.employees,
  );

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      try {
        const imageUrl = URL.createObjectURL(selectedFile);
        setImagePreview(imageUrl);
        setFile(selectedFile);
      } catch (error) {
        console.error("Error creating object URL:", error);
      }
    }
  };

  useEffect(() => {
    if (id && employeeDetails) {
      setFirstName(employeeDetails?.User?.first_name);
      setLastName(employeeDetails?.User?.last_name);
      // Convert ISO date to YYYY-MM-DD format
      const formattedDob = employeeDetails?.date_of_birth
        ? employeeDetails?.date_of_birth.split("T")[0] // Extract only the date part
        : "";

      setDob(formattedDob);
      setAddress1(employeeDetails?.address_1);
      setAddress2(employeeDetails?.address_2);
      setEmployeeType(employeeDetails?.type);
      setEmployeePhone(employeeDetails?.phone);
      setEmail(employeeDetails?.User?.email);
      setSelectedState(employeeDetails?.state);
      fetchCities(employeeDetails?.state);
      setSelectedCity(employeeDetails?.city);
      setZip(employeeDetails?.postal_code);
      setEmergencyContactName(employeeDetails?.emergency_contact_name);
      setEmergencyContactPhone(employeeDetails?.emergency_contact_phone);

      // Convert ISO date to YYYY-MM-DD format
      const formattedHireDate = employeeDetails?.hire_date
        ? employeeDetails.hire_date.split("T")[0] // Extract only the date part
        : "";

      setHireDate(formattedHireDate);
      setImagePreview(employeeDetails?.User?.image_url);
    }
  }, [employeeDetails]);

  useEffect(() => {
    if (id && selectedState) {
      setSelectedCity(employeeDetails?.city);
    }
  }, [cities, selectedState]);

  useEffect(() => {
    fetchStates();
  }, []);

  console.log(employeeDetails, "employeeDetails", imagePreview);

  useEffect(() => {
    if (id) {
      dispatch(getEmployeeById(id));
    }
  }, [id]);

  const handleBackToEmployees = () => {
    navigate("/employees");
    dispatch(resetEmployees());
  };

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

  const handleEditEmployee = async () => {
    try {
      await dispatch(
        updateEmployee({
          id,
          employeeData: {
            firstName,
            lastName,
            address1,
            address2,
            zip,
            Dob,
            file,
            employeePhone,
            emergencyContactName,
            emergencyContactPhone,
            selectedCity,
            selectedState,
            hireDate,
            email,
            employeeType,
          },
        }),
      ).unwrap();
      showToast("Contractor updated successfully", "success");
    } catch (error) {
      showToast(`Failed to update contractor: ${error}`, "error");
    }
  };

  useEffect(() => {
    if (newEmployee) {
      const updatedNewEmployee = [
        { label: "Image", value: newEmployee.user?.image_url, type: "image" },

        {
          label: "First Name",
          value: newEmployee.user.first_name,
          type: "text",
        },
        {
          label: "Last Name",
          value: newEmployee.user.last_name,
          type: "text",
        },
        {
          label: "Employee Email",
          value: newEmployee.user.email,
          type: "text",
        },
        {
          label: "Date of Birth",
          value: newEmployee.employee.date_of_birth,
          type: "date",
        },
        {
          label: "City",
          value: newEmployee.employee.city,
          type: "text",
        },
        {
          label: "State",
          value: newEmployee.employee.state,
          type: "text",
        },
        {
          label: "Type",
          value: newEmployee.employee.type,
          type: "text",
        },
        {
          label: "Address 1",
          value: newEmployee.employee.address_2,
          type: "text",
        },
        {
          label: "Address 2",
          value: newEmployee.employee.address_1,
          type: "text",
        },
        {
          label: "Phone",
          value: newEmployee.employee.phone,
          type: "text",
        },
        {
          label: "Postal Code",
          value: newEmployee.employee.postal_code,
          type: "text",
        },
        {
          label: "Hiring date",
          value: newEmployee.employee.hire_date,
          type: "date",
        },
        {
          label: "Emergency contact name",
          value: newEmployee.employee.emergency_contact_name,
          type: "text",
        },
        {
          label: "Emergency contact name",
          value: newEmployee.employee.emergency_contact_phone,
          type: "text",
        },
      ];

      setEmployeeFields(updatedNewEmployee);
    }
  }, [newEmployee]);

  const handleAddEmployee = () => {
    dispatch(
      createEmployee({
        firstName,
        lastName,
        address1,
        address2,
        zip,
        Dob,
        file,
        employeePhone,
        emergencyContactName,
        emergencyContactPhone,
        selectedCity,
        selectedState,
        hireDate,
        email,
        employeeType,
      }),
    );
  };

  if (newEmployee) {
    return (
      <SuccessCard
        title="Employee Added"
        fields={employeeFields}
        onBack={handleBackToEmployees}
        backButton={"Back to Employees"}
      />
    );
  } else {
    return (
      <div className="flex relative pb-6 justify-center items-center bg-[#F4F7FE]">
        <div className="bg-white p-8 pb-15 pt-2 rounded-2xl shadow-lg w-[70vw]">
          {/* Header */}
          <h2 className="text-2xl font-semibold text-center text-[#1E1E1E]">
            {id ? "Edit this Employee" : "Add an Employee"}
          </h2>
          <p className="text-gray-500 text-center mb-4">
            {id ? "" : "Enter employee details"}
          </p>

          {/* Profile Image */}

          <div className="flex justify-center mb-4 relative">
            {/* Profile Image */}
            <div className="w-24 h-24 rounded-full overflow-hidden  border-gray-300 relative">
              <img
                src={
                  employeeDetails?.User?.image_url == imagePreview &&
                  imagePreview != null
                    ? `${IMAGE_BASE_URL}${imagePreview}`
                    : imagePreview
                    ? imagePreview
                    : "https://randomuser.me/api/portraits/lego/7.jpg"
                }
                alt=""
                className="w-full h-full object-cover"
              />

              {/* Edit Icon Overlay */}
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                <FaCamera className="text-white text-xl" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4 overflow-auto max-h-[40vh] custom-scrollbar">
            <div className="grid grid-cols-3 gap-4">
              <div
                className="bg-[#F4F7FE] p-2 rounded-md text-gray-600 cursor-pointer"
                onClick={() => firstNameRef.current?.focus()}
              >
                <p className="text-gray-500 text-sm">First Name</p>
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
                <p className="text-gray-500 text-sm">Last Name</p>
                <input
                  ref={lastNameRef}
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Write here"
                  className="w-full bg-transparent outline-none text-gray-700 mt-1 text-sm"
                />
              </div>

              <div
                className="bg-[#F4F7FE] p-2 rounded-md relative cursor-pointer"
                onClick={() => dobRef.current?.showPicker()}
              >
                <p className="text-gray-500 text-sm">Date of Birth</p>
                <div className="relative mt-1 flex items-center">
                  <input
                    type="date"
                    ref={dobRef}
                    value={Dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-transparent outline-none text-gray-700 cursor-pointer appearance-none"
                  />
                  <FaCalendarAlt className="absolute right-2 text-gray-500" />
                </div>
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
                onClick={() => employeeTypeRef.current?.click()}
              >
                <p className="text-gray-500 text-sm">Type</p>
                <select
                  ref={employeeTypeRef}
                  value={employeeType}
                  onChange={(e) => setEmployeeType(e.target.value)}
                  className="w-full bg-transparent outline-none text-gray-700 mt-1 cursor-pointer text-sm"
                >
                  <option value={""}>Select Employee Type</option>

                  <option value={"A-list"}>A-List</option>
                  <option value={"Extra"}>Extra</option>
                </select>
              </div>

              <div
                className="bg-[#F4F7FE] p-2 rounded-md text-gray-600 cursor-pointer"
                onClick={() => employeePhoneRef.current?.focus()}
              >
                <p className="text-gray-500 text-sm">Employee Phone</p>
                <input
                  ref={employeePhoneRef}
                  type="text"
                  value={employeePhone}
                  onChange={(e) => setEmployeePhone(e.target.value)}
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
                  placeholder="Write here"
                  className="w-full bg-transparent outline-none text-gray-700 mt-1 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
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

            <div className="grid grid-cols-3 gap-4">
              <div
                className="bg-[#F4F7FE] p-2 rounded-md text-gray-600 cursor-pointer"
                onClick={() => emergencyContactNameRef.current?.focus()}
              >
                <p className="text-gray-500 text-sm">Emergency Contact Name</p>
                <input
                  ref={emergencyContactNameRef}
                  type="text"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  placeholder="Write here"
                  className="w-full bg-transparent outline-none text-gray-700 mt-1 text-sm"
                />
              </div>

              <div
                className="bg-[#F4F7FE] p-2 rounded-md text-gray-600 cursor-pointer"
                onClick={() => emergencyContactPhoneRef.current?.focus()}
              >
                <p className="text-gray-500 text-sm">Emergency Contact Phone</p>
                <input
                  ref={emergencyContactPhoneRef}
                  type="text"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  placeholder="Write here"
                  className="w-full bg-transparent outline-none text-gray-700 mt-1 text-sm"
                />
              </div>

              <div
                className="bg-[#F4F7FE] p-2 rounded-md relative cursor-pointer"
                onClick={() => hireDateRef.current?.showPicker()}
              >
                <p className="text-gray-500 text-sm">Hiring Date</p>
                <div className="relative mt-1 flex items-center">
                  <input
                    type="date"
                    ref={hireDateRef}
                    value={hireDate}
                    onChange={(e) => setHireDate(e.target.value)}
                    className="w-full bg-transparent outline-none text-gray-700 cursor-pointer appearance-none"
                  />
                  <FaCalendarAlt className="absolute right-2 text-gray-500" />
                </div>
              </div>
            </div>
          </form>
        </div>
        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <Link to="/employees">
            <button className="cursor-pointer flex absolute bottom-0 left-50 items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-sm">
              <FaArrowLeft /> Back
            </button>
          </Link>

          {id ? (
            <button
              onClick={handleEditEmployee}
              className="cursor-pointer flex items-center gap-2 px-6 py-3 absolute bottom-0 right-50  bg-[#3255F0] hover:bg-blue-800 text-white rounded-lg shadow-md"
            >
              Save <FaArrowRight />
            </button>
          ) : (
            <button
              onClick={handleAddEmployee}
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

export default AddEmployees;
