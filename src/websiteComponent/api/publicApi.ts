const BASE_URL = "https://royalgujarati.com/Layana/api";

type ApiOptions = {
  method?: "GET" | "POST";
  body?: any;
};

export async function publicApi<T>(
  url: string,
  options: ApiOptions = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    throw new Error("API Error");
  }

  return res.json();
}
