import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state for the channel slice
const initialState = {
  channel: null,
  loading: false,
  error: null,
  successMessage: null,
};

// ===== Thunks for async operations =====

// Create a new channel
export const createChannel = createAsyncThunk(
  "channel/createChannel",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/channel/create", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return response.data.channel;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Unable to create channel");
    }
  }
);

// Fetch channel by ID
export const getChannel = createAsyncThunk(
  "channel/getChannel",
  async (channelId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/v1/channel/data/${channelId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Error fetching channel");
    }
  }
);

// Update existing channel
export const updateChannel = createAsyncThunk(
  "channel/updateChannel",
  async ({ channelId, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/v1/channel/update/${channelId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Channel update failed");
    }
  }
);

// Delete a channel
export const deleteChannel = createAsyncThunk(
  "channel/deleteChannel",
  async (channelId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`/api/v1/channel/delete/${channelId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Channel deletion failed");
    }
  }
);

// Subscribe to a channel
export const subscribeChannel = createAsyncThunk(
  "channel/subscribe",
  async (channelId, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/api/v1/channel/subscribe/${channelId}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Subscription failed");
    }
  }
);

// Unsubscribe from a channel
export const unsubscribeChannel = createAsyncThunk(
  "channel/unsubscribe",
  async (channelId, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/api/v1/channel/unsubscribe/${channelId}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Unsubscription failed");
    }
  }
);

// ===== Slice =====
const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createChannel
      .addCase(createChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.channel = action.payload;
        state.successMessage = "Channel created successfully";
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getChannel
      .addCase(getChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.channel = action.payload;
      })
      .addCase(getChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateChannel
      .addCase(updateChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.channel = action.payload;
        state.successMessage = "Channel updated successfully";
      })
      .addCase(updateChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteChannel
      .addCase(deleteChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteChannel.fulfilled, (state) => {
        state.loading = false;
        state.channel = null;
        state.successMessage = "Channel deleted successfully";
      })
      .addCase(deleteChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // subscribeChannel
      .addCase(subscribeChannel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(subscribeChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // unsubscribeChannel
      .addCase(unsubscribeChannel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(unsubscribeChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccessMessage } = channelSlice.actions;
export default channelSlice.reducer;
