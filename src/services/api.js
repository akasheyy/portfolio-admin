import axios from "axios";

// Create instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// 🔐 Request interceptor (attach token)
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// ⚠️ Response interceptor (handle errors globally)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Unauthorized → logout
    if (error.response?.status === 401) {
      console.warn("Session expired. Logging out...");
      localStorage.removeItem("token");

      // redirect to login
      window.location.href = "/";
    }

    // Show useful error
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    console.error("API Error:", message);

    return Promise.reject(error);
  }
);

export default API;