import { UserPreferences } from "../types";
export declare class UserService {
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        avatar: string | null;
        preferences: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
    }>;
    updateProfile(userId: string, data: {
        name?: string;
        avatar?: string;
    }): Promise<{
        id: string;
        email: string;
        name: string | null;
        avatar: string | null;
    }>;
    updatePreferences(userId: string, preferences: UserPreferences): Promise<{
        id: string;
        preferences: import("@prisma/client/runtime/library").JsonValue;
    }>;
    getUserStats(userId: string): Promise<{
        visitedPlaces: number;
        totalRoutes: number;
        wishlistCount: number;
        travelDays: number;
    }>;
    getVisitHistory(userId: string, limit?: number): Promise<({
        place: {
            category: {
                name: string;
                icon: string;
                color: string;
            };
            id: string;
            name: string;
            slug: string;
            photos: string[];
        };
    } & {
        id: string;
        createdAt: Date;
        placeId: string;
        userId: string;
        visited: boolean;
        wishlist: boolean;
        liked: boolean;
        visitedAt: Date | null;
    })[]>;
    markPlaceVisited(userId: string, placeId: string): Promise<{
        id: string;
        createdAt: Date;
        placeId: string;
        userId: string;
        visited: boolean;
        wishlist: boolean;
        liked: boolean;
        visitedAt: Date | null;
    }>;
    getWishlist(userId: string): Promise<{
        category: {
            name: string;
            icon: string;
            color: string;
        };
        id: string;
        name: string;
        description: string;
        slug: string;
        photos: string[];
    }[]>;
    addToWishlist(userId: string, placeId: string): Promise<{
        id: string;
        createdAt: Date;
        placeId: string;
        userId: string;
        visited: boolean;
        wishlist: boolean;
        liked: boolean;
        visitedAt: Date | null;
    }>;
    removeFromWishlist(userId: string, placeId: string): Promise<{
        success: boolean;
    }>;
    toggleLike(userId: string, placeId: string): Promise<{
        liked: boolean;
    }>;
}
//# sourceMappingURL=user.service.d.ts.map