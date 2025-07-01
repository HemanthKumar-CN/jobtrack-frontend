import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axiosInstance";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Async thunk for fetching employees with pagination & search
export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async (
    {
      search = "",
      page = 1,
      limit = 100,
      status,
      sortField = "first_name",
      sortOrder = "asc",
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/employees?search=${search}&page=${page}&limit=${limit}&status=${status}&sortField=${sortField}&sortOrder=${sortOrder}`,
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching employees",
      );
    }
  },
);

export const fetchRestrictions = createAsyncThunk(
  "restrictions/fetchRestrictions",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/employees/get-restrictions`,
        {
          withCredentials: true,
        },
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch restrictions",
      );
    }
  },
);

// Create Employee
// export const createEmployee = createAsyncThunk(
//   "employees/createEmployee",
//   async (employeeData, { rejectWithValue }) => {
//     try {
//       const formData = new FormData();

//       formData.append("first_name", employeeData.firstName);
//       formData.append("last_name", employeeData.lastName);
//       formData.append("address_1", employeeData.address1);
//       formData.append("address_2", employeeData.address2);
//       formData.append("postal_code", employeeData.zip);
//       formData.append("date_of_birth", employeeData.Dob);
//       formData.append("status", employeeData.statusType);
//       formData.append("role_id", 3);
//       formData.append("city", employeeData.selectedCity);
//       formData.append("state", employeeData.selectedState);
//       formData.append("hire_date", employeeData.hireDate);
//       formData.append("email", employeeData.email);
//       formData.append("type", employeeData.employeeType);
//       formData.append("phone", employeeData.employeePhone);
//       formData.append(
//         "emergency_contact_name",
//         employeeData.emergencyContactName,
//       );
//       formData.append(
//         "emergency_contact_phone",
//         employeeData.emergencyContactPhone,
//       );

//       if (employeeData.file) {
//         formData.append("image", employeeData.file);
//       }

//       console.log(formData, "-=========");

//       const response = await axios.post(`${API_BASE_URL}/employees`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//         withCredentials: true,
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || "Failed to create employee",
//       );
//     }
//   },
// );

export const createEmployee = createAsyncThunk(
  "employees/createEmployee",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/employees`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

export const softDeleteEmployee = createAsyncThunk(
  "employees/softDeleteEmployee",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/employees/${id}`, {
        withCredentials: true,
      });
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to soft delete employee",
      );
    }
  },
);

// Fetch a single employee by ID
export const getEmployeeById = createAsyncThunk(
  "employees/getEmployeeById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/employees/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch employee",
      );
    }
  },
);

// ✅ Async thunk for updating an employee
export const updateEmployee = createAsyncThunk(
  "employees/updateEmployee",
  async ({ id, employeeData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("first_name", employeeData.firstName);
      formData.append("last_name", employeeData.lastName);
      formData.append("address_1", employeeData.address1);
      formData.append("address_2", employeeData.address2);
      formData.append("postal_code", employeeData.zip);
      formData.append("date_of_birth", employeeData.Dob);
      formData.append("role_id", 3);
      formData.append("city", employeeData.selectedCity);
      formData.append("state", employeeData.selectedState);
      formData.append("hire_date", employeeData.hireDate);
      formData.append("email", employeeData.email);
      formData.append("type", employeeData.employeeType);
      formData.append("phone", employeeData.employeePhone);
      formData.append(
        "emergency_contact_name",
        employeeData.emergencyContactName,
      );
      formData.append(
        "emergency_contact_phone",
        employeeData.emergencyContactPhone,
      );

      if (employeeData.file) {
        formData.append("image", employeeData.file);
      }

      const response = await axios.put(
        `${API_BASE_URL}/employees/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating employee");
    }
  },
);

// Async Thunk for fetching employee hours
export const fetchEmployeeHoursWeek = createAsyncThunk(
  "employeeHours/fetch",
  async ({ startOfWeek, endOfWeek, selectedLocation }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/employees/employee-hours-week`,
        {
          startOfWeek,
          endOfWeek,
          selectedLocation,
        },
        {
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const fetchEmployeeData = createAsyncThunk(
  "employee/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/employees/me`, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching employee data",
      );
    }
  },
);

export const updateEmployeeInfo = createAsyncThunk(
  "employee/updateEmployee",
  async ({ employeeId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/employees/update-personalInfo/${employeeId}`,
        data,
        {
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update",
      );
    }
  },
);

// Async action to update notification preference
export const updateNotificationPreference = createAsyncThunk(
  "employee/updateNotificationPreference",
  async (preference, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/employees/notification-preference`,
        {
          notification_preference: preference,
        },
        { withCredentials: true },
      );
      return response.data.notification_preference;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update",
      );
    }
  },
);

export const fetchEmployeeSchedulesByWeek = createAsyncThunk(
  "schedules/fetchByWeek",
  async ({ employee_id, location_id, date_range }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/employees/employee-schedule-location-week`,
        {
          employee_id,
          location_id,
          date_range,
        },
        { withCredentials: true },
      );
      return res.data.schedules_by_week;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const getLocationEmployeeWeeklyHours = createAsyncThunk(
  "locationEmployeeWeeklyHours/get",
  async ({ location_id, date_range }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/employees/schedule-location-week`,
        {
          location_id,
          date_range,
        },
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    employees: [],
    total: 0,
    hasMore: true,
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null,
    page: 1,
    search: "",
    newEmployee: null,
    employeeDetails: null, // Store single employee data
    employeeStatus: "idle", // Status for getEmployeeById
    employeeError: null, // Error state for getEmployeeById

    employeeHoursWeekData: [],
    employeeLoading: false,
    employeeError: false,

    employeeData: [],

    employeePersonalUpdateLoading: false,
    employeePersonalUpdateError: false,

    notificationPreference: null,
    notificationPreferenceLoading: false,
    notificationPreferenceError: null,

    EmployeeSchedulesByWeek: {},
    employeeSchedulesByWeekLoading: false,
    employeeSchedulesByWeekError: null,

    EmployeeLocationSchedulesByWeek: {},
    employeeLocationSchedulesByWeekLoading: false,
    employeeLocationSchedulesByWeekError: null,

    employeeRestrictionList: [],
  },
  reducers: {
    resetEmployees(state) {
      state.employees = [];
      state.page = 1;
      state.hasMore = true;
      state.newEmployee = null;
    },
    setSearch(state, action) {
      state.search = action.payload;
      state.page = 1; // Reset pagination on new search
      state.hasMore = true;
      state.employees = []; // Clear existing employees
    },
    refreshEmployees(state, action) {
      state.employees = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employees = [...state.employees, ...action.payload.employees]; // Append new employees
        state.total = action.payload.total;
        state.hasMore = action.payload.hasMore;
        state.page += 1; // Increase page for next call
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Create Employee
      .addCase(createEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.newEmployee = {
          employee: action.payload.employee,
          user: action.payload.user,
        };
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Soft Delete Employee
      .addCase(softDeleteEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(softDeleteEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employees = state.employees.filter(
          (employee) => employee.id !== action.payload.id,
        );
      })
      .addCase(softDeleteEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch Employee by ID
      .addCase(getEmployeeById.pending, (state) => {
        state.employeeStatus = "loading";
      })
      .addCase(getEmployeeById.fulfilled, (state, action) => {
        state.employeeStatus = "succeeded";
        state.employeeDetails = action.payload;
      })
      .addCase(getEmployeeById.rejected, (state, action) => {
        state.employeeStatus = "failed";
        state.employeeError = action.payload;
      })
      // ✅ Update Employee Reducer
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeDetails = action.payload.employee; // Update store with latest details
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmployeeHoursWeek.pending, (state) => {
        state.employeeLoading = true;
        state.employeeError = null;
      })
      .addCase(fetchEmployeeHoursWeek.fulfilled, (state, action) => {
        state.employeeLoading = false;
        state.employeeHoursWeekData = action.payload;
      })
      .addCase(fetchEmployeeHoursWeek.rejected, (state, action) => {
        state.employeeLoading = false;
        state.employeeError = action.payload;
      })
      .addCase(fetchEmployeeData.pending, (state) => {
        state.employeeLoading = true;
        state.employeeError = null;
      })
      .addCase(fetchEmployeeData.fulfilled, (state, action) => {
        state.employeeLoading = false;
        state.employeeData = action.payload;
      })
      .addCase(fetchEmployeeData.rejected, (state, action) => {
        state.employeeLoading = false;
        state.employeeError = action.payload;
      })
      .addCase(updateEmployeeInfo.pending, (state) => {
        state.employeePersonalUpdateLoading = true;
        // state.success = false;
        state.employeePersonalUpdateError = null;
      })
      .addCase(updateEmployeeInfo.fulfilled, (state) => {
        state.employeePersonalUpdateLoading = false;
        // state.success = true;
      })
      .addCase(updateEmployeeInfo.rejected, (state, action) => {
        state.employeePersonalUpdateLoading = false;
        state.employeePersonalUpdateError = action.payload;
      })
      .addCase(updateNotificationPreference.pending, (state) => {
        state.notificationPreferenceLoading = true;
        state.notificationPreferenceError = null;
      })
      .addCase(updateNotificationPreference.fulfilled, (state, action) => {
        state.notificationPreferenceLoading = false;
        state.notificationPreference = action.payload;
      })
      .addCase(updateNotificationPreference.rejected, (state, action) => {
        state.notificationPreferenceLoading = false;
        state.notificationPreferenceError = action.payload;
      })

      .addCase(fetchEmployeeSchedulesByWeek.pending, (state) => {
        state.employeeSchedulesByWeekLoading = true;
        state.employeeSchedulesByWeekError = null;
      })
      .addCase(fetchEmployeeSchedulesByWeek.fulfilled, (state, action) => {
        console.log(
          action.payload,
          "===================fetchEmployeeSchedulesByWeek",
        );
        state.employeeSchedulesByWeekLoading = false;
        state.EmployeeSchedulesByWeek = action.payload;
      })
      .addCase(fetchEmployeeSchedulesByWeek.rejected, (state, action) => {
        state.employeeSchedulesByWeekLoading = false;
        state.employeeSchedulesByWeekError = action.payload;
      })
      .addCase(getLocationEmployeeWeeklyHours.pending, (state) => {
        state.employeeLocationSchedulesByWeekLoading = true;
        state.employeeLocationSchedulesByWeekError = null;
      })
      .addCase(getLocationEmployeeWeeklyHours.fulfilled, (state, action) => {
        state.employeeLocationSchedulesByWeekLoading = false;
        state.EmployeeLocationSchedulesByWeek = action.payload;
      })
      .addCase(getLocationEmployeeWeeklyHours.rejected, (state, action) => {
        state.employeeLocationSchedulesByWeekLoading = false;
        state.employeeLocationSchedulesByWeekError = action.payload;
      })
      .addCase(fetchRestrictions.fulfilled, (state, action) => {
        state.employeeRestrictionList = action.payload;
      });
  },
});

export const { resetEmployees, setSearch, refreshEmployees } =
  employeeSlice.actions;
export default employeeSlice.reducer;
