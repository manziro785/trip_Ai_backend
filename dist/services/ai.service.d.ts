import { RouteGenerationParams } from "../types";
export declare class AIService {
    private groq;
    constructor();
    generateRoute(params: RouteGenerationParams, userId?: string): Promise<any>;
    chat(message: string, context?: any, autoApply?: boolean): Promise<{
        message: any;
        routeUpdated: boolean;
        updatedRoute: {
            params: import("@prisma/client/runtime/library").JsonValue;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date | null;
            scheduledDate: Date | null;
            scheduledTime: string | null;
            endTime: string | null;
            rating: number | null;
            description: string | null;
            userId: string | null;
            status: string;
            places: import("@prisma/client/runtime/library").JsonValue;
            totalDuration: number | null;
            totalCost: number | null;
            distance: number;
            startedAt: Date | null;
            completedAt: Date | null;
            visitedPlaces: import("@prisma/client/runtime/library").JsonValue | null;
            currentPlace: number | null;
            sharedToken: string | null;
        };
        action?: undefined;
        modifications?: undefined;
    } | {
        message: any;
        action: any;
        modifications: any;
        routeUpdated?: undefined;
        updatedRoute?: undefined;
    } | {
        message: string;
        routeUpdated: boolean;
        updatedRoute?: undefined;
        action?: undefined;
        modifications?: undefined;
    }>;
    private applyRouteModifications;
    private addMinutes;
    adaptRoute(routeId: string, condition: string, _userId: string): Promise<any>;
    getRecommendations(userId: string): Promise<any>;
    private createRoutePrompt;
}
//# sourceMappingURL=ai.service.d.ts.map