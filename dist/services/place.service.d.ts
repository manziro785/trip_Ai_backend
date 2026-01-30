export declare class PlaceService {
    getPlaces(filters: {
        categoryId?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        places: ({
            category: {
                name: string;
                slug: string;
                icon: string;
                color: string;
            };
        } & {
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getPlaceById(placeId: string, userId?: string): Promise<{
        userInteraction: {
            visited: boolean;
            liked: boolean;
            wishlist: boolean;
        } | null;
        category: {
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
            slug: string;
            icon: string;
            color: string;
        };
        insights: {
            category: string;
            id: string;
            createdAt: Date;
            description: string;
            placeId: string | null;
            helpfulCount: number;
            title: string;
        }[];
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
    }>;
    getNearbyPlaces(lat: number, lng: number, radius?: number): Promise<{
        distance: number;
        category: {
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
            slug: string;
            icon: string;
            color: string;
        };
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
    }[]>;
    getCategories(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        description: string | null;
        slug: string;
        icon: string;
        color: string;
    }[]>;
    private calculateDistance;
}
//# sourceMappingURL=place.service.d.ts.map