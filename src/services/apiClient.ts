// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://royalgujarati.com/Layana/api/admin",
//   headers: { "Content-Type": "application/json" }
// });

// // Add auth token interceptor
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "https://royalgujarati.com/Layana/api/admin",
});

// 🔐 Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or admin_token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
