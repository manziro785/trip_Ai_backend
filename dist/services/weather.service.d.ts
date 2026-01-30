import { WeatherData } from "../types";
export declare class WeatherService {
    private baseUrl;
    getCurrentWeather(lat: number, lng: number): Promise<WeatherData>;
    getForecast(lat: number, lng: number, days?: number): Promise<any>;
    getWeatherRecommendations(lat: number, lng: number): Promise<{
        weather: WeatherData;
        recommendations: string[];
    }>;
    private getLocationHash;
    private getCachedWeather;
    private cacheWeather;
}
//# sourceMappingURL=weather.service.d.ts.map