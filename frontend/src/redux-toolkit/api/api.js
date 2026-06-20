import axios from "axios";
import { auth } from "../Auth/firebase";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
    withCredentials: true,
});

api.interceptors.request.use(
    async (config) => {
        const user = auth.currentUser;

        if (user) {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;