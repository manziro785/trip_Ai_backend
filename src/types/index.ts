import { Request } from "express";

// Extend Express Request with user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

// Route Generation Parameters
export interface RouteGenerationParams {
  timeAvailable: string; // '2-3 hours', 'half-day', 'full-day', 'weekend'
  mood: string[]; // ['food', 'history', 'nature', etc.]
  budget: "low" | "medium" | "high" | "unlimited";
  location?: string;
  companions?: "solo" | "couple" | "family" | "friends";
  transportation?: "walking" | "car" | "public";
}

// Place in Route
export interface RoutePlaceDetail {
  placeId: string;
  name: string;
  duration: number; // minutes
  startTime?: string;
  transportFromPrevious?: {
    type: "walking" | "car" | "taxi";
    duration: number;
    distance: number;
  };
  tips?: string;
}

// AI Chat Message
export interface ChatMessageData {
  message: string;
  routeId?: string;
  context?: {
    currentLocation?: { lat: number; lng: number };
    weather?: any;
    timeOfDay?: string;
  };
}

// Budget Expense
export interface BudgetExpense {
  category: "food" | "transport" | "entrance" | "other";
  amount: number;
  description: string;
  placeId?: string;
  timestamp: Date;
}

// Weather Data
export interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  timestamp: Date;
}

// User Preferences
export interface UserPreferences {
  favoriteCuisines?: string[];
  activityLevel?: "low" | "medium" | "high";
  budget?: "low" | "medium" | "high";
  interests?: string[];
  travelStyle?: "relaxed" | "moderate" | "intensive";
  hasCar?: boolean;
}

// API Response Types
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
