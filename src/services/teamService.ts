import api from "./apiClient";

/* ---------- TYPES ---------- */
export interface Team {
  id: number;
  name: string;
  designation: string;
  description: string;
  featured: boolean;
  image: string[];
}


/* ---------- CREATE / UPDATE ---------- */
export async function updateTeam(payload: {
  id?: number;
  name: string;
  designation: string;
  description: string;
  featured: boolean;
  images: string[];
}) {
  const res = await api.post("/teams/update", payload);
  return res.data;
}

/* ---------- DELETE ---------- */
export async function deleteTeam(id: number) {
  const res = await api.post("/teams/delete", { id });
  return res.data;
}
