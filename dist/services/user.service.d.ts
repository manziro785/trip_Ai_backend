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
                icon: string | null;
                color: string | null;
            } | null;
            id: string;
            name: string;
            slug: string;
            photos: string[];
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        placeId: string;
        userId: string;
        visited: boolean;
        wishlist: boolean;
        visitedAt: Date | null;
        liked: boolean;
    })[]>;
    markPlaceVisited(userId: string, placeId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        placeId: string;
        userId: string;
        visited: boolean;
        wishlist: boolean;
        visitedAt: Date | null;
        liked: boolean;
    }>;
    getWishlist(userId: string): Promise<{
        category: {
            name: string;
            icon: string | null;
            color: string | null;
        } | null;
        id: string;
        name: string;
        description: string | null;
        slug: string;
        photos: string[];
    }[]>;
    addToWishlist(userId: string, placeId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        placeId: string;
        userId: string;
        visited: boolean;
        wishlist: boolean;
        visitedAt: Date | null;
        liked: boolean;
    }>;
    removeFromWishlist(userId: string, placeId: string): Promise<{
        success: boolean;
    }>;
    toggleLike(userId: string, placeId: string): Promise<{
        liked: boolean;
    }>;
}
//# sourceMappingURL=user.service.d.ts.map