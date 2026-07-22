export async function uploadImage(file) {
  const data = new FormData();

  data.append("file", file);
  data.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUD_NAME
    }/image/upload`,
    {
      method: "POST",
      body: data,
    },
  );

  const result = await res.json();

  return result.secure_url;
}
