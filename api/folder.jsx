import { apiRequest } from "./client";

export function getFolders() {
  return apiRequest("/folder", { method: "GET" });
}

