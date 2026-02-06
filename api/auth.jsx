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

export function getProfile() {
  return apiRequest("/auth/me", { method: "GET" });
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

export function changePassword(payload) {
  return apiRequest("/auth/change-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateProfile(payload) {
  return apiRequest("/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function startEmailChange(payload) {
  return apiRequest("/auth/email-change", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function verifyEmailChange(payload) {
  return apiRequest("/auth/email-change/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}