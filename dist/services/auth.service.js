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
    async register(email, password, name) {
        const existingUser = await database_1.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new error_middleware_1.AppError("User already exists", 400);
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
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
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            email: user.email,
            name: user.name || undefined,
        });
        return { user, token };
    }
    async login(email, password) {
        const user = await database_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user || !user.password) {
            throw new error_middleware_1.AppError("Invalid credentials", 401);
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new error_middleware_1.AppError("Invalid credentials", 401);
        }
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            email: user.email,
            name: user.name || undefined,
        });
        return {
            token,
        };
    }
    async googleAuth(googleId, email, name, avatar) {
        let user = await database_1.prisma.user.findUnique({
            where: { googleId },
        });
        if (!user) {
            user = await database_1.prisma.user.findUnique({
                where: { email },
            });
            if (user) {
                user = await database_1.prisma.user.update({
                    where: { id: user.id },
                    data: { googleId, avatar: avatar || user.avatar },
                });
            }
            else {
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