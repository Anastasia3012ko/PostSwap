import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = 'http://localhost:3000/api/likes';

export const likePost = createAsyncThunk(
  "likes/likePost",
  async (postId, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/${postId}`, {}, { withCredentials: true });
      return { postId, likesCount: res.data.likesCount };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const unlikePost = createAsyncThunk(
  "likes/unlikePost",
  async (postId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_URL}/${postId}`, { withCredentials: true });
      return { postId, likesCount: res.data.likesCount };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const likesSlice = createSlice({
  name: "likes",
  initialState: {
    entities: {},   // { [postId]: likesCount }
    userLikes: {},  // { [postId]: true/false }
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // LIKE POST
      .addCase(likePost.pending, (state, action) => {
        const postId = action.meta.arg;
        state.loading = true;
        state.error = null;
        state.entities[postId] = (state.entities[postId] || 0) + 1;
        state.userLikes[postId] = true; 
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, likesCount } = action.payload;
        state.entities[postId] = likesCount;
        state.userLikes[postId] = true;
        state.loading = false;
      })
      .addCase(likePost.rejected, (state, action) => {
        const postId = action.meta.arg;
        state.entities[postId] = Math.max((state.entities[postId] || 1) - 1, 0);
        state.userLikes[postId] = false;
        state.loading = false;
        state.error = action.payload;
      })
      // UNLIKE POST
      .addCase(unlikePost.pending, (state, action) => {
        const postId = action.meta.arg;
        state.loading = true;
        state.error = null;
        state.entities[postId] = Math.max((state.entities[postId] || 1) - 1, 0);
        state.userLikes[postId] = false;
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        const { postId, likesCount } = action.payload;
        state.entities[postId] = likesCount;
        state.userLikes[postId] = false;
        state.loading = false;
      })
      .addCase(unlikePost.rejected, (state, action) => {
        const postId = action.meta.arg;
        state.entities[postId] = (state.entities[postId] || 0) + 1;
        state.userLikes[postId] = true;
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default likesSlice.reducer;