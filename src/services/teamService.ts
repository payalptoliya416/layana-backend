import api from "./apiClient";

/* ---------- TYPES ---------- */
export interface TeamPayload {
    id?: number,
  name?: string;
  designation?: string;
  description?: string;
  featured: boolean;
  images?: string[];
}

export async function createTeam(payload: TeamPayload) {
  const res = await api.post("/teams/create", payload);
  return res.data;
}

/* ---------- CREATE / UPDATE ---------- */
export async function updateTeam(id: number | string, payload: TeamPayload) {
  const res = await api.post("/teams/update", {
    ...payload,
    id,
  });
  return res.data;
}

export async function getTeamById(id: number | string): Promise<TeamPayload> {
    const res = await api.post("/teams/show", {
        id: Number(id),
    });
    
    return res.data.data;
}
/* ---------- DELETE ---------- */

export async function deleteTeam(id: number) {
  const res = await api.post("/teams/delete", { id });
  return res.data;
}
