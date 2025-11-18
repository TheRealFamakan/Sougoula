import { NextFunction, Request, Response } from "express";

export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err instanceof ApiError ? err.statusCode : 500;
  const response =
    err instanceof ApiError
      ? { message: err.message, details: err.details }
      : { message: "Internal server error" };

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  res.status(status).json(response);
};

