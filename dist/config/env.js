"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getEnvVar = (key, defaultValue) => {
    const value = process.env[key] || defaultValue;
    if (!value) {
        throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
};
exports.env = {
    NODE_ENV: getEnvVar("NODE_ENV", "development"),
    PORT: parseInt(getEnvVar("PORT", "5000"), 10),
    DATABASE_URL: getEnvVar("DATABASE_URL"),
    JWT_SECRET: getEnvVar("JWT_SECRET"),
    JWT_EXPIRES_IN: getEnvVar("JWT_EXPIRES_IN", "7d"),
    GOOGLE_CLIENT_ID: getEnvVar("GOOGLE_CLIENT_ID"),
    GOOGLE_CLIENT_SECRET: getEnvVar("GOOGLE_CLIENT_SECRET"),
    GOOGLE_CALLBACK_URL: getEnvVar("GOOGLE_CALLBACK_URL"),
    GROQ_API_KEY: getEnvVar("GROQ_API_KEY"),
    CLOUDINARY_CLOUD_NAME: getEnvVar("CLOUDINARY_CLOUD_NAME"),
    CLOUDINARY_API_KEY: getEnvVar("CLOUDINARY_API_KEY"),
    CLOUDINARY_API_SECRET: getEnvVar("CLOUDINARY_API_SECRET"),
    OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
    FRONTEND_URL: getEnvVar("FRONTEND_URL", "http://localhost:3000"),
};
//# sourceMappingURL=env.js.map