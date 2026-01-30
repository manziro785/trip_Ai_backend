"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsightService = void 0;
const database_1 = require("../config/database");
const error_middleware_1 = require("../middleware/error.middleware");
class InsightService {
    // Get all insights with filters
    async getInsights(filters) {
        const { category, placeId, page = 1, limit = 20 } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (category) {
            where.category = category;
        }
        if (placeId) {
            where.placeId = placeId;
        }
        const [insights, total] = await Promise.all([
            database_1.prisma.insight.findMany({
                where,
                include: {
                    place: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                },
                orderBy: { helpfulCount: "desc" },
                skip,
                take: limit,
            }),
            database_1.prisma.insight.count({ where }),
        ]);
        return {
            insights,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    // Get insight by ID
    async getInsightById(insightId) {
        const insight = await database_1.prisma.insight.findUnique({
            where: { id: insightId },
            include: {
                place: true,
            },
        });
        if (!insight) {
            throw new error_middleware_1.AppError("Insight not found", 404);
        }
        return insight;
    }
    // Mark insight as helpful
    async markHelpful(insightId) {
        const insight = await database_1.prisma.insight.update({
            where: { id: insightId },
            data: {
                helpfulCount: {
                    increment: 1,
                },
            },
        });
        return insight;
    }
    // Get insights by place
    async getInsightsByPlace(placeId) {
        const insights = await database_1.prisma.insight.findMany({
            where: { placeId },
            orderBy: { helpfulCount: "desc" },
        });
        return insights;
    }
    // Get random insight
    async getRandomInsight() {
        const count = await database_1.prisma.insight.count();
        const skip = Math.floor(Math.random() * count);
        const insight = await database_1.prisma.insight.findMany({
            skip,
            take: 1,
            include: {
                place: {
                    select: {
                        name: true,
                        slug: true,
                    },
                },
            },
        });
        return insight[0] || null;
    }
    // Get trending insights (most helpful in last 30 days)
    async getTrendingInsights(limit = 10) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const insights = await database_1.prisma.insight.findMany({
            where: {
                createdAt: {
                    gte: thirtyDaysAgo,
                },
            },
            orderBy: {
                helpfulCount: "desc",
            },
            take: limit,
            include: {
                place: {
                    select: {
                        name: true,
                        slug: true,
                    },
                },
            },
        });
        return insights;
    }
}
exports.InsightService = InsightService;
//# sourceMappingURL=insight.service.js.map