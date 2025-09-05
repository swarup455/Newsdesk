import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../redux-toolkit/Auth/authSlice"
import articleReducer from "../redux-toolkit/Article/articleSlice"
import likeReducer from "../redux-toolkit/Like/likeSlice"
import bookmarkReducer from "../redux-toolkit/Bookmark/bookmarkSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    article: articleReducer,
    like: likeReducer,
    bookmark: bookmarkReducer
  }
})