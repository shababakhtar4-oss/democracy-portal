import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ...existing code...

export async function apiRequest<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "API request failed");
  }

  return response.json();
}

export async function refreshToken() {
  const userData = localStorage.getItem("user");
  const token= userData ? JSON.parse(userData).token : null;
  if (!refreshToken) throw new Error("No refresh token found");

  const response = await apiRequest<{ token: string}>(
    "https://pollingservice-addeehfvcxafffb5.centralindia-01.azurewebsites.net/auth/refresh-token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    }
  );

  // Update localStorage with new tokens
  const user = userData ? JSON.parse(userData) : {};
  localStorage.setItem(
    "user",
    JSON.stringify({ ...user, token: response.token})
  );

  return response.token;
}