import api from "./apiClient";

export const getHomePage = async () => {
  const res = await api.post("/home-page");
  return res.data;
};

/* CREATE / UPDATE HOME PAGE */
export const saveHomePage = async (payload: any) => {
  const res = await api.post("/home-page/create-update", payload);
  return res.data;
};