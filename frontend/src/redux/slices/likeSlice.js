import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  entities: {}, // postId → { likesCount, userLiked }
  loading: false,
  error: null,
};

const API_URL = 'http://localhost:3000/api/likes';

export const fetchLikes = createAsyncThunk('likes/fetchLikes', async (_, thunkAPI) => {
  try {
    const res = await axios.get(`${API_URL}/`, {
          withCredentials: true,
        });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error fetching likes');
  }
});


export const likePost = createAsyncThunk('likes/likePost', async (postId, thunkAPI) => {
  try {
    await axios.post(`${API_URL}/${postId}`, {}, {
          withCredentials: true,
        });
    return postId;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error liking post');
  }
});


export const unlikePost = createAsyncThunk('likes/unlikePost', async (postId, thunkAPI) => {
  try {
    await axios.delete(`${API_URL}/${postId}`, {
          withCredentials: true,
        });
    return postId;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error unliking post');
  }
});

const likeSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchLikes
      .addCase(fetchLikes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLikes.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload;
      })
      .addCase(fetchLikes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // likePost
      .addCase(likePost.fulfilled, (state, action) => {
        const postId = action.payload;
        if (state.entities[postId]) {
          state.entities[postId].likesCount += 1;
          state.entities[postId].userLiked = true;
        }
      })

      // unlikePost
      .addCase(unlikePost.fulfilled, (state, action) => {
        const postId = action.payload;
        if (state.entities[postId]) {
          state.entities[postId].likesCount = Math.max(0, state.entities[postId].likesCount - 1);
          state.entities[postId].userLiked = false;
        }
      });
  },
});

export default likeSlice.reducer;
