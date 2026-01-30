import { Request } from "express";
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        name?: string;
    };
}
export interface RouteGenerationParams {
    timeAvailable: string;
    mood: string[];
    budget: "low" | "medium" | "high" | "unlimited";
    location?: string;
    companions?: "solo" | "couple" | "family" | "friends";
    transportation?: "walking" | "car" | "public";
}
export interface RoutePlaceDetail {
    placeId: string;
    name: string;
    duration: number;
    startTime?: string;
    transportFromPrevious?: {
        type: "walking" | "car" | "taxi";
        duration: number;
        distance: number;
    };
    tips?: string;
}
export interface ChatMessageData {
    message: string;
    routeId?: string;
    context?: {
        currentLocation?: {
            lat: number;
            lng: number;
        };
        weather?: any;
        timeOfDay?: string;
    };
}
export interface BudgetExpense {
    category: "food" | "transport" | "entrance" | "other";
    amount: number;
    description: string;
    placeId?: string;
    timestamp: Date;
}
export interface WeatherData {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    description: string;
    icon: string;
    timestamp: Date;
}
export interface UserPreferences {
    favoriteCuisines?: string[];
    activityLevel?: "low" | "medium" | "high";
    budget?: "low" | "medium" | "high";
    interests?: string[];
    travelStyle?: "relaxed" | "moderate" | "intensive";
    hasCar?: boolean;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
export interface PaginatedResponse<T> extends ApiResponse<T> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
//# sourceMappingURL=index.d.ts.map