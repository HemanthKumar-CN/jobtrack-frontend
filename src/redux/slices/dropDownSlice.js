import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axiosInstance";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Async thunk to fetch all locations
export const fetchLocationsList = createAsyncThunk(
  "dropDown/fetchLocations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/locations/all`, {
        withCredentials: true,
      });
      return response.data.locations; // Extract locations array
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

// Async thunk to fetch contractors dropdown data
export const fetchContractorsDropdown = createAsyncThunk(
  "dropdown/fetchContractors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contractors/list`, {
        withCredentials: true,
      }); // Adjust API route if needed
      return response.data.contractors;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch contractors",
      );
    }
  },
);

export const fetchEmployeesDropdown = createAsyncThunk(
  "employees/fetchAllEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/employees/list`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching employees",
      );
    }
  },
);

const dropDownSlice = createSlice({
  name: "dropDown",
  initialState: {
    locationsList: [],
    locationLoading: false,
    locationError: null,

    contractors: [],
    contractorsLoading: false,
    contractorsError: null,

    employees: [],
    employeesLoading: false,
    employeesError: null,
  },
  reducers: {}, // Can add more dropdown-related reducers later
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocationsList.pending, (state) => {
        state.locationLoading = true;
        state.locationError = null;
      })
      .addCase(fetchLocationsList.fulfilled, (state, action) => {
        state.locationLoading = false;
        state.locationsList = action.payload;
      })
      .addCase(fetchLocationsList.rejected, (state, action) => {
        state.locationLoading = false;
        state.locationError = action.payload;
      })
      .addCase(fetchContractorsDropdown.pending, (state) => {
        state.contractorsLoading = true;
        state.contractorsError = null;
      })
      .addCase(fetchContractorsDropdown.fulfilled, (state, action) => {
        state.contractorsLoading = false;
        state.contractors = action.payload;
      })
      .addCase(fetchContractorsDropdown.rejected, (state, action) => {
        state.contractorsLoading = false;
        state.contractorsError = action.payload;
      })
      .addCase(fetchEmployeesDropdown.pending, (state) => {
        state.employeesLoading = true;
        state.employeesError = null;
      })
      .addCase(fetchEmployeesDropdown.fulfilled, (state, action) => {
        state.employeesLoading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployeesDropdown.rejected, (state, action) => {
        state.employeesLoading = false;
        state.employeesError = action.payload;
      });
  },
});

export default dropDownSlice.reducer;
