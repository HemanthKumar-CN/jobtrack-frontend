import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { format } from "date-fns";
import { parseISO } from "date-fns";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const localTimeConversion = (dateString, timeString) => {
  if (!dateString || !timeString) return null;

  // Create a valid UTC datetime string
  const utcDateTime = new Date(`${dateString}T${timeString}Z`);

  // Format the date in local time
  return format(utcDateTime, "hh:mm a"); // Use "HH:mm" for 24-hour format
};

// 🔹 Create Bulk Schedules
export const createBulkSchedule = createAsyncThunk(
  "schedules/createBulkSchedule",
  async (scheduleData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/schedules`,
        scheduleData,
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error creating schedules",
      );
    }
  },
);

// Async thunk to fetch schedules
export const fetchSchedule = createAsyncThunk(
  "schedules/fetchSchedule",
  async (date, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/schedules/${date}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching schedule");
    }
  },
);

// Async thunk for fetching weekly schedules
export const fetchWeeklySchedule = createAsyncThunk(
  "schedules/fetchWeeklySchedule",
  async (date, { rejectWithValue }) => {
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const response = await axios.get(
        `${API_BASE_URL}/schedules?currentWeekStart=${formattedDate}`,
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching weekly schedules",
      );
    }
  },
);

// Async thunk to fetch the monthly schedule
export const getMonthlySchedule = createAsyncThunk(
  "schedules/getMonthlySchedule",
  async (date, { rejectWithValue }) => {
    try {
      const formattedMonth = format(date, "yyyy-MM");
      const response = await axios.get(
        `${API_BASE_URL}/schedules/monthlySchedule/${formattedMonth}`,
        { withCredentials: true },
      );
      return response.data; // Returns resolved data
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching monthly schedules",
      );
    }
  },
);

// Async thunk for fetching schedules
export const fetchEmployeeSchedules = createAsyncThunk(
  "schedules/fetchSchedules",
  async ({ employeeId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/schedules/employee_schedule/${employeeId}`,
        {
          params: { startDate, endDate },
          withCredentials: true,
        },
      );
      return response.data.data; // Assuming API response format: { data: [...] }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch schedules",
      );
    }
  },
);

// 🔹 Schedule Slice
const scheduleSlice = createSlice({
  name: "schedules",
  initialState: {
    schedules: [],
    weeklySchedules: [],
    monthlySchedules: [],
    employeeSchedules: [],
    loading: false,
    newSchedule: null,
    error: null,
    schedulesLoading: false,
    schedulesError: null,
  },
  reducers: {
    clearSchedule: (state) => {
      state.newSchedule = null;
    },
  }, // No synchronous reducers needed
  extraReducers: (builder) => {
    builder
      // ✅ Handle Create Bulk Schedules
      .addCase(createBulkSchedule.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBulkSchedule.fulfilled, (state, action) => {
        console.log(action.payload), "]]]===";
        state.loading = false;
        state.newSchedule = action.payload;
      })
      .addCase(createBulkSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchSchedule.pending, (state) => {
        state.schedulesLoading = true;
      })
      .addCase(fetchSchedule.fulfilled, (state, action) => {
        state.schedulesLoading = false;
        state.schedules = action.payload;
      })
      .addCase(fetchSchedule.rejected, (state, action) => {
        state.schedulesLoading = false;
        state.schedulesError = action.payload;
      })
      .addCase(fetchWeeklySchedule.pending, (state) => {
        state.schedulesLoading = true;
      })
      .addCase(fetchWeeklySchedule.fulfilled, (state, action) => {
        state.schedulesLoading = false;
        state.weeklySchedules = action.payload;
      })
      .addCase(fetchWeeklySchedule.rejected, (state, action) => {
        state.schedulesLoading = false;
        state.schedulesError = action.payload;
      })
      .addCase(getMonthlySchedule.pending, (state) => {
        state.schedulesLoading = true;
        state.schedulesError = null;
      })
      .addCase(getMonthlySchedule.fulfilled, (state, action) => {
        state.schedulesLoading = false;
        state.monthlySchedules = action.payload;
      })
      .addCase(getMonthlySchedule.rejected, (state, action) => {
        state.schedulesLoading = false;
        state.schedulesError = action.payload;
      })
      .addCase(fetchEmployeeSchedules.pending, (state) => {
        state.schedulesLoading = true;
        state.schedulesError = null;
      })
      .addCase(fetchEmployeeSchedules.fulfilled, (state, action) => {
        console.log(action.payload, ">>>>LLLLLLLL");
        state.schedulesLoading = false;
        state.employeeSchedules = action.payload.map((schedule) => ({
          ...schedule,
          start_time: localTimeConversion(
            schedule.start_date,
            schedule.start_time,
          ),
          end_time: localTimeConversion(schedule.start_date, schedule.end_time),
          raw_start_time: schedule.start_time, // ✅ Keep raw time for calculations
          raw_end_time: schedule.end_time, // ✅ Keep raw time for calculations
        }));
      })
      .addCase(fetchEmployeeSchedules.rejected, (state, action) => {
        state.schedulesLoading = false;
        state.schedulesError = action.payload;
      });
  },
});

export const { clearSchedule } = scheduleSlice.actions;

export default scheduleSlice.reducer;
