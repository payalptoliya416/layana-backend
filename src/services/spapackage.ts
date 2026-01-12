export interface SpaPackagePayload {
  general: {
    name: string;
    slogan: string;
    description: string;
    status: "live" | "draft";
  };
  location: number[];
  visuals: {
    btn_text: string;
    btn_link: string;
    image: string;
  };
  pricing: {
    location_id: number;
    duration: number;
    price: number;
    is_bold: boolean;
    index?: number;
  }[];
}
