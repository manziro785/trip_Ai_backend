export declare class InsightService {
    getInsights(filters: {
        category?: string;
        placeId?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        insights: ({
            place: {
                id: string;
                name: string;
                slug: string;
            } | null;
        } & {
            category: string;
            id: string;
            createdAt: Date;
            description: string;
            placeId: string | null;
            helpfulCount: number;
            title: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getInsightById(insightId: string): Promise<{
        place: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            lat: number;
            lng: number;
            description: string;
            rating: number | null;
            slug: string;
            categoryId: string;
            address: string | null;
            photos: string[];
            audioGuideUrl: string | null;
            priceRange: string | null;
            openingHours: import("@prisma/client/runtime/library").JsonValue | null;
            tags: string[];
        } | null;
    } & {
        category: string;
        id: string;
        createdAt: Date;
        description: string;
        placeId: string | null;
        helpfulCount: number;
        title: string;
    }>;
    markHelpful(insightId: string): Promise<{
        category: string;
        id: string;
        createdAt: Date;
        description: string;
        placeId: string | null;
        helpfulCount: number;
        title: string;
    }>;
    getInsightsByPlace(placeId: string): Promise<{
        category: string;
        id: string;
        createdAt: Date;
        description: string;
        placeId: string | null;
        helpfulCount: number;
        title: string;
    }[]>;
    getRandomInsight(): Promise<{
        place: {
            name: string;
            slug: string;
        } | null;
    } & {
        category: string;
        id: string;
        createdAt: Date;
        description: string;
        placeId: string | null;
        helpfulCount: number;
        title: string;
    }>;
    getTrendingInsights(limit?: number): Promise<({
        place: {
            name: string;
            slug: string;
        } | null;
    } & {
        category: string;
        id: string;
        createdAt: Date;
        description: string;
        placeId: string | null;
        helpfulCount: number;
        title: string;
    })[]>;
}
//# sourceMappingURL=insight.service.d.ts.map