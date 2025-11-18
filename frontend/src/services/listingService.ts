import apiClient from "./apiClient";
import type { Listing, ListingFilters } from "@/types";

type ListingPayload = {
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[];
  currency: "DH" | "FCFA"; // <-- ajouté
};

export const fetchListings = async (params: ListingFilters = {}) => {
  const { data } = await apiClient.get<{ listings: Listing[] }>("/api/listings", {
    params,
  });
  return data.listings;
};

export const fetchListing = async (id: string) => {
  const { data } = await apiClient.get<{ listing: Listing }>(`/api/listings/${id}`);
  return data.listing;
};

export const fetchMyListings = async () => {
  const { data } = await apiClient.get<{ listings: Listing[] }>("/api/listings/mine");
  return data.listings;
};

export const createListing = async (payload: ListingPayload) => {
  const { data } = await apiClient.post<{ listing: Listing }>("/api/listings", payload);
  return data.listing;
};

export const updateListing = async (
  id: string,
  payload: Partial<ListingPayload>
) => {
  const { data } = await apiClient.put<{ listing: Listing }>(
    `/api/listings/${id}`,
    payload
  );
  return data.listing;
};

export const deleteListing = async (id: string) => {
  await apiClient.delete(`/api/listings/${id}`);
};