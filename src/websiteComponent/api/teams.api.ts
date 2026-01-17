import { publicApi } from "./publicApi";

export type TeamMember = {
  id: number;
  name: string;
  role: string;
  description: string | null;
  image: string;
  index: number;
};

export type TeamsResponse = {
  status: string;
  data: {
    teams: TeamMember[];
  };
};

export const getTeams = () => {
  return publicApi<TeamsResponse>("/frontend/teams");
};
