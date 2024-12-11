import { getJwtToken } from "./auth";

export async function apiRequest(
  url: string,
  options: RequestInit = {},
  auth: boolean = false
) {
  const token = auth ? getJwtToken() : null;
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error("TokenExpiredError");
  }

  if (!response.ok) {
    throw new Error("ApiError");
  }

  return response.json();
}
