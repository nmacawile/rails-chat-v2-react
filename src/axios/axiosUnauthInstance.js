import axios from "axios";

const axiosUnauthInstance = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export default axiosUnauthInstance;
