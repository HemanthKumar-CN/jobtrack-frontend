import { useState } from "react";
import Select from "react-select";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EmployeeMultiSelect = ({ employees, onChange }) => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const handleChange = (selectedOptions) => {
    setSelectedEmployees(selectedOptions);
    onChange(selectedOptions); // Pass selected employees to parent
  };

  // Map employees data to react-select format
  const options = employees.map((emp) => ({
    value: emp.id,
    label: `${emp.User.first_name} ${emp.User.last_name}`,
    imageUrl: emp?.User?.image_url
      ? `${API_BASE_URL}${emp.User.image_url}`
      : null,
  }));

  // Custom render for dropdown items
  const customSingleValue = ({ data }) => (
    <div className="flex items-center">
      <img
        src={data.imageUrl}
        alt={data.label}
        className="w-6 h-6 rounded-full mr-2"
      />
      {data.label}
    </div>
  );

  const customOption = (props) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div
        ref={innerRef}
        {...innerProps}
        className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
      >
        <img
          src={data.imageUrl}
          alt={data.label}
          className="w-6 h-6 rounded-full mr-2"
        />
        {data.label}
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Multi-Select Dropdown */}
      <Select
        options={options}
        isMulti
        value={selectedEmployees}
        onChange={handleChange}
        getOptionLabel={(e) => (
          <div className="flex items-center">
            <img
              src={e.imageUrl}
              alt={e.label}
              className="w-6 h-6 rounded-full mr-2"
            />
            {e.label}
          </div>
        )}
        components={{ SingleValue: customSingleValue, Option: customOption }}
        placeholder="Select Employees..."
        className="bg-[#F4F7FE] p-3 rounded-md cursor-pointer"
      />

      {/* Selected Employees Avatars */}
      {selectedEmployees.length > 0 && (
        <div className="flex flex-wrap items-center space-x-3 mt-4">
          {selectedEmployees.map((emp) => (
            <img
              key={emp.value}
              src={emp.imageUrl}
              alt={emp.label}
              className="w-10 h-10 mt-2 rounded-full border-2 border-gray-200"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeMultiSelect;
