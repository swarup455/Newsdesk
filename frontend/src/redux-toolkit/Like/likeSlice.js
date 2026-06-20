import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";
import { auth } from "../Auth/firebase";

export const addLike = createAsyncThunk(
    "likes/addLike",
    async ({ articleId }, { rejectWithValue }) => {
        try {
            const res = await api.post("/like/set-like", { articleId });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
)

export const removeLike = createAsyncThunk(
    "likes/removeLike",
    async ({ articleId}, { rejectWithValue }) => {
        try {
            const res = await api.post("/like/delete-like", { articleId });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
)

export const getLikedArticles = createAsyncThunk("likes/getLikedArticles",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/like/get-liked-articles");
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
)

const likeSlice = createSlice({
    name: "likes",
    initialState: {
        likedArticles: [],
        addLikeLoading: false,
        removeLikeLoading: false,
        getLikedArticlesLoading: false,
        addLikeError: null,
        removeLikeError: null,
        getLikedArticlesError: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // ---- addLike ----
        builder
            .addCase(addLike.pending, (state) => {
                state.addLikeLoading = true;
                state.addLikeError = null;
            })
            .addCase(addLike.fulfilled, (state, action) => {
                state.addLikeLoading = false;
                state.addLikeError = null;
                // append new like
                const newArticle = action.payload.data.article;
                if (!state.likedArticles.some(a => a._id === newArticle._id)) {
                    state.likedArticles.push(newArticle);
                }
            })
            .addCase(addLike.rejected, (state, action) => {
                state.addLikeLoading = false;
                state.addLikeError = action.payload.data;
            })
            // ---- removeLike ----
            .addCase(removeLike.pending, (state) => {
                state.removeLikeLoading = true;
                state.removeLikeError = null;
            })
            .addCase(removeLike.fulfilled, (state, action) => {
                state.removeLikeLoading = false;
                state.removeLikeError = null;
                // remove articleId
                const removedArticle = action.payload.data.article;
                state.likedArticles = state.likedArticles.filter(
                    (item) => item._id !== removedArticle._id
                );
            })
            .addCase(removeLike.rejected, (state, action) => {
                state.removeLikeLoading = false;
                state.removeLikeError = action.payload.data;
            })
            // ---- getLikedArticles ----
            .addCase(getLikedArticles.pending, (state) => {
                state.getLikedArticlesLoading = true;
                state.getLikedArticlesError = null;
            })
            .addCase(getLikedArticles.fulfilled, (state, action) => {
                state.getLikedArticlesLoading = false;
                state.getLikedArticlesError = null;
                // replace articles
                state.likedArticles = action.payload.data;
            })
            .addCase(getLikedArticles.rejected, (state, action) => {
                state.getLikedArticlesLoading = false;
                state.getLikedArticlesError = action.payload.data;
            });
    },
});

export default likeSlice.reducer;