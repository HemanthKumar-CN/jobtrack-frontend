import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axiosInstance";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Async thunk to create an event
export const createEvent = createAsyncThunk(
  "event/createEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/events`, eventData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

// Async thunk to fetch all events
export const fetchEvents = createAsyncThunk(
  "event/fetchEvents",
  async ({ search = "", sortField, sortOrder }, { rejectWithValue }) => {
    console.log("Fetching events with search:", search);
    try {
      const response = await axios.get(`${API_BASE_URL}/events`, {
        params: { search, sortField, sortOrder },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateEvent = createAsyncThunk(
  "event/updateEvent",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/events/${id}`,
        updatedData,
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating event");
    }
  },
);

export const deleteEvent = createAsyncThunk(
  "event/deleteEvent",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/events/${id}`, {
        withCredentials: true,
      });
      return id; // Return deleted event ID
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting event");
    }
  },
);

export const fetchEventById = createAsyncThunk(
  "event/fetchEventById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching event");
    }
  },
);

// Async thunk to fetch dashboard data
export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/locations/dashboard`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch data");
    }
  },
);

const eventSlice = createSlice({
  name: "event",
  initialState: {
    events: [],
    newEvent: null,
    event: null,
    eventLoading: false,
    eventError: null,

    totalSchedules: 0,
    totalEmployees: 0,
    totalLocations: 0,
    totalContractors: 0,
    overworkedEmployees: [],
    dashboardLoading: false,
    dashboardError: null,
  },
  reducers: {
    clearEvent: (state) => {
      state.event = null;
      state.newEvent = null;
      state.eventError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEvent.pending, (state) => {
        state.eventLoading = true;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.eventLoading = false;
        state.events.push(action.payload);
        state.newEvent = action.payload;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.eventLoading = false;
        state.eventError = action.payload;
      })
      .addCase(fetchEvents.pending, (state) => {
        state.eventLoading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.eventLoading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.eventLoading = false;
        state.eventError = action.payload;
      })
      // Fetch event by ID
      .addCase(fetchEventById.pending, (state) => {
        state.eventLoading = true;
        state.eventError = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.eventLoading = false;
        state.event = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.eventLoading = false;
        state.eventError = action.payload;
      })
      .addCase(updateEvent.pending, (state) => {
        state.eventLoading = true;
        state.eventError = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.eventLoading = false;
        // Update the event in the events list
        state.events = state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event,
        );
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.eventLoading = false;
        state.eventError = action.payload;
      })
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        // Remove event from the list
        state.events = state.events.filter(
          (event) => event.id !== action.payload,
        );
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.totalSchedules = action.payload.totalSchedules;
        state.totalEmployees = action.payload.totalEmployees;
        state.totalLocations = action.payload.totalLocations;
        state.totalContractors = action.payload.totalContractors;
        state.overworkedEmployees = action.payload.overworkedEmployees;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEvent } = eventSlice.actions;

export default eventSlice.reducer;
