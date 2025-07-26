import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: null,
  accessToken: null,
  hasChannel: false,
  loading: false,
  error: null,
  status: false,
};

// ✅ Register
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/v1/account/signup', userData);
      return res.data.data; // { user, accessToken, hasChannel }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Signup failed');
    }
  }
);

// ✅ Login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axios.post('http://localhost:5000/api/v1/account/login', credentials);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

// ✅ Logout
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post('http://localhost:5000/api/v1/account/logout');
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Logout failed');
    }
  }
);

// ✅ Get User Info
export const getUserData = createAsyncThunk(
  'auth/getUserData',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/v1/account/userData/${userId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Unable to fetch user data');
    }
  }
);

// ✅ Delete Account
export const deleteAccount = createAsyncThunk(
  'auth/deleteAccount',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`/api/v1/account/delete/${userId}`);
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Delete failed');
    }
  }
);

// ✅ Update Account
export const updateAccount = createAsyncThunk(
  'auth/updateAccount',
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/v1/account/update/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

// ✅ Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.accessToken = payload.accessToken;
        state.hasChannel = payload.hasChannel;
        state.status = true;
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.status = true;
        state.user = payload.user;
        state.accessToken = payload.accessToken;
        state.hasChannel = payload.hasChannel;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loading = false;
        state.status = false;
        state.error = payload;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.status = false;
        state.hasChannel = false;
      })
      .addCase(logout.rejected, (state, { payload }) => {
        state.error = payload;
      })

      // Get User Data
      .addCase(getUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserData.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
      })
      .addCase(getUserData.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Delete Account
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.status = false;
      })
      .addCase(deleteAccount.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Update Account
      .addCase(updateAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAccount.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
      })
      .addCase(updateAccount.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default authSlice.reducer;
