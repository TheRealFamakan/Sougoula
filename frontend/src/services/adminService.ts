import apiClient from "./apiClient";
import type { Listing, User } from "@/types";

export const fetchAllUsers = async () => {
  const { data } = await apiClient.get<{ users: User[] }>("/api/admin/users");
  return data.users;
};

export const fetchAllListings = async () => {
  const { data } = await apiClient.get<{ listings: Listing[] }>("/api/admin/listings");
  return data.listings;
};

export const removeUser = async (id: string) => {
  await apiClient.delete(`/api/admin/users/${id}`);
};

export const removeListingAsAdmin = async (id: string) => {
  await apiClient.delete(`/api/admin/listings/${id}`);
};

