import { apiRequest } from "./client";
import {File} from 'expo-file-system';

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
    // console.error("Inference API error:", err);

    if (err?.message?.includes("MAX_TEXT_CHUNK")) {
      throw new Error(
        "Photo is too large for analysis. Please try a smaller image."
      );
    }

    throw err;
  }
}

// export async function uploadImage({
//   image,
//   imageName,
//   folderId,
//   detectionResult = null,
// }) {
//   try {
//     const formData = new FormData();

//     console.log("Image object:", {
//       uri: image.uri,
//       type: image.type,
//       fileName: image.fileName,
//       fileSize: image.fileSize,
//     });

//     // IMAGE FILE
//     formData.append("image", {
//       uri: image.uri,
//       type: image.type || "image/jpeg",
//       name: image.fileName || "photo.jpg",
//     });

//     // REQUIRED FORM FIELDS
//     formData.append("image_name", imageName);
//     formData.append("folder_id", String(folderId)); // MUST be string

//     // OPTIONAL FIELD
//     if (detectionResult) {
//       formData.append(
//         "detection_result",
//         JSON.stringify(detectionResult) // backend expects JSON string
//       );
//     }

//     console.log('Uploading image', { imageName, folderId, uri: image.uri })
//     const response = await apiRequest("/image/upload", {
//       method: "POST",
//       body: formData,
//       headers: {
//         // DO NOT set Content-Type
//         // Authorization handled in apiRequest
//       },
//     });

//     return response;
//   } catch (err) {
//     console.error("Upload image error:", err);
//     throw err;
//   }
// }

export async function uploadImage({ image, imageName, folderId, detectionResult = null, originalWidth, originalHeight}) {
  try {
    const file = new File(image.uri);

    if (!file.exists) {
      throw new Error("Image file does not exist at: " + image.uri);
    }

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

    if (originalWidth) {
      formData.append("original_width", String(originalWidth));
    }
    if (originalHeight) {
      formData.append("original_height", String(originalHeight));
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

export const deleteImage = async (imageId) => {
  const response = await apiRequest(`/image/${imageId}`, {
    method: 'DELETE',
  })
  return response
}

export const updateImageName = async (imageId, newName) => {
  const response = await apiRequest(`/image/${imageId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_name: newName }),
  })
  return response
}

export function getRecentAnalyses(limit = 3) {
  return apiRequest(`/image/recent?limit=${limit}`, {
    method: 'GET',
  });
}