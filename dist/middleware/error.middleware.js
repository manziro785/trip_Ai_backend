"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = exports.AppError = void 0;
const client_1 = require("@prisma/client");
const env_1 = require("../config/env");
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, _req, res, _next) => {
    let statusCode = 500;
    let message = "Internal server error";
    // App Error
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    // Prisma Errors
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
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
    // Prisma Validation Error
    if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = "Invalid data provided";
    }
    // JWT Errors
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    }
    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired";
    }
    // Log error in development
    if (env_1.env.NODE_ENV === "development") {
        console.error("❌ Error:", err);
    }
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(env_1.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`,
    });
};
exports.notFound = notFound;
//# sourceMappingURL=error.middleware.js.map