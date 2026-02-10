"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsightService = void 0;
const database_1 = require("../config/database");
const error_middleware_1 = require("../middleware/error.middleware");
class InsightService {
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
    async getInsightsByPlace(placeId) {
        const insights = await database_1.prisma.insight.findMany({
            where: { placeId },
            orderBy: { helpfulCount: "desc" },
        });
        return insights;
    }
    async getRandomInsight(limit = 3) {
        const count = await database_1.prisma.insight.count();
        if (count === 0)
            return [];
        const skips = new Set();
        while (skips.size < Math.min(limit, count)) {
            skips.add(Math.floor(Math.random() * count));
        }
        const insights = await Promise.all([...skips].map((skip) => database_1.prisma.insight.findMany({
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
        })));
        return insights.map((i) => i[0]).filter(Boolean);
    }
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