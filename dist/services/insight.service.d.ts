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
            updatedAt: Date | null;
            placeId: string | null;
            icon: string | null;
            helpfulCount: number;
            title: string;
            content: string | null;
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
            updatedAt: Date | null;
            rating: number | null;
            lat: number;
            lng: number;
            description: string | null;
            slug: string;
            categoryId: string | null;
            address: string | null;
            photos: string[];
            priceRange: string | null;
            openingHours: string | null;
            phone: string | null;
            website: string | null;
        } | null;
    } & {
        category: string;
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        placeId: string | null;
        icon: string | null;
        helpfulCount: number;
        title: string;
        content: string | null;
    }>;
    markHelpful(insightId: string): Promise<{
        category: string;
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        placeId: string | null;
        icon: string | null;
        helpfulCount: number;
        title: string;
        content: string | null;
    }>;
    getInsightsByPlace(placeId: string): Promise<{
        category: string;
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        placeId: string | null;
        icon: string | null;
        helpfulCount: number;
        title: string;
        content: string | null;
    }[]>;
    getRandomInsight(limit?: number): Promise<({
        place: {
            name: string;
            slug: string;
        } | null;
    } & {
        category: string;
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        placeId: string | null;
        icon: string | null;
        helpfulCount: number;
        title: string;
        content: string | null;
    })[]>;
    getTrendingInsights(limit?: number): Promise<({
        place: {
            name: string;
            slug: string;
        } | null;
    } & {
        category: string;
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        placeId: string | null;
        icon: string | null;
        helpfulCount: number;
        title: string;
        content: string | null;
    })[]>;
}
//# sourceMappingURL=insight.service.d.ts.map