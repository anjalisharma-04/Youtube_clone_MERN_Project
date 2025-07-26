// frontend/src/Redux/slice/commentsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all comments for a specific video
export const fetchCommentsByVideoId = createAsyncThunk(
  'comments/fetchByVideoId',
  async (videoId) => {
    const res = await axios.get(`/api/v1/comments/video/${videoId}`);
    return res.data.data;
  }
);

// Add a new comment to a video
export const addComment = createAsyncThunk(
  'comments/add',
  async ({ videoId, comment }) => {
    const res = await axios.post(`/api/v1/comments/video/${videoId}`, { comment });
    return res.data.data;
  }
);

// Remove a comment by ID
export const deleteComment = createAsyncThunk(
  'comments/delete',
  async ({ videoId, commentId }) => {
    await axios.delete(`/api/v1/comments/${commentId}`);
    return { videoId, commentId };
  }
);

// Edit an existing comment
export const updateComment = createAsyncThunk(
  'comments/update',
  async ({ videoId, commentId, newComment }) => {
    const res = await axios.put(`/api/v1/comments/${commentId}`, { newComment });
    return {
      videoId,
      commentId,
      updatedComment: res.data.data
    };
  }
);

// Comments Slice
const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByVideoId.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (c) => c._id !== action.payload.commentId
        );
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (c) => c._id === action.payload.commentId
        );
        if (index !== -1) {
          state.comments[index] = action.payload.updatedComment;
        }
      });
  }
});

export default commentsSlice.reducer;
