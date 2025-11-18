import { Request, Response } from "express";
import { User, UserRole } from "@prisma/client";
import { z } from "zod";
import prisma from "../prisma/client";
import { hashPassword, comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";
import { env } from "../config/env";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  whatsappNumber: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const toPublicUser = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  whatsappNumber: user.whatsappNumber,
  role: user.role,
  avatarUrl: user.avatarUrl,
  location: user.location,
  createdAt: user.createdAt,
});

export const register = async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const { email, name, password, whatsappNumber } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const passwordHash = await hashPassword(password);
  const role: UserRole =
    email.toLowerCase() === env.adminEmail ? UserRole.ADMIN : UserRole.SELLER;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      whatsappNumber,
      role,
    },
  });

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return res.status(201).json({
    token,
    user: toPublicUser(user),
  });
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return res.json({
    token,
    user: toPublicUser(user),
  });
};

export const currentUser = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      whatsappNumber: true,
      role: true,
      avatarUrl: true,
      location: true,
      createdAt: true,
    },
  });

  return res.json({ user });
};

