import api from "@/services/apiClient";
import { TeamResponse } from "@/services/getTeam";

export async function getAllTeams(count: number) {
  const formData = new URLSearchParams();
  formData.append("page", "1");
  formData.append("per_page", String(count));

  const res = await api.post<TeamResponse>(
    "/teams",
    formData,
    {
      params: {
        sort_by: "index",
        sort_direction: "asc",
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return res.data.data;
}
