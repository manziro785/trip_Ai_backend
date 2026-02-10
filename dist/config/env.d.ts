interface EnvConfig {
    NODE_ENV: string;
    PORT: number;
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string | number;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CALLBACK_URL: string;
    GROQ_API_KEY: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    OPENWEATHER_API_KEY: string;
    FRONTEND_URL: string;
}
export declare const env: EnvConfig;
export {};
//# sourceMappingURL=env.d.ts.map