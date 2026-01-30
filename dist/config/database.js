"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDatabase = exports.connectDatabase = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const env_1 = require("./env");
exports.prisma = global.prisma ||
    new client_1.PrismaClient({
        log: env_1.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
if (env_1.env.NODE_ENV !== "production") {
    global.prisma = exports.prisma;
}
const connectDatabase = async () => {
    try {
        await exports.prisma.$connect();
        console.log("✅ Database connected successfully");
    }
    catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
const disconnectDatabase = async () => {
    await exports.prisma.$disconnect();
    console.log("🔌 Database disconnected");
};
exports.disconnectDatabase = disconnectDatabase;
//# sourceMappingURL=database.js.map