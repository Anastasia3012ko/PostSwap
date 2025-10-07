import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: null,
  searchResults: [],
  loading: false,
  error: null,
};

const API_URL = 'http://localhost:3000/api/users';

export const fetchUserById = createAsyncThunk(
  'user/fetchById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${userId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Server error');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      for (let key in data) {
        if (data[key] !== undefined) formData.append(key, data[key]);
      }

      const res = await axios.put(`${API_URL}/update/${userId}`, formData, {
        withCredentials: true,
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateAvatar = createAsyncThunk(
  'user/updateAvatar',
  async ({ userId, avatar }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/upload-avatar/${userId}`,
        avatar,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Error with loading avatar'
      );
    }
  }
);

export const searchUsers = createAsyncThunk(
  'user/search',
  async (query, { rejectWithValue }) => {
    try {
      if (!query || query.trim() === '') return [];

      const response = await axios.post(
        `${API_URL}/search`,
        { query },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Server error');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
    },
     clearSearchResults: (state) => {
      state.searchResults = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUserById
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateAvatar
      .addCase(updateAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.loading = false;
        // state.user = action.payload.user.avatar?.url;
        state.user = {
          ...state.user,
          ...action.payload.user,
          avatar: action.payload.user.avatar?.url || null,
        };
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //searchUser
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.searchResults = []; // очистка старых результатов
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUser, clearSearchResults } = userSlice.actions;
export default userSlice.reducer;
