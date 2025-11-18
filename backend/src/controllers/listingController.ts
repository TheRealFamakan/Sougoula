import { Request, Response } from "express";
import { Prisma, UserRole } from "@prisma/client";
import { z } from "zod";
import prisma from "../prisma/client";
import { ApiError } from "../middleware/errorHandler";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadBase64Image } from "../utils/cloudinary";
import { env } from "../config/env";

const listingSchema = z.object({
  title: z.string().min(3),
  price: z.coerce.number().positive(),
  category: z.string().min(2),
  description: z.string().min(10),
  location: z.string().min(2),
  images: z.array(z.string().min(1)).min(1).max(5),
  currency: z.enum(["DH", "FCFA"] as const),
});

const filterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sellerId: z.string().optional(),
  currency: z.enum(["DH", "FCFA"] as const).optional(),
});

const listingWithOwner = Prisma.validator<Prisma.ListingDefaultArgs>()({
  include: {
    owner: {
      select: {
        id: true,
        name: true,
        whatsappNumber: true,
        avatarUrl: true,
      },
    },
  },
});

const mapListing = (
  listing: Prisma.ListingGetPayload<typeof listingWithOwner>
) => ({
  ...listing,
  price: Number(listing.price),
  currency: (listing as any).currency ?? "DH",
});

const buildWhereClause = (filters: z.infer<typeof filterSchema>) => {
  const where: Prisma.ListingWhereInput = {
    isActive: true,
  };

  if (filters.category) {
    where.category = { equals: filters.category, mode: "insensitive" } as any;
  }

  if (filters.location) {
    where.location = { contains: filters.location, mode: "insensitive" } as any;
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { location: { contains: filters.search, mode: "insensitive" } },
    ] as any;
  }

  if (
    typeof filters.minPrice === "number" ||
    typeof filters.maxPrice === "number"
  ) {
    (where as any).price = {};
    if (typeof filters.minPrice === "number") {
      (where as any).price.gte = filters.minPrice;
    }
    if (typeof filters.maxPrice === "number") {
      (where as any).price.lte = filters.maxPrice;
    }
  }

  if (filters.sellerId) {
    where.ownerId = filters.sellerId;
  }

  if (filters.currency) {
    // cast because ListingWhereInput type may be outdated until prisma client is regenerated
    (where as any).currency = { equals: filters.currency as any };
  }

  return where;
};

const processImages = async (images: string[]) => {
  const uploads = images.map((image) =>
    uploadBase64Image(image, `${env.cloudinary.folder}/listings`)
  );

  return Promise.all(uploads);
};

export const listListings = asyncHandler(async (req: Request, res: Response) => {
  const parsed = filterSchema.parse(req.query);

  const listings = await prisma.listing.findMany({
    where: buildWhereClause(parsed),
    orderBy: { createdAt: "desc" },
    include: listingWithOwner.include,
  });

  res.json({ listings: listings.map(mapListing) });
});

export const getListing = asyncHandler(async (req: Request, res: Response) => {
  const listing = await prisma.listing.findUnique({
    where: { id: req.params.id },
    include: listingWithOwner.include,
  });

  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  res.json({ listing: mapListing(listing) });
});

export const createListing = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const parsed = listingSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(400, "Invalid payload", parsed.error.flatten());
  }

  const imageUrls = await processImages(parsed.data.images);

  const listing = await prisma.listing.create({
    data: {
      ...parsed.data,
      images: imageUrls,
      ownerId: req.user.id,
    },
    include: listingWithOwner.include,
  });

  res.status(201).json({ listing: mapListing(listing) });
});

export const updateListing = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const listing = await prisma.listing.findUnique({
    where: { id: req.params.id },
  });

  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  if (listing.ownerId !== req.user.id && req.user.role !== UserRole.ADMIN) {
    throw new ApiError(403, "Not allowed to update this listing");
  }

  const parsed = listingSchema.partial().safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(400, "Invalid payload", parsed.error.flatten());
  }

  let images = listing.images;
  if (parsed.data.images) {
    images = await processImages(parsed.data.images);
  }

  const updated = await prisma.listing.update({
    where: { id: listing.id },
    data: {
      ...parsed.data,
      images,
    },
    include: listingWithOwner.include,
  });

  res.json({ listing: mapListing(updated) });
});

export const deleteListing = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const listing = await prisma.listing.findUnique({
    where: { id: req.params.id },
  });

  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  if (listing.ownerId !== req.user.id && req.user.role !== UserRole.ADMIN) {
    throw new ApiError(403, "Not allowed to delete this listing");
  }

  await prisma.listing.update({
    where: { id: listing.id },
    data: { isActive: false },
  });

  res.status(204).send();
});

export const myListings = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const listings = await prisma.listing.findMany({
    where: { ownerId: req.user.id, isActive: true },
    orderBy: { createdAt: "desc" },
    include: listingWithOwner.include,
  });

  res.json({ listings: listings.map(mapListing) });
});