import dotenv from "dotenv";

dotenv.config();

const requiredKeys = [
  "DATABASE_URL",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "ADMIN_EMAIL",
];

requiredKeys.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`[env] Missing environment variable: ${key}`);
  }
});

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  adminEmail: (process.env.ADMIN_EMAIL ?? "").toLowerCase(),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    apiKey: process.env.CLOUDINARY_API_KEY ?? "",
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
    folder: process.env.CLOUDINARY_FOLDER ?? "statusmarket",
  },
  pagination: {
    defaultLimit: Number(process.env.DEFAULT_PAGE_SIZE ?? 20),
    maxLimit: 100,
  },
};

export const ensureEnv = () => {
  const missing = requiredKeys.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
};

