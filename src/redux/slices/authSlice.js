import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // ✅ Use environment variable

// ✅ Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/login`,
        userData,
        {
          withCredentials: true, // ✅ Include cookies in request
        },
      );

      return response.data; // { message, roleName }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

// Async thunk to handle logout API call
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(
        `${API_BASE_URL}/users/logout`,
        {},
        {
          withCredentials: true,
        },
      ); // Clears token from backend
      return true; // Return success
    } catch (error) {
      return rejectWithValue(error.response?.data || "Logout failed");
    }
  },
);

export const getScheduleByToken = createAsyncThunk(
  "schedules/getByToken",
  async (responseToken, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/users/by-token/${responseToken}`,
        {
          withCredentials: true,
        },
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch schedule");
    }
  },
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/check-validity`, {
        withCredentials: true,
      });
      return response.data; // { auth: true, roleName }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Session expired",
      );
    }
  },
);

export const respondToSchedule = createAsyncThunk(
  "schedules/respondToSchedule",
  async ({ responseToken, response }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/users/schedule/respond`,
        {
          response_token: responseToken,
          status: response,
        },
        { withCredentials: true },
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to respond to schedule",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    auth: false,
    roleName: null,
    isLoading: false,
    error: null,
    checkAuthLoading: null,
    checkAuthError: null,

    tokenSchedule: null,
    tokenScheduleLoading: false,
    tokenScheduleError: null,
  },
  reducers: {
    // logout: (state) => {
    //   state.user = null;
    //   state.roleName = null;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roleName = action.payload.roleName;
        state.auth = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(checkAuth.pending, (state) => {
        state.checkAuthLoading = true;
        state.checkAuthError = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.checkAuthLoading = false;
        state.auth = true;
        state.roleName = action.payload.roleName;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.checkAuthLoading = false;
        state.auth = false;
        state.roleName = null;
        state.checkAuthError = action.payload;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.auth = false;
        state.roleName = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(getScheduleByToken.pending, (state) => {
        state.tokenScheduleLoading = true;
        state.tokenScheduleError = null;
      })
      .addCase(getScheduleByToken.fulfilled, (state, action) => {
        state.tokenScheduleLoading = false;
        state.tokenSchedule = action.payload;
      })
      .addCase(getScheduleByToken.rejected, (state, action) => {
        state.tokenScheduleLoading = false;
        state.tokenScheduleError = action.payload;
        state.tokenSchedule = null;
      });
  },
});

export default authSlice.reducer;
