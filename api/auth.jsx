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

export function verifyOtp(email, code) {
  return apiRequest("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export function resetPassword({ email, new_password }) {
  return apiRequest("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, new_password }),
  });
}