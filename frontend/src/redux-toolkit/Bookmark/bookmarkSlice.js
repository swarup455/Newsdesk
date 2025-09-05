import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { auth } from "../Auth/firebase";

const api = axios.create({
    baseURL: "https://newsdesk-gzof.onrender.com/api/v1/bookmarks",
    withCredentials: true,
});
//automatically send user token in header in every request
api.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const addBookmark = createAsyncThunk(
    "bookmarks/addBookmark",
    async ({ articleId }, { rejectWithValue }) => {
        try {
            const res = await api.post("/set-bookmark", { articleId });
            return res.data; // contains { statusCode, data, message }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const removeBookmark = createAsyncThunk(
    "bookmarks/removeBookmark",
    async ({ articleId }, { rejectWithValue }) => {
        try {
            const res = await api.post("/delete-bookmark", { articleId });
            return res.data; // contains { statusCode, data:null, message }
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const getBookmarkedArticles = createAsyncThunk(
    "bookmarks/getBookmarkedArticles",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/get-bookmarked-articles");
            return res.data; // contains { statusCode, data:[articles], message }
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const bookmarkSlice = createSlice({
    name: "bookmarks",
    initialState: {
        bookmarkedArticles: [],
        addBookmarkLoading: false,
        removeBookmarkLoading: false,
        getBookmarkedArticlesLoading: false,
        addBookmarkError: null,
        removeBookmarkError: null,
        getBookmarkedArticlesError: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // ---- addBookmark ----
        builder
            .addCase(addBookmark.pending, (state) => {
                state.addBookmarkLoading = true;
                state.addBookmarkError = null;
            })
            .addCase(addBookmark.fulfilled, (state, action) => {
                state.addBookmarkLoading = false;
                state.addBookmarkError = null;
                const newArticle = action.payload.data.article;
                if (!state.bookmarkedArticles.some(a => a._id === newArticle._id)) {
                    state.bookmarkedArticles.push(newArticle);
                }
            })
            .addCase(addBookmark.rejected, (state, action) => {
                state.addBookmarkLoading = false;
                state.addBookmarkError = action.payload.data;
            })

            // ---- removeBookmark ----
            .addCase(removeBookmark.pending, (state) => {
                state.removeBookmarkLoading = true;
                state.removeBookmarkError = null;
            })
            .addCase(removeBookmark.fulfilled, (state, action) => {
                state.removeBookmarkLoading = false;
                state.removeBookmarkError = null;
                // remove based on articleId passed into thunk
                const removedArticle = action.payload.data.article;
                state.bookmarkedArticles = state.bookmarkedArticles.filter(
                    (item) => item._id !== removedArticle._id
                );
            })
            .addCase(removeBookmark.rejected, (state, action) => {
                state.removeBookmarkLoading = false;
                state.removeBookmarkError = action.payload.data;
            })

            // ---- getBookmarkedArticles ----
            .addCase(getBookmarkedArticles.pending, (state) => {
                state.getBookmarkedArticlesLoading = true;
                state.getBookmarkedArticlesError = null;
            })
            .addCase(getBookmarkedArticles.fulfilled, (state, action) => {
                state.getBookmarkedArticlesLoading = false;
                state.getBookmarkedArticlesError = null;
                // backend returns data = [articleObjects]
                state.bookmarkedArticles = action.payload.data;
            })
            .addCase(getBookmarkedArticles.rejected, (state, action) => {
                state.getBookmarkedArticlesLoading = false;
                state.getBookmarkedArticlesError = action.payload.data;
            });
    },
});

export default bookmarkSlice.reducer;