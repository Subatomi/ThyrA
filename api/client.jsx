const BASE_URL = "http://192.168.1.14:8000";

export async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    console.log("API:",BASE_URL);
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}