import axios from "axios";
import store from "../store/store";

const axiosAuthInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosAuthInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.auth_token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosAuthInstance;
