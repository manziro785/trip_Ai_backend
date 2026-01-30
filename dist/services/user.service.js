"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const database_1 = require("../config/database");
const error_middleware_1 = require("../middleware/error.middleware");
class UserService {
    // Get user profile
    async getProfile(userId) {
        const user = await database_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                preferences: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new error_middleware_1.AppError("User not found", 404);
        }
        return user;
    }
    // Update profile
    async updateProfile(userId, data) {
        const user = await database_1.prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
            },
        });
        return user;
    }
    // Update preferences
    async updatePreferences(userId, preferences) {
        const user = await database_1.prisma.user.update({
            where: { id: userId },
            data: { preferences: preferences },
            select: {
                id: true,
                preferences: true,
            },
        });
        return user;
    }
    // Get user statistics
    async getUserStats(userId) {
        const [visitedCount, routesCount, wishlistCount] = await Promise.all([
            database_1.prisma.userPlaceInteraction.count({
                where: { userId, visited: true },
            }),
            database_1.prisma.route.count({
                where: { userId },
            }),
            database_1.prisma.userPlaceInteraction.count({
                where: { userId, wishlist: true },
            }),
        ]);
        // Calculate total travel days (mock for now)
        const routes = await database_1.prisma.route.findMany({
            where: { userId },
            select: { createdAt: true },
        });
        const uniqueDays = new Set(routes.map((r) => r.createdAt.toISOString().split("T")[0])).size;
        return {
            visitedPlaces: visitedCount,
            totalRoutes: routesCount,
            wishlistCount,
            travelDays: uniqueDays,
        };
    }
    // Get visit history
    async getVisitHistory(userId, limit = 20) {
        const history = await database_1.prisma.userPlaceInteraction.findMany({
            where: { userId, visited: true },
            include: {
                place: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        photos: true,
                        category: {
                            select: {
                                name: true,
                                icon: true,
                                color: true,
                            },
                        },
                    },
                },
            },
            orderBy: { visitedAt: "desc" },
            take: limit,
        });
        return history;
    }
    // Mark place as visited
    async markPlaceVisited(userId, placeId) {
        const interaction = await database_1.prisma.userPlaceInteraction.upsert({
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
        return interaction;
    }
    // Get wishlist
    async getWishlist(userId) {
        const wishlist = await database_1.prisma.userPlaceInteraction.findMany({
            where: { userId, wishlist: true },
            include: {
                place: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        photos: true,
                        description: true,
                        category: {
                            select: {
                                name: true,
                                icon: true,
                                color: true,
                            },
                        },
                    },
                },
            },
        });
        return wishlist.map((w) => w.place);
    }
    // Add to wishlist
    async addToWishlist(userId, placeId) {
        const interaction = await database_1.prisma.userPlaceInteraction.upsert({
            where: {
                userId_placeId: { userId, placeId },
            },
            update: {
                wishlist: true,
            },
            create: {
                userId,
                placeId,
                wishlist: true,
            },
        });
        return interaction;
    }
    // Remove from wishlist
    async removeFromWishlist(userId, placeId) {
        await database_1.prisma.userPlaceInteraction.update({
            where: {
                userId_placeId: { userId, placeId },
            },
            data: {
                wishlist: false,
            },
        });
        return { success: true };
    }
    // Like/Unlike place
    async toggleLike(userId, placeId) {
        const existing = await database_1.prisma.userPlaceInteraction.findUnique({
            where: {
                userId_placeId: { userId, placeId },
            },
        });
        const liked = !existing?.liked;
        const interaction = await database_1.prisma.userPlaceInteraction.upsert({
            where: {
                userId_placeId: { userId, placeId },
            },
            update: {
                liked,
            },
            create: {
                userId,
                placeId,
                liked,
            },
        });
        return { liked: interaction.liked };
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map