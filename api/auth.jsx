import { apiRequest } from "./client";

export function signup(userData) {
  return apiRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export function login(userData) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}