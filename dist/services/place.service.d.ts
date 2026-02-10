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
                icon: string | null;
                color: string | null;
            } | null;
        } & {
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
            updatedAt: Date | null;
            description: string | null;
            slug: string;
            icon: string | null;
            color: string | null;
        } | null;
        insights: {
            category: string;
            id: string;
            createdAt: Date;
            updatedAt: Date | null;
            placeId: string | null;
            icon: string | null;
            helpfulCount: number;
            title: string;
            content: string | null;
        }[];
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
    }>;
    getNearbyPlaces(lat: number, lng: number, radius?: number): Promise<{
        distance: number;
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date | null;
            description: string | null;
            slug: string;
            icon: string | null;
            color: string | null;
        } | null;
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
    }[]>;
    getCategories(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        description: string | null;
        slug: string;
        icon: string | null;
        color: string | null;
    }[]>;
    private calculateDistance;
}
//# sourceMappingURL=place.service.d.ts.map