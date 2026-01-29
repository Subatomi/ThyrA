import { apiRequest } from "./client";

export async function runInference(image) {
  try {
    const formData = new FormData();
    formData.append("image", {
      uri: image.uri,
      type: image.type || "image/jpeg", 
      name: image.fileName || "photo.jpg",
    });

    const response = await apiRequest("/image/inference", {
      method: "POST",
      body: formData,
      //DO NOT set "Content-Type" here — fetch sets it automatically for FormData
      headers: {
        ...(image.headers || {}), //optional extra headers
      },
    });


    return response;
  } catch (err) {
    console.error("Inference API error:", err);
    throw err;
  }
}
