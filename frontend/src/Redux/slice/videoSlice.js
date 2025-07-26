// frontend/src/Redux/slice/videoSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state structure
const initialState = {
  videos: [],
  userVideos: [],
  video: null,
  loading: false,
  error: null,
  status: false,
};

// Async actions for API calls

// Fetch all videos
export const fetchAllVideos = createAsyncThunk(
  'videos/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/v1/videos/allVideo');
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch videos uploaded by a specific user
export const fetchAllUserVideos = createAsyncThunk(
  'videos/fetchByUser',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/v1/videos/allUserVideo/${userId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Get details of a single video
export const fetchVideoById = createAsyncThunk(
  'videos/fetchOne',
  async (videoId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/v1/videos/videoData/${videoId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Upload a new video
export const publishVideo = createAsyncThunk(
  'videos/publish',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/v1/videos/publish', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete a video
export const deleteVideo = createAsyncThunk(
  'videos/delete',
  async (videoId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/v1/videos/delete/${videoId}`);
      return videoId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Increment views on a video
export const incrementView = createAsyncThunk(
  'videos/incrementView',
  async (videoId, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/v1/videos/incrementView/${videoId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Like a video
export const likeVideo = createAsyncThunk(
  'videos/like',
  async ({ videoId, userId }, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/v1/videos/like', { videoId, userId });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Remove like from a video
export const removeLikeVideo = createAsyncThunk(
  'videos/unlike',
  async ({ videoId, userId }, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/v1/videos/removelike', { videoId, userId });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update video details
export const updateVideo = createAsyncThunk(
  'videos/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/v1/videos/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.video;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Slice definition
const videoSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    resetUserVideos: (state) => {
      state.userVideos = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload;
      })
      .addCase(fetchAllVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllUserVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.userVideos = action.payload;
      })

      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.loading = false;
        state.video = action.payload;
      })

      .addCase(publishVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.videos.push(action.payload);
      })

      .addCase(deleteVideo.fulfilled, (state, action) => {
        const id = action.payload;
        state.videos = state.videos.filter((video) => video._id !== id);
        state.userVideos = state.userVideos.filter((video) => video._id !== id);
      })

      .addCase(incrementView.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.videos.findIndex((v) => v._id === updated._id);
        if (idx !== -1) state.videos[idx] = updated;
      })

      .addCase(likeVideo.fulfilled, (state, action) => {
        if (state.video) {
          state.video.likes.push(action.payload.userId);
        }
      })

      .addCase(removeLikeVideo.fulfilled, (state, action) => {
        if (state.video) {
          state.video.likes = state.video.likes.filter((id) => id !== action.payload.userId);
        }
      })

      .addCase(updateVideo.fulfilled, (state, action) => {
        state.video = action.payload;
      });
  },
});

export const { resetUserVideos } = videoSlice.actions;
export default videoSlice.reducer;
