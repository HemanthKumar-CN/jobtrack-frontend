import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fetch all contractors
// Fetch contractors with pagination and search
export const fetchContractors = createAsyncThunk(
  "contractors/fetchContractors",
  async ({ page = 1, search = "" }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contractors`, {
        params: { page, limit: 10, search },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch data");
    }
  },
);

// Fetch contractor by ID
export const fetchContractorById = createAsyncThunk(
  "contractors/fetchContractorById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contractors/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching contractor",
      );
    }
  },
);

// Create a new contractor
export const createContractor = createAsyncThunk(
  "contractors/createContractor",
  async (contractorData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/contractors`,
        contractorData,
        {
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error creating contractor",
      );
    }
  },
);

// Update contractor by ID
export const updateContractor = createAsyncThunk(
  "contractors/updateContractor",
  async ({ id, contractorData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/contractors/${id}`,
        contractorData,
        {
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error updating contractor",
      );
    }
  },
);

// Delete contractor
export const deleteContractor = createAsyncThunk(
  "contractors/deleteContractor",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/contractors/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error deleting contractor",
      );
    }
  },
);

const contractorsSlice = createSlice({
  name: "contractors",
  initialState: {
    contractors: [],
    contractor: null,
    newContractor: null,
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,
    search: "",
  },
  reducers: {
    resetContractors: (state) => {
      state.contractors = [];
      state.page = 1;
      state.totalPages = 1;
      state.newContractor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all contractors
      .addCase(fetchContractors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContractors.fulfilled, (state, action) => {
        state.loading = false;
        state.contractors =
          action.payload.currentPage === 1
            ? action.payload.contractors
            : [...state.contractors, ...action.payload.contractors];

        if (action.payload.contractors == 0) {
          return;
        }

        console.log(action.payload.currentPage, "+============= Page");

        // state.contractors = [
        //   ...state.contractors,
        //   ...action.payload.contractors,
        // ];
        state.totalPages = action.payload.totalPages;
        state.page = action.payload.currentPage;
      })
      .addCase(fetchContractors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch contractor by ID
      .addCase(fetchContractorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContractorById.fulfilled, (state, action) => {
        state.loading = false;
        state.contractor = action.payload;
      })
      .addCase(fetchContractorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create contractor
      .addCase(createContractor.pending, (state) => {
        state.loading = true;
      })
      .addCase(createContractor.fulfilled, (state, action) => {
        state.loading = false;
        state.newContractor = action.payload;
      })
      .addCase(createContractor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update contractor
      .addCase(updateContractor.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateContractor.fulfilled, (state, action) => {
        state.loading = false;
        state.contractors = state.contractors.map((contractor) =>
          contractor.id === action.payload.id ? action.payload : contractor,
        );
      })
      .addCase(updateContractor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete contractor
      .addCase(deleteContractor.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteContractor.fulfilled, (state, action) => {
        state.loading = false;
        state.contractors = state.contractors.filter(
          (contractor) => contractor.id !== action.payload,
        );
      })
      .addCase(deleteContractor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { resetContractors } = contractorsSlice.actions;

export default contractorsSlice.reducer;
