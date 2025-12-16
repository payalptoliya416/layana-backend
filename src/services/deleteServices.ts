
import api from "./apiClient";

export const deleteTreatmentMessage = async (id: number) => {
  return api.post("/treatements/message/delete", { id });
};
