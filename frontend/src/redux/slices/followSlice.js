import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const followUser = createAsyncThunk(
  'follow/followUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/follow/${userId}`, {}, { withCredentials: true }
      );
      return response.data; // user
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const unfollowUser = createAsyncThunk(
  'follow/unfollowUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/unfollow/${userId}`, {
        withCredentials: true,
      });
      return response.data; // user
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const followSlice = createSlice({
  name: 'follow',
  initialState: {
    isFollowing: false,
    followersCount: 0,
    followingCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    setIsFollowing: (state, action) => {
      state.isFollowing = action.payload;
    },
    setFollowersCount: (state, action) => {
      state.followersCount = action.payload;
    },
    setFollowingCount: (state, action) => {
      state.followingCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(followUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isFollowing = true;
        state.followersCount = action.payload.user.followersCount;
        state.followingCount = action.payload.user.followingCount;
      })
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(unfollowUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isFollowing = false;
        state.followersCount = action.payload.user.followersCount;
        state.followingCount = action.payload.user.followingCount;
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setIsFollowing, setFollowersCount, setFollowingCount } = followSlice.actions;
export default followSlice.reducer;
