import apiClient from "./apiClient";
import type { AuthResponse } from "@/types";

export const registerSeller = async (payload: {
  name: string;
  email: string;
  password: string;
  whatsappNumber: string;
}) => {
  const { data } = await apiClient.post<AuthResponse>("/api/auth/register", payload);
  return data;
};

export const loginSeller = async (payload: {
  email: string;
  password: string;
}) => {
  const { data } = await apiClient.post<AuthResponse>("/api/auth/login", payload);
  return data;
};

export const fetchCurrentUser = async () => {
  const { data } = await apiClient.get<{ user: AuthResponse["user"] }>("/api/auth/me");
  return data.user;
};

