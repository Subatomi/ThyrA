import { apiRequest } from "./client";

export function getFolders() {
  return apiRequest("/folder", { method: "GET" });
}


export function createFolder(folder_name) {
  return apiRequest("/folder/create_folder", {
    method: "POST",
    body: JSON.stringify({ folder_name }),
  });
}

export function deleteFolder(folder_id) {
  return apiRequest(`/folder/${folder_id}`, {
    method: "DELETE",
  });
}