import api from "./apiClient";

export async function uploadImages(files: File[]) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images[]", file);
  });

  const res = await api.post(
    "/upload-images",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return res.data.data; // [{ filename, url }]
}
