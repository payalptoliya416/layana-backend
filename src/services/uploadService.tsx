import api from "./apiClient";

type UploadOptions = {
  type?: "team" | string; // future-proof
};

export async function uploadImages(files: File[], options?: UploadOptions
) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images[]", file);
  });
  if (options?.type) {
    formData.append("type", options.type);
  }

  const res = await api.post(
    "/upload-images",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return res.data.data; // [{ filename, url }]
}
