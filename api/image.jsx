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

export async function uploadImage({
  image,
  imageName,
  folderId,
  detectionResult = null,
}) {
  try {
    const formData = new FormData();

    // IMAGE FILE
    formData.append("image", {
      uri: image.uri,
      type: image.type || "image/jpeg",
      name: image.fileName || "photo.jpg",
    });

    // REQUIRED FORM FIELDS
    formData.append("image_name", imageName);
    formData.append("folder_id", String(folderId)); // MUST be string

    // OPTIONAL FIELD
    if (detectionResult) {
      formData.append(
        "detection_result",
        JSON.stringify(detectionResult) // backend expects JSON string
      );
    }

    const response = await apiRequest("/image/upload", {
      method: "POST",
      body: formData,
      headers: {
        // DO NOT set Content-Type
        // Authorization handled in apiRequest
      },
    });

    return response;
  } catch (err) {
    console.error("Upload image error:", err);
    throw err;
  }
}