const BASE_URL = "https://royalgujarati.com/Layana/api";

type ApiOptions = {
  method?: "GET" | "POST";
  body?: any;
};

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

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

   let data: any;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  // ✅ If API failed
  if (!res.ok) {
    const message =
      data?.errors
        ? Object.values(data.errors)[0][0] // first validation error
        : data?.message || "Something went wrong";

    throw new ApiError(message, res.status, data);
  }

  return data as T;
}
