import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, provider } from "./firebase";
import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1/auth",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const signInWithGoogle = createAsyncThunk("auth/signInWithGoogle",
    async (_, thunkAPI) => {
        try {
            const res = await signInWithPopup(auth, provider);
            //getting token from firebase
            const token = await res.user.getIdToken();
            //sending data in backend
            const { data } = await api.post("/google-login",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return data.user;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

export const signUpWithEmailAndPassword = createAsyncThunk(
    "auth/signUpWithEmailAndPassword",
    async ({ email, password }, thunkAPI) => {
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            //getting the token from firebase
            const token = await res.user.getIdToken();
            //getting response data
            const { data } = await api.post("/register-user",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return data.user;
        } catch (error) {
            console.error("signup error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const logInWithEmailAndPassword = createAsyncThunk("auth/logInWithEmailAnsPassword",
    async ({ email, password }, thunkAPI) => {
        try {
            const res = await signInWithEmailAndPassword(auth, email, password)
            //getting user token
            const token = await res.user.getIdToken();
            const { data } = await api.post("/login-user",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return data.user;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const fetchUserProfile = createAsyncThunk("auth/fetchUserProfile",
    async (_, thunkAPI) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("No authenticated user");
            //getting token from firebase
            const token = await user.getIdToken();
            //sending data into headers
            const { data } = await api.get("/get-user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.user;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, thunkAPI) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("No authenticated user");
            //getting token from firebase
            const token = await user.getIdToken();
            await api.post("/logout-user",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            await signOut(auth);
            return null;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

export const updateProfileData = createAsyncThunk(
    "auth/updateProfileData",
    async (userData, { rejectWithValue }) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("No authenticated user");
            //getting token from firebase
            const token = await user.getIdToken();

            const formData = new FormData();
            formData.append("fullname", userData.fullname);
            formData.append("about", userData.about);
            formData.append("intrest", JSON.stringify(userData.intrest || []));
            if (userData.profileImage) {
                formData.append("profileImage", userData.profileImage); // file object
            }

            const { data } = await api.put("/update-profile",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        status: "idle",
        updated: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetUpdated: (state) => {
            state.updated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            //register with email and address
            .addCase(signUpWithEmailAndPassword.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(signUpWithEmailAndPassword.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
            })
            .addCase(signUpWithEmailAndPassword.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            // Login with email and address
            .addCase(logInWithEmailAndPassword.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(logInWithEmailAndPassword.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
            })
            .addCase(logInWithEmailAndPassword.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            // Google login
            .addCase(signInWithGoogle.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(signInWithGoogle.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
            })
            .addCase(signInWithGoogle.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            // Fetch user
            .addCase(fetchUserProfile.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.status = "idle";
                state.error = null;
            })
            // update profile
            .addCase(updateProfileData.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateProfileData.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
                state.updated = true;
            })
            .addCase(updateProfileData.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
    }
})

export const { clearError, resetUpdated } = authSlice.actions;
export default authSlice.reducer;