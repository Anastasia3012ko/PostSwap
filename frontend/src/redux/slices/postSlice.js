import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const initialState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
};

const API_URL = 'http://localhost:3000/api/posts';

//
export const createPost = createAsyncThunk(
  'posts/createPost',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/`, formData,{
          withCredentials: true,
        });
      return res.data.post;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 
export const fetchPostById = createAsyncThunk(
  'posts/getPostById',
  async (postId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/${postId}`, {
          withCredentials: true,
        });
      return res.data.post;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 
export const fetchAllPosts = createAsyncThunk(
  'posts/getAllPosts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}`,  {
          withCredentials: true,
        });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 
export const fetchAllPostsOneUser = createAsyncThunk(
  'posts/getAllPostsOneUser',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/user/${userId}`, {
          withCredentials: true,
        });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 
export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ postId, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${postId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      return res.data.post;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 
export const deletePostById = createAsyncThunk(
  'posts/deletePostById',
  async (postId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_URL}/${postId}`, {
          withCredentials: true,
        });
      return { postId, message: res.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearCurrentPost(state) {
      state.currentPost = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createPost
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload); // add to begin
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getPostById
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getAllPosts
      .addCase(fetchAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getAllPostsOneUser
      .addCase(fetchAllPostsOneUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPostsOneUser.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchAllPostsOneUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updatePost
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
        if (state.currentPost?._id === action.payload._id) {
          state.currentPost = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deletePostById
      .addCase(deletePostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePostById.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter((p) => p._id !== action.payload.postId);
        if (state.currentPost?._id === action.payload.postId) {
          state.currentPost = null;
        }
      })
      .addCase(deletePostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentPost, clearError } = postsSlice.actions;
export default postsSlice.reducer;