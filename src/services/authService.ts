import api from "./apiClient";

export interface LoginResponse {
  status: string;
  message?: string;
  token?: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post("/login", { email, password });
  return response.data;
};

const TOKEN_KEY = "token";
const TOKEN_EXPIRY_KEY = "token_expiry";

export const saveToken = (token: string) => {
  const expiryTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
};

// export const saveToken = (token: string) => {
//   localStorage.setItem("token", token);
// };

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
