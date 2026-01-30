"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../config/database");
const jwt_1 = require("../utils/jwt");
const error_middleware_1 = require("../middleware/error.middleware");
class AuthService {
    // Register new user
    async register(email, password, name) {
        // Check if user exists
        const existingUser = await database_1.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new error_middleware_1.AppError("User already exists", 400);
        }
        // Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Create user
        const user = await database_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                createdAt: true,
            },
        });
        // Generate token
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            email: user.email,
            name: user.name || undefined,
        });
        return { user, token };
    }
    // Login user
    async login(email, password) {
        // Find user
        const user = await database_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user || !user.password) {
            throw new error_middleware_1.AppError("Invalid credentials", 401);
        }
        // Check password
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new error_middleware_1.AppError("Invalid credentials", 401);
        }
        // Generate token
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            email: user.email,
            name: user.name || undefined,
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
            },
            token,
        };
    }
    // Google OAuth
    async googleAuth(googleId, email, name, avatar) {
        let user = await database_1.prisma.user.findUnique({
            where: { googleId },
        });
        if (!user) {
            // Check if email exists
            user = await database_1.prisma.user.findUnique({
                where: { email },
            });
            if (user) {
                // Link Google account to existing user
                user = await database_1.prisma.user.update({
                    where: { id: user.id },
                    data: { googleId, avatar: avatar || user.avatar },
                });
            }
            else {
                // Create new user
                user = await database_1.prisma.user.create({
                    data: {
                        email,
                        googleId,
                        name,
                        avatar,
                    },
                });
            }
        }
        // Generate token
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            email: user.email,
            name: user.name || undefined,
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
            },
            token,
        };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map