import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axiosInstance";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Fetch User Profile
export const getUserProfile = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/employees/profile`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile",
      );
    }
  },
);

// ✅ Upload Profile Picture
export const uploadProfilePic = createAsyncThunk(
  "user/uploadProfilePic",
  async (imageFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await axios.post(
        `${API_BASE_URL}/employees/upload-profile-pic`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      return response.data.imageUrl;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload image",
      );
    }
  },
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/change-password`,
        { currentPassword, newPassword },
        { withCredentials: true },
      );
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update password",
      );
    }
  },
);

// ✅ User Slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    isLoading: false,
    error: null,
    imageUrl: null,
    user: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(uploadProfilePic.fulfilled, (state, action) => {
        state.imageUrl = action.payload;
        if (state.profile) {
          state.profile.image_url = action.payload;
        }
      })
      .addCase(uploadProfilePic.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
