export type UserRole = "ADMIN" | "SELLER";

export type Currency = "DH" | "FCFA";

export interface User {
  id: string;
  name: string;
  email?: string | null;
  whatsappNumber?: string | null;
  avatarUrl?: string | null;
  role?: string;
  createdAt?: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: Currency; // <-- ajouté
  category: string;
  location: string;
  images: string[];
  isActive?: boolean;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
  owner?: User | null;
}

export interface ListingFilters {
  search?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  sellerId?: string;
  currency?: Currency; // optionnel pour filtrer par devise
}

export interface ListingOwner {
  id: string;
  name: string;
  whatsappNumber: string;
  avatarUrl?: string | null;
}



export interface AuthResponse {
  token: string;
  user: User;
}



