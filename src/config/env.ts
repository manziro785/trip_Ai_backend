import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string | number; // Changed from just 'string'
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  // OPENAI_API_KEY: string;
  GROQ_API_KEY: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  OPENWEATHER_API_KEY: string;
  FRONTEND_URL: string;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};

export const env: EnvConfig = {
  NODE_ENV: getEnvVar("NODE_ENV", "development"),
  PORT: parseInt(getEnvVar("PORT", "5000"), 10),
  DATABASE_URL: getEnvVar("DATABASE_URL"),
  JWT_SECRET: getEnvVar("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnvVar("JWT_EXPIRES_IN", "7d"),
  GOOGLE_CLIENT_ID: getEnvVar("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getEnvVar("GOOGLE_CLIENT_SECRET"),
  GOOGLE_CALLBACK_URL: getEnvVar("GOOGLE_CALLBACK_URL"),
  GROQ_API_KEY: getEnvVar("GROQ_API_KEY"), // Сделайте обязательным
  CLOUDINARY_CLOUD_NAME: getEnvVar("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: getEnvVar("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: getEnvVar("CLOUDINARY_API_SECRET"),
  OPENWEATHER_API_KEY: getEnvVar("OPENWEATHER_API_KEY"),
  FRONTEND_URL: getEnvVar("FRONTEND_URL", "http://localhost:3000"),
};
