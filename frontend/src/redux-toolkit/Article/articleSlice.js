import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"

const api = axios.create({
    baseURL: "https://newsdesk-gzof.onrender.com/api/v1/article",
    withCredentials: true
});

export const setCategories = createAsyncThunk(
    "articles/setCategories",
    async (categoryList, { rejectWithValue }) => {
        try {
            const res = await api.post("/set-category", { categoryList });
            return res.data.categories;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchArticles = createAsyncThunk(
    "articles/fetchArticles",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/get-article");
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const getAiSummary = createAsyncThunk(
    'articles/getAiSummary',
    async (articleId, { rejectWithValue }) => {
        try {
            const response = await api.post('/get-ai-summary', { articleId });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch AI summary'
            );
        }
    }
);

export const searchArticles = createAsyncThunk(
    "articles/searchArticles",
    async (query, { rejectWithValue }) => {
        try {
            const response = await api.post("/searched-articles", { query });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to search articles"
            );
        }
    }
);

const articleSlice = createSlice({
    name: "articles",
    initialState: {
        articles: [],
        categories: [],
        aiSummary: "",
        searchResults: [],
        loading: false,
        summaryLoading: false,
        error: null,
        summaryError: null,
    },
    reducers: {
        clearResults: (state) => {
            state.searchResults = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // setCategories
            .addCase(setCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(setCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(setCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // fetchArticles
            .addCase(fetchArticles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchArticles.fulfilled, (state, action) => {
                state.loading = false;
                state.articles = action.payload;
            })
            .addCase(fetchArticles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //getAiSummary
            .addCase(getAiSummary.pending, (state, action) => {
                state.summaryLoading = true;
                state.summaryError = null;
            })
            .addCase(getAiSummary.fulfilled, (state, action) => {
                state.summaryLoading = false;
                state.aiSummary = action.payload.aiSummary;
                state.summaryError = null;
            })
            .addCase(getAiSummary.rejected, (state, action) => {
                state.summaryLoading = false;
                state.summaryError = action.payload;
                state.aiSummary = null;
            })
            //search results
            .addCase(searchArticles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchArticles.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResults = action.payload;
            })
            .addCase(searchArticles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export const { clearResults } = articleSlice.actions;
export default articleSlice.reducer