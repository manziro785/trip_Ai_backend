import axios from "axios";
import { env } from "../config/env";
import { prisma } from "../config/database";
import crypto from "crypto";
import { WeatherData } from "../types";

export class WeatherService {
  private baseUrl = "https://api.openweathermap.org/data/2.5";

  async getCurrentWeather(lat: number, lng: number): Promise<WeatherData> {
    if (!env.OPENWEATHER_API_KEY) {
      throw new Error("OPENWEATHER_API_KEY is not set");
    }
    try {
      const locationHash = this.getLocationHash(lat, lng);
      const cached = await this.getCachedWeather(locationHash);

      if (cached) {
        return cached;
      }

      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon: lng,
          appid: env.OPENWEATHER_API_KEY,
          units: "metric",
          lang: "ru",
        },
      });

      const data = response.data;

      const weatherData: WeatherData = {
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        timestamp: new Date(),
      };

      await this.cacheWeather(locationHash, weatherData, 30);

      return weatherData;
    } catch (error) {
      console.error("Weather API error:", error);
      throw new Error("Failed to fetch weather data");
    }
  }

  async getForecast(lat: number, lng: number, days: number = 5) {
    if (!env.OPENWEATHER_API_KEY) {
      throw new Error("OPENWEATHER_API_KEY is not set");
    }
    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat,
          lon: lng,
          appid: env.OPENWEATHER_API_KEY,
          units: "metric",
          lang: "ru",
          cnt: days * 8,
        },
      });

      const forecasts = response.data.list.map((item: any) => ({
        date: new Date(item.dt * 1000),
        temp: Math.round(item.main.temp),
        feelsLike: Math.round(item.main.feels_like),
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      }));

      return forecasts;
    } catch (error) {
      console.error("Weather forecast API error:", error);
      throw new Error("Failed to fetch weather forecast");
    }
  }

  async getWeatherRecommendations(lat: number, lng: number) {
    const weather = await this.getCurrentWeather(lat, lng);

    const recommendations: string[] = [];

    if (weather.temp > 30) {
      recommendations.push(
        "It's hot today! We recommend indoor places and cafes with air conditioning.",
      );
      recommendations.push("Don't forget to drink water :)");
    } else if (weather.temp < 5) {
      recommendations.push("Dress warmly if you plan to walk for a long time.");
    } else if (weather.temp < 15) {
      recommendations.push(
        "Have a nice day, don't forget to enjoy your time :)",
      );
    } else if (weather.temp >= 15 && weather.temp <= 25) {
      recommendations.push("Great weather for outdoor walks!");
    }

    if (
      weather.description.includes("rain") ||
      weather.description.includes("дождь")
    ) {
      recommendations.push(
        "It's raining! Let's switch the route to indoor places.",
      );
      recommendations.push("We recommend markets, museums, and cafes.");
    }

    if (weather.windSpeed > 10) {
      recommendations.push("Strong wind. Avoid open areas.");
    }

    return {
      weather,
      recommendations,
    };
  }

  private getLocationHash(lat: number, lng: number): string {
    const roundedLat = Math.round(lat * 100) / 100;
    const roundedLng = Math.round(lng * 100) / 100;
    return crypto
      .createHash("md5")
      .update(`${roundedLat},${roundedLng}`)
      .digest("hex");
  }

  private async getCachedWeather(
    locationHash: string,
  ): Promise<WeatherData | null> {
    const cached = await prisma.weatherCache.findUnique({
      where: { locationHash },
    });

    if (!cached) return null;

    if (cached.expiresAt < new Date()) {
      await prisma.weatherCache.delete({ where: { locationHash } });
      return null;
    }

    return cached.data as unknown as WeatherData;
  }

  private async cacheWeather(
    locationHash: string,
    data: WeatherData,
    minutes: number,
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + minutes * 60 * 1000);

    await prisma.weatherCache.upsert({
      where: { locationHash },
      update: {
        data: data as any,
        expiresAt,
      },
      create: {
        locationHash,
        data: data as any,
        expiresAt,
      },
    });
  }
}
