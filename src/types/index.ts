import { Request } from "express";

// Extend Express Request with user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

// Route Status
export type RouteStatus = "SAVED" | "ACTIVE" | "ARCHIVED";

// Route Creation Mode
export type RouteMode = "quick" | "detailed";

// Route Generation Parameters
export interface RouteGenerationParams {
  // Базовые параметры
  location: string; // "Bishkek", "Issyk-Kul", etc.
  scheduledDate: string; // ISO date string "2024-06-15"
  scheduledTime: string; // "10:00"

  // Время (один из вариантов)
  timeAvailable?: string; // '2-3 hours', 'half-day', 'full-day', 'weekend'
  duration?: number; // Или точное время в минутах (240 = 4 часа)
  endTime?: string; // "14:00" - рассчитывается на фронте

  // Основные предпочтения
  mood: string[]; // ['food', 'history', 'nature', etc.]
  budget: number; // В сомах
  companions?: "solo" | "couple" | "family" | "friends";
  transportation?: "walking" | "car" | "public";

  // Режим создания
  mode: RouteMode; // "quick" или "detailed"

  // Для детального режима
  mustInclude?: string[]; // ["Попробовать бешбармак", "Купить сувениры"]
  exclude?: string[]; // ["museums", "nightclubs"]
  preferences?: {
    pace?: "relaxed" | "moderate" | "intensive"; // Темп
    cuisine?: string[]; // ["traditional", "vegetarian", "halal"]
    fitnessLevel?: "low" | "medium" | "high";
    accessibility?: boolean; // Нужна доступность для людей с ограниченными возможностями
  };
}

// Place in Route
export interface RoutePlaceDetail {
  placeId: string;
  name: string;
  category: string;
  description?: string;

  // Время
  startTime: string; // "10:00"
  endTime: string; // "11:30"
  duration: number; // В минутах (90)

  // Стоимость
  estimatedCost: number; // В сомах

  // Транспорт от предыдущего места
  transportFromPrevious?: {
    type: "walking" | "car" | "taxi" | "bus";
    duration: number; // В минутах
    distance: number; // В км
  } | null;

  // Дополнительно
  tips?: string; // AI совет
  photoSpot?: string; // Где лучше фотографироваться
}

// AI Chat Message
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

// User Preferences (автоматически собранные + ручные)
export interface UserPreferences {
  // Автоматически собранные AI
  favoriteCategories?: string[]; // ["food", "history"]
  dislikedCategories?: string[]; // ["museums"]
  averageBudget?: number; // 1400
  companions?: string; // "couple"
  hasCar?: boolean; // false
  travelStyle?: "relaxed" | "moderate" | "intensive";

  // Вручную указанные
  dietaryRestrictions?: string[]; // ["vegetarian", "halal"]
  interests?: string[]; // ["photography", "hiking"]
  fitnessLevel?: "low" | "medium" | "high";

  // Совместимость со старым кодом
  favoriteCuisines?: string[];
  activityLevel?: "low" | "medium" | "high";
  budget?: "low" | "medium" | "high";
}

// Route Response (расширенный)
export interface RouteData {
  id: string;
  userId: string;
  name: string;
  description: string;

  // Статус
  status: RouteStatus;

  // Планирование
  scheduledDate: Date;
  scheduledTime: string;
  endTime: string;

  // Параметры создания
  params: RouteGenerationParams;

  // Места
  places: RoutePlaceDetail[];

  // Расчеты
  totalDuration: number; // В минутах
  totalCost: number; // В сомах
  distance: number; // В км

  // Для активных маршрутов
  startedAt?: Date | null;
  completedAt?: Date | null;
  visitedPlaces?: string[]; // ["place-1", "place-2"]
  currentPlace?: number; // 0-based index (0, 1, 2...)

  // Оценка
  rating?: number | null;

  // Шаринг
  sharedToken?: string | null;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
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

// Route Visit Request
export interface VisitPlaceRequest {
  placeIndex: number; // Индекс места в массиве places
}

// Route Complete Request
export interface CompleteRouteRequest {
  rating?: number; // 1-5
}

// Route Adapt Request
export interface AdaptRouteRequest {
  routeId: string;
  condition: string; // "Начался дождь", "Устал", "Мало времени"
}
