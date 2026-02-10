import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export type RouteStatus = "SAVED" | "ACTIVE" | "ARCHIVED";

export type RouteMode = "quick" | "detailed";

export interface RouteGenerationParams {
  location: string;
  scheduledDate: string;
  scheduledTime: string;

  timeAvailable?: string;
  duration?: number;
  endTime?: string;

  mood: string[];
  budget: number;
  companions?: "solo" | "couple" | "family" | "friends";
  transportation?: "walking" | "car" | "public";

  mode: RouteMode;

  mustInclude?: string[];
  exclude?: string[];
  preferences?: {
    pace?: "relaxed" | "moderate" | "intensive";
    cuisine?: string[];
    fitnessLevel?: "low" | "medium" | "high";
    accessibility?: boolean;
  };
}

export interface RoutePlaceDetail {
  placeId: string;
  name: string;
  category: string;
  description?: string;

  startTime: string;
  endTime: string;
  duration: number;

  estimatedCost: number;

  transportFromPrevious?: {
    type: "walking" | "car" | "taxi" | "bus";
    duration: number;
    distance: number;
  } | null;

  tips?: string;
  photoSpot?: string;
}

export interface ChatMessageData {
  message: string;
  routeId?: string;
  context?: {
    currentLocation?: { lat: number; lng: number };
    currentPlace?: string;
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
  favoriteCategories?: string[];
  dislikedCategories?: string[];
  averageBudget?: number;
  companions?: string;
  hasCar?: boolean;
  travelStyle?: "relaxed" | "moderate" | "intensive";

  dietaryRestrictions?: string[];
  interests?: string[];
  fitnessLevel?: "low" | "medium" | "high";

  favoriteCuisines?: string[];
  activityLevel?: "low" | "medium" | "high";
  budget?: "low" | "medium" | "high";
}

export interface RouteData {
  id: string;
  userId: string;
  name: string;
  description: string;

  status: RouteStatus;

  scheduledDate: Date;
  scheduledTime: string;
  endTime: string;

  params: RouteGenerationParams;

  places: RoutePlaceDetail[];

  totalDuration: number;
  totalCost: number;
  distance: number;

  startedAt?: Date | null;
  completedAt?: Date | null;
  visitedPlaces?: string[];
  currentPlace?: number;

  rating?: number | null;

  sharedToken?: string | null;

  createdAt: Date;
  updatedAt: Date;
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

export interface VisitPlaceRequest {
  placeIndex: number;
}

export interface CompleteRouteRequest {
  rating?: number;
}

export interface AdaptRouteRequest {
  routeId: string;
  condition: string;
}
