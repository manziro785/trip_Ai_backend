import { prisma } from "../config/database";
import { AppError } from "../middleware/error.middleware";

export class InsightService {
  // Get all insights with filters
  async getInsights(filters: {
    category?: string;
    placeId?: string;
    page?: number;
    limit?: number;
  }) {
    const { category, placeId, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (placeId) {
      where.placeId = placeId;
    }

    const [insights, total] = await Promise.all([
      prisma.insight.findMany({
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
      prisma.insight.count({ where }),
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
  async getInsightById(insightId: string) {
    const insight = await prisma.insight.findUnique({
      where: { id: insightId },
      include: {
        place: true,
      },
    });

    if (!insight) {
      throw new AppError("Insight not found", 404);
    }

    return insight;
  }

  // Mark insight as helpful
  async markHelpful(insightId: string) {
    const insight = await prisma.insight.update({
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
  async getInsightsByPlace(placeId: string) {
    const insights = await prisma.insight.findMany({
      where: { placeId },
      orderBy: { helpfulCount: "desc" },
    });

    return insights;
  }

  // Get random insight
  async getRandomInsight(limit = 3) {
    const count = await prisma.insight.count();

    if (count === 0) return [];

    const skips = new Set<number>();
    while (skips.size < Math.min(limit, count)) {
      skips.add(Math.floor(Math.random() * count));
    }

    const insights = await Promise.all(
      [...skips].map((skip) =>
        prisma.insight.findMany({
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
        }),
      ),
    );

    return insights.map((i) => i[0]).filter(Boolean);
  }

  // Get trending insights (most helpful in last 30 days)
  async getTrendingInsights(limit: number = 10) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const insights = await prisma.insight.findMany({
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
