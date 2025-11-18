import { Request, Response } from "express";
import { z } from "zod";
import prisma from "../prisma/client";
import { ApiError } from "../middleware/errorHandler";
import { asyncHandler } from "../utils/asyncHandler";

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  whatsappNumber: z.string().min(6).optional(),
  location: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

export const getSellerProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        whatsappNumber: true,
        avatarUrl: true,
        location: true,
        createdAt: true,
        listings: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      throw new ApiError(404, "Seller not found");
    }

    res.json({
      seller: {
        ...user,
        listings: user.listings.map((listing) => ({
          ...listing,
          price: Number(listing.price),
        })),
      },
    });
  }
);

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      whatsappNumber: true,
      location: true,
      avatarUrl: true,
      role: true,
      createdAt: true,
    },
  });

  res.json({ user });
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const parsed = updateProfileSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(400, "Invalid payload", parsed.error.flatten());
  }

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: parsed.data,
    select: {
      id: true,
      name: true,
      email: true,
      whatsappNumber: true,
      location: true,
      avatarUrl: true,
      role: true,
      createdAt: true,
    },
  });

  res.json({ user });
});

