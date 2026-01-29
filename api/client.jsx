const BASE_URL = "http://192.168.1.14:8000"; //your ip4 address. Place on env later

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
    let message = "Something went wrong";

    if (data.detail) {
      if (typeof data.detail === "string") {
        message = data.detail;
      } else if (Array.isArray(data.detail) && data.detail.length > 0) {
      }
    }

    throw new Error(message);
  }

  return data;
}