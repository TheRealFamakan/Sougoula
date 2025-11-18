import { Request, Response } from "express";
import prisma from "../prisma/client";
import { ApiError } from "../middleware/errorHandler";
import { asyncHandler } from "../utils/asyncHandler";

export const listUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      whatsappNumber: true,
      role: true,
      createdAt: true,
    },
  });

  res.json({ users });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  if (req.params.id === req.user?.id) {
    throw new ApiError(400, "Admins cannot delete themselves");
  }

  const existing = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    throw new ApiError(404, "User not found");
  }

  await prisma.user.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export const listAllListings = asyncHandler(
  async (_req: Request, res: Response) => {
    const listings = await prisma.listing.findMany({
      where: { isActive: true }, // <-- Ajoute cette ligne
      orderBy: { createdAt: "desc" },
      include: {
        owner: { select: { id: true, name: true, email: true, whatsappNumber: true } },
      },
    });

    res.json({
      listings: listings.map((listing) => ({
        ...listing,
        price: Number(listing.price),
      })),
    });
  }
);

export const deleteListingAsAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const listing = await prisma.listing.findUnique({
      where: { id: req.params.id },
    });

    if (!listing) {
      throw new ApiError(404, "Listing not found");
    }

    await prisma.listing.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  }
);

