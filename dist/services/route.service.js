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
    async generateRoute(params, userId) {
        if (!params.scheduledDate || !params.scheduledTime) {
            throw new error_middleware_1.AppError("scheduledDate and scheduledTime are required", 400);
        }
        let endTime = params.endTime;
        if (!endTime && params.duration) {
            const [hours, minutes] = params.scheduledTime.split(":").map(Number);
            const startMinutes = hours * 60 + minutes;
            const endMinutes = startMinutes + params.duration;
            const endHours = Math.floor(endMinutes / 60) % 24;
            const endMins = endMinutes % 60;
            endTime = `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`;
        }
        else if (!endTime && params.timeAvailable) {
            const durationMap = {
                "2-3 hours": 180,
                "half-day": 270,
                "full-day": 480,
                weekend: 960,
            };
            const duration = durationMap[params.timeAvailable] || 240;
            const [hours, minutes] = params.scheduledTime.split(":").map(Number);
            const startMinutes = hours * 60 + minutes;
            const endMinutes = startMinutes + duration;
            const endHours = Math.floor(endMinutes / 60) % 24;
            const endMins = endMinutes % 60;
            endTime = `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`;
        }
        const aiRoute = await aiService.generateRoute(params, userId);
        const scheduledDateTime = new Date(params.scheduledDate);
        const route = await database_1.prisma.route.create({
            data: {
                userId,
                name: aiRoute.routeName,
                description: aiRoute.description,
                status: "SAVED",
                scheduledDate: scheduledDateTime,
                scheduledTime: params.scheduledTime,
                endTime: endTime || "18:00",
                params: params,
                places: aiRoute.places,
                totalDuration: aiRoute.totalDuration,
                totalCost: aiRoute.totalCost,
                distance: aiRoute.distance,
                startedAt: null,
                completedAt: null,
                visitedPlaces: [],
                currentPlace: 0,
                rating: null,
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
    async getUserRoutes(userId, page = 1, limit = 10, status) {
        const skip = (page - 1) * limit;
        const where = { userId };
        if (status) {
            where.status = status;
        }
        const [routes, total] = await Promise.all([
            database_1.prisma.route.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            database_1.prisma.route.count({ where }),
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
    async getActiveRoute(userId) {
        const route = await database_1.prisma.route.findFirst({
            where: {
                userId,
                status: "ACTIVE",
            },
            orderBy: {
                startedAt: "desc",
            },
        });
        return route;
    }
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
        if (userId && route.userId !== userId && !route.sharedToken) {
            throw new error_middleware_1.AppError("Unauthorized access", 403);
        }
        return route;
    }
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
    async startRoute(routeId, userId) {
        const route = await database_1.prisma.route.findUnique({
            where: { id: routeId },
        });
        if (!route) {
            throw new error_middleware_1.AppError("Route not found", 404);
        }
        if (route.userId !== userId) {
            throw new error_middleware_1.AppError("Unauthorized", 403);
        }
        if (route.status === "ACTIVE") {
            throw new error_middleware_1.AppError("Route is already active", 400);
        }
        if (route.status === "ARCHIVED") {
            throw new error_middleware_1.AppError("Cannot start archived route", 400);
        }
        const activeRoute = await this.getActiveRoute(userId);
        if (activeRoute) {
            throw new error_middleware_1.AppError("You already have an active route. Complete or pause it first.", 400);
        }
        const updated = await database_1.prisma.route.update({
            where: { id: routeId },
            data: {
                status: "ACTIVE",
                startedAt: new Date(),
                currentPlace: 0,
                visitedPlaces: [],
            },
        });
        return updated;
    }
    async visitPlace(routeId, userId, data) {
        const route = await database_1.prisma.route.findUnique({
            where: { id: routeId },
        });
        if (!route) {
            throw new error_middleware_1.AppError("Route not found", 404);
        }
        if (route.userId !== userId) {
            throw new error_middleware_1.AppError("Unauthorized", 403);
        }
        if (route.status !== "ACTIVE") {
            throw new error_middleware_1.AppError("Route is not active", 400);
        }
        const places = route.places;
        if (data.placeIndex < 0 || data.placeIndex >= places.length) {
            throw new error_middleware_1.AppError("Invalid place index", 400);
        }
        const placeId = places[data.placeIndex].placeId;
        const visitedPlaces = route.visitedPlaces || [];
        if (!visitedPlaces.includes(placeId)) {
            visitedPlaces.push(placeId);
        }
        const nextPlace = Math.min(data.placeIndex + 1, places.length);
        const updated = await database_1.prisma.route.update({
            where: { id: routeId },
            data: {
                visitedPlaces: visitedPlaces,
                currentPlace: nextPlace,
            },
        });
        try {
            await database_1.prisma.userPlaceInteraction.upsert({
                where: {
                    userId_placeId: { userId, placeId },
                },
                update: {
                    visited: true,
                    visitedAt: new Date(),
                },
                create: {
                    userId,
                    placeId,
                    visited: true,
                    visitedAt: new Date(),
                },
            });
        }
        catch (error) {
            console.log("Place not found in database:", placeId);
        }
        return updated;
    }
    async completeRoute(routeId, userId, rating) {
        const route = await database_1.prisma.route.findUnique({
            where: { id: routeId },
        });
        if (!route) {
            throw new error_middleware_1.AppError("Route not found", 404);
        }
        if (route.userId !== userId) {
            throw new error_middleware_1.AppError("Unauthorized", 403);
        }
        if (route.status !== "ACTIVE") {
            throw new error_middleware_1.AppError("Route is not active", 400);
        }
        const updated = await database_1.prisma.route.update({
            where: { id: routeId },
            data: {
                status: "ARCHIVED",
                completedAt: new Date(),
                rating: rating || null,
            },
        });
        return updated;
    }
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
        const sharedToken = route.sharedToken || crypto_1.default.randomBytes(16).toString("hex");
        const updated = await database_1.prisma.route.update({
            where: { id: routeId },
            data: { sharedToken },
        });
        return {
            shareUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/routes/shared/${sharedToken}`,
            token: sharedToken,
            route: updated,
        };
    }
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
        if (rating < 1 || rating > 5) {
            throw new error_middleware_1.AppError("Rating must be between 1 and 5", 400);
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