import apiClient from "./apiClient";
import type { Listing, User } from "@/types";

export const fetchSeller = async (id: string) => {
  const { data } = await apiClient.get<{ seller: User & { listings: Listing[] } }>(
    `/api/users/${id}`
  );
  const owner = {
    id: data.seller.id,
    name: data.seller.name,
    whatsappNumber: data.seller.whatsappNumber,
    avatarUrl: data.seller.avatarUrl,
  };
  const listings = data.seller.listings.map((listing) => ({
    ...listing,
    owner,
  }));
  return { ...data.seller, listings };
};

export const fetchMe = async () => {
  const { data } = await apiClient.get<{ user: User }>("/api/users/me");
  return data.user;
};

export const updateProfile = async (payload: Partial<User>) => {
  const { data } = await apiClient.put<{ user: User }>("/api/users/me", payload);
  return data.user;
};

