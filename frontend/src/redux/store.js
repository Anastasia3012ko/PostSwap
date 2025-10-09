import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import postReducer from './slices/postSlice';
import followReducer from './slices/followSlice'
import likeReducer from './slices/likeSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    post: postReducer,
    follow: followReducer,
    likes: likeReducer

  },
});

export default store;