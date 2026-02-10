import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { env } from "../config/env";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;

    switch (err.code) {
      case "P2002":
        message = "Unique constraint violation";
        break;
      case "P2025":
        message = "Record not found";
        break;
      case "P2003":
        message = "Foreign key constraint failed";
        break;
      default:
        message = "Database error";
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid data provided";
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  if (env.NODE_ENV === "development") {
    console.error("❌ Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
};
