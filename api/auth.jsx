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

export function resetLink(userData) {
  return apiRequest("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export function verifyOtp(payload) {
  return apiRequest("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function resetPassword(payload) {
  return apiRequest("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteAccount(payload) {
  return apiRequest("/auth/delete-account", {
    method: "DELETE",
    body: JSON.stringify(payload),
  });
}