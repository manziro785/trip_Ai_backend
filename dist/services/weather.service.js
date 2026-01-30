"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const database_1 = require("../config/database");
const crypto_1 = __importDefault(require("crypto"));
class WeatherService {
    constructor() {
        this.baseUrl = "https://api.openweathermap.org/data/2.5";
    }
    // Get current weather
    async getCurrentWeather(lat, lng) {
        try {
            // Check cache first
            const locationHash = this.getLocationHash(lat, lng);
            const cached = await this.getCachedWeather(locationHash);
            if (cached) {
                return cached;
            }
            // Fetch from API
            const response = await axios_1.default.get(`${this.baseUrl}/weather`, {
                params: {
                    lat,
                    lon: lng,
                    appid: env_1.env.OPENWEATHER_API_KEY,
                    units: "metric",
                    lang: "ru",
                },
            });
            const data = response.data;
            const weatherData = {
                temp: Math.round(data.main.temp),
                feelsLike: Math.round(data.main.feels_like),
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                timestamp: new Date(),
            };
            // Cache for 30 minutes
            await this.cacheWeather(locationHash, weatherData, 30);
            return weatherData;
        }
        catch (error) {
            console.error("Weather API error:", error);
            throw new Error("Failed to fetch weather data");
        }
    }
    // Get weather forecast
    async getForecast(lat, lng, days = 5) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/forecast`, {
                params: {
                    lat,
                    lon: lng,
                    appid: env_1.env.OPENWEATHER_API_KEY,
                    units: "metric",
                    lang: "ru",
                    cnt: days * 8, // 8 forecasts per day (every 3 hours)
                },
            });
            const forecasts = response.data.list.map((item) => ({
                date: new Date(item.dt * 1000),
                temp: Math.round(item.main.temp),
                feelsLike: Math.round(item.main.feels_like),
                humidity: item.main.humidity,
                windSpeed: item.wind.speed,
                description: item.weather[0].description,
                icon: item.weather[0].icon,
            }));
            return forecasts;
        }
        catch (error) {
            console.error("Weather forecast API error:", error);
            throw new Error("Failed to fetch weather forecast");
        }
    }
    // Get weather-based recommendations
    async getWeatherRecommendations(lat, lng) {
        const weather = await this.getCurrentWeather(lat, lng);
        const recommendations = [];
        // Temperature-based
        if (weather.temp > 30) {
            recommendations.push("Сегодня жарко! Рекомендуем крытые места и кафе с кондиционером.");
            recommendations.push("Не забудь воду и солнцезащитный крем.");
        }
        else if (weather.temp < 5) {
            recommendations.push("Холодно! Лучше посетить музеи и крытые пространства.");
            recommendations.push("Одевайся теплее, если планируешь долго гулять.");
        }
        else if (weather.temp >= 15 && weather.temp <= 25) {
            recommendations.push("Отличная погода для прогулок на свежем воздухе!");
        }
        // Weather condition-based
        if (weather.description.includes("дождь") ||
            weather.description.includes("rain")) {
            recommendations.push("Дождь! Меняем маршрут на крытые места.");
            recommendations.push("Рекомендуем рынки, музеи и кафе.");
        }
        if (weather.windSpeed > 10) {
            recommendations.push("Сильный ветер. Избегаем открытых пространств.");
        }
        return {
            weather,
            recommendations,
        };
    }
    // Helper: Generate location hash
    getLocationHash(lat, lng) {
        // Round to 2 decimals for caching (~1km precision)
        const roundedLat = Math.round(lat * 100) / 100;
        const roundedLng = Math.round(lng * 100) / 100;
        return crypto_1.default
            .createHash("md5")
            .update(`${roundedLat},${roundedLng}`)
            .digest("hex");
    }
    // Helper: Get cached weather
    async getCachedWeather(locationHash) {
        const cached = await database_1.prisma.weatherCache.findUnique({
            where: { locationHash },
        });
        if (!cached)
            return null;
        // Check if expired
        if (cached.expiresAt < new Date()) {
            await database_1.prisma.weatherCache.delete({ where: { locationHash } });
            return null;
        }
        return cached.data;
    }
    // Helper: Cache weather data
    async cacheWeather(locationHash, data, minutes) {
        const expiresAt = new Date(Date.now() + minutes * 60 * 1000);
        await database_1.prisma.weatherCache.upsert({
            where: { locationHash },
            update: {
                data: data,
                expiresAt,
            },
            create: {
                locationHash,
                data: data,
                expiresAt,
            },
        });
    }
}
exports.WeatherService = WeatherService;
//# sourceMappingURL=weather.service.js.map