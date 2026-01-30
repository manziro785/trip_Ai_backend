import { RouteGenerationParams } from "../types";
export declare class RouteService {
    generateRoute(params: RouteGenerationParams, userId: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string | null;
        };
    } & {
        params: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        userId: string;
        places: import("@prisma/client/runtime/library").JsonValue;
        totalDuration: number;
        totalCost: number;
        distance: number | null;
        sharedToken: string | null;
        rating: number | null;
    }>;
    getUserRoutes(userId: string, page?: number, limit?: number): Promise<{
        routes: {
            params: import("@prisma/client/runtime/library").JsonValue;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            userId: string;
            places: import("@prisma/client/runtime/library").JsonValue;
            totalDuration: number;
            totalCost: number;
            distance: number | null;
            sharedToken: string | null;
            rating: number | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getRouteById(routeId: string, userId?: string): Promise<{
        user: {
            id: string;
            name: string | null;
        };
    } & {
        params: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        userId: string;
        places: import("@prisma/client/runtime/library").JsonValue;
        totalDuration: number;
        totalCost: number;
        distance: number | null;
        sharedToken: string | null;
        rating: number | null;
    }>;
    updateRoute(routeId: string, userId: string, data: any): Promise<{
        params: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        userId: string;
        places: import("@prisma/client/runtime/library").JsonValue;
        totalDuration: number;
        totalCost: number;
        distance: number | null;
        sharedToken: string | null;
        rating: number | null;
    }>;
    deleteRoute(routeId: string, userId: string): Promise<{
        success: boolean;
    }>;
    shareRoute(routeId: string, userId: string): Promise<{
        shareUrl: string;
        token: string;
        updated: {
            params: import("@prisma/client/runtime/library").JsonValue;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            userId: string;
            places: import("@prisma/client/runtime/library").JsonValue;
            totalDuration: number;
            totalCost: number;
            distance: number | null;
            sharedToken: string | null;
            rating: number | null;
        };
    }>;
    getSharedRoute(token: string): Promise<{
        user: {
            name: string | null;
        };
    } & {
        params: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        userId: string;
        places: import("@prisma/client/runtime/library").JsonValue;
        totalDuration: number;
        totalCost: number;
        distance: number | null;
        sharedToken: string | null;
        rating: number | null;
    }>;
    rateRoute(routeId: string, userId: string, rating: number): Promise<{
        params: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        userId: string;
        places: import("@prisma/client/runtime/library").JsonValue;
        totalDuration: number;
        totalCost: number;
        distance: number | null;
        sharedToken: string | null;
        rating: number | null;
    }>;
}
//# sourceMappingURL=route.service.d.ts.map