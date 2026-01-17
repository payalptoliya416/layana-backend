import { publicApi } from "./publicApi";

export type HomePageResponse = {
  status: string;
  data: {
    slider: any[];
    treatments: any[];
    teams: any[];
    promo_1: any;
    visuals: any;
    seo: any;
  };
};

export const getHomePageData = () => {
  return publicApi<HomePageResponse>("/frontend/home-page");
};