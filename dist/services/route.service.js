"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteService = void 0;
const database_1 = require("../config/database");
const ai_service_1 = require("./ai.service");
const error_middleware_1 = require("../middleware/error.middleware");
const crypto_1 = __importDefault(require("crypto"));
const aiService = new ai_service_1.AIService();
class RouteService {
    // Generate new route
    async generateRoute(params, userId) {
        // Use AI to generate route
        const aiRoute = await aiService.generateRoute(params, userId);
        // Create route in database
        const route = await database_1.prisma.route.create({
            data: {
                userId,
                name: aiRoute.routeName,
                description: aiRoute.description,
                params: params,
                places: aiRoute.places,
                totalDuration: aiRoute.totalDuration,
                totalCost: aiRoute.totalCost,
                distance: aiRoute.distance,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return route;
    }
    // Get user routes
    async getUserRoutes(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [routes, total] = await Promise.all([
            database_1.prisma.route.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            database_1.prisma.route.count({ where: { userId } }),
        ]);
        return {
            routes,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    // Get route by ID
    async getRouteById(routeId, userId) {
        const route = await database_1.prisma.route.findUnique({
            where: { id: routeId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        if (!route) {
            throw new error_middleware_1.AppError("Route not found", 404);
        }
        // Check if user has access (own route or shared)
        if (userId && route.userId !== userId && !route.sharedToken) {
            throw new error_middleware_1.AppError("Unauthorized access", 403);
        }
        return route;
    }
    // Update route
    async updateRoute(routeId, userId, data) {
        const route = await database_1.prisma.route.findUnique({
            where: { id: routeId },
        });
        if (!route) {
            throw new error_middleware_1.AppError("Route not found", 404);
        }
        if (route.userId !== userId) {
            throw new error_middleware_1.AppError("Unauthorized", 403);
        }
        const updated = await database_1.prisma.route.update({
            where: { id: routeId },
            data,
        });
        return updated;
    }
    // Delete route
    async deleteRoute(routeId, userId) {
        const route = await database_1.prisma.route.findUnique({
            where: { id: routeId },
        });
        if (!route) {
            throw new error_middleware_1.AppError("Route not found", 404);
        }
        if (route.userId !== userId) {
            throw new error_middleware_1.AppError("Unauthorized", 403);
        }
        await database_1.prisma.route.delete({
            where: { id: routeId },
        });
        return { success: true };
    }
    // Share route
    async shareRoute(routeId, userId) {
        const route = await database_1.prisma.route.findUnique({
            where: { id: routeId },
        });
        if (!route) {
            throw new error_middleware_1.AppError("Route not found", 404);
        }
        if (route.userId !== userId) {
            throw new error_middleware_1.AppError("Unauthorized", 403);
        }
        // Generate share token if not exists
        const sharedToken = route.sharedToken || crypto_1.default.randomBytes(16).toString("hex");
        const updated = await database_1.prisma.route.update({
            where: { id: routeId },
            data: { sharedToken },
        });
        return {
            shareUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/routes/shared/${sharedToken}`,
            token: sharedToken,
            updated,
        };
    }
    // Get shared route
    async getSharedRoute(token) {
        const route = await database_1.prisma.route.findUnique({
            where: { sharedToken: token },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        if (!route) {
            throw new error_middleware_1.AppError("Shared route not found", 404);
        }
        return route;
    }
    // Rate route
    async rateRoute(routeId, userId, rating) {
        const route = await database_1.prisma.route.findUnique({
            where: { id: routeId },
        });
        if (!route) {
            throw new error_middleware_1.AppError("Route not found", 404);
        }
        if (route.userId !== userId) {
            throw new error_middleware_1.AppError("Can only rate your own routes", 403);
        }
        const updated = await database_1.prisma.route.update({
            where: { id: routeId },
            data: { rating },
        });
        return updated;
    }
}
exports.RouteService = RouteService;
//# sourceMappingURL=route.service.js.map