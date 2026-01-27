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
  const expiryTime = Date.now() + 24 * 60 * 60 * 1000;

  localStorage.setItem("token", token);
  localStorage.setItem("token_expiry", expiryTime.toString());

  setTimeout(() => {
    removeToken();
    window.location.href = "/admin/login";
  }, expiryTime - Date.now());
};

// export const saveToken = (token: string) => {
//   localStorage.setItem("token", token);
// };

export const getToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

  if (!token || !expiry) return null;

  if (Date.now() > Number(expiry)) {
    // token expired
    removeToken();
    return null;
  }

  return token;
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
