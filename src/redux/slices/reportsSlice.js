import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axiosInstance";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Async thunk to fetch metadata (employees + locations)
export const fetchMetadata = createAsyncThunk(
  "reports/fetchMetadata",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/metadata`, {
        withCredentials: true,
      });
      return response.data.data; // contains { employees, locations }
    } catch (error) {
      console.log(error, "?>>>>>>>>>>>>");
      return rejectWithValue(
        error.response?.data?.message || "Error fetching metadata",
      );
    }
  },
);

const reportsSlice = createSlice({
  name: "reports",
  initialState: {
    employees: [],
    locations: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMetadata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMetadata.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.employees;
        state.locations = action.payload.locations;
      })
      .addCase(fetchMetadata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reportsSlice.reducer;
