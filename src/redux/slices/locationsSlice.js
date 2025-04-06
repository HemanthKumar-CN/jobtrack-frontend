import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchLocations = createAsyncThunk(
  "locations/fetchLocations",
  async ({ page, search }) => {
    const response = await axios.get(
      `${API_BASE_URL}/locations?page=${page}&limit=10&search=${search}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  },
);

// Async thunk to fetch locations with employee count
export const fetchLocationsDashboard = createAsyncThunk(
  "locations/fetchLocationsDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/locations/employeeCount`,
        {
          withCredentials: true,
        },
      );
      return response.data.data; // Extract data array
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch locations",
      );
    }
  },
);

// Create Location
export const createLocation = createAsyncThunk(
  "locations/createLocation",
  async (
    {
      locationName,
      address1,
      address2,
      selectedCity,
      selectedState,
      zip,
      file,
    },
    { rejectWithValue },
  ) => {
    try {
      const formData = new FormData();
      formData.append("name", locationName);
      formData.append("address_1", address1);
      formData.append("address_2", address2);
      formData.append("city", selectedCity);
      formData.append("state", selectedState);
      formData.append("postal_code", zip);

      if (file) {
        formData.append("image", file);
      }

      const response = await axios.post(`${API_BASE_URL}/locations`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create location",
      );
    }
  },
);

// Fetch a single location by ID
export const fetchLocationById = createAsyncThunk(
  "locations/fetchLocationById",
  async (id) => {
    const response = await axios.get(`${API_BASE_URL}/locations/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },
);

export const editLocation = createAsyncThunk(
  "locations/editLocation",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", updatedData.locationName);
      formData.append("address_1", updatedData.address1);
      formData.append("address_2", updatedData.address2);
      formData.append("city", updatedData.selectedCity);
      formData.append("state", updatedData.selectedState);
      formData.append("postal_code", updatedData.zip);

      if (updatedData.file) {
        formData.append("image", updatedData.file); // Append image if updated
      }

      const response = await axios.put(
        `${API_BASE_URL}/locations/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update location",
      );
    }
  },
);

// Delete Location
export const deleteLocation = createAsyncThunk(
  "locations/deleteLocation",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/locations/${id}`, {
        withCredentials: true,
      });
      return id; // Return deleted location ID
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to delete");
    }
  },
);

const locationsSlice = createSlice({
  name: "locations",
  initialState: {
    data: [],
    dashboardLocationsData: [],
    locationLoading: false,
    locationError: null,

    loading: false,
    error: null,
    totalPages: 1,
    creationLoading: false,
    creationError: null,
    newData: null,
    selectedLocation: null, // For edit/view location
    updateLoading: false,
    updateError: null,
  },
  reducers: {
    resetNewData: (state) => {
      state.newData = null;
    },
    resetSelectedLocation: (state) => {
      state.selectedLocation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
        state.data = []; // Reset data on new request
        state.error = null; // Reset error on new request
        state.totalPages = 1; // Reset total pages on new request
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.locations.length === 0) {
          return; // Do not update state if empty array is returned
        }

        state.data = [...state.data, ...action.payload.locations]; // Append new data
        state.totalPages = action.payload.totalPages; // Store total pages
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch Location by ID
      .addCase(fetchLocationById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLocationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLocation = action.payload;
      })
      .addCase(fetchLocationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create Location
      .addCase(createLocation.pending, (state) => {
        state.creationLoading = true;
        state.creationError = null; // Reset error on new request
      })
      .addCase(createLocation.fulfilled, (state, action) => {
        state.creationLoading = false;
        state.newData = action.payload; // Append new location
      })
      .addCase(createLocation.rejected, (state, action) => {
        state.creationLoading = false;
        state.creationError = action.payload;
      })
      // Edit Location
      .addCase(editLocation.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(editLocation.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.selectedLocation = action.payload; // Update selected location data
      })
      .addCase(editLocation.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.error.message;
      })
      // Handle Delete Location
      .addCase(deleteLocation.fulfilled, (state, action) => {
        state.data = state.data.filter((loc) => loc.id !== action.payload);
      })
      .addCase(deleteLocation.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(fetchLocationsDashboard.pending, (state) => {
        state.locationLoading = true;
        state.locationError = null;
      })
      .addCase(fetchLocationsDashboard.fulfilled, (state, action) => {
        state.locationLoading = false;
        state.dashboardLocationsData = action.payload;
      })
      .addCase(fetchLocationsDashboard.rejected, (state, action) => {
        state.locationLoading = false;
        state.locationError = action.payload;
      });
  },
});

export const { resetNewData, resetSelectedLocation } = locationsSlice.actions;
export default locationsSlice.reducer;
