
import axios from "axios";

const api = axios.create({
  // baseURL: "http://192.168.29.134:8005/api/admin",
  baseURL: "https://royalgujarati.com/Layana/api/admin",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
