import { Request, Response, NextFunction } from "express";
import { WeatherService } from "../services/weather.service";

const weatherService = new WeatherService();

export class WeatherController {
  async getCurrentWeather(req: Request, res: Response, next: NextFunction) {
    try {
      const { lat, lng } = req.query;

      const weather = await weatherService.getCurrentWeather(
        parseFloat(lat as string),
        parseFloat(lng as string),
      );

      res.json({
        success: true,
        data: weather,
      });
    } catch (error) {
      next(error);
    }
  }

  async getForecast(req: Request, res: Response, next: NextFunction) {
    try {
      const { lat, lng, days } = req.query;

      const forecast = await weatherService.getForecast(
        parseFloat(lat as string),
        parseFloat(lng as string),
        days ? parseInt(days as string) : undefined,
      );

      res.json({
        success: true,
        data: forecast,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const { lat, lng } = req.query;

      const result = await weatherService.getWeatherRecommendations(
        parseFloat(lat as string),
        parseFloat(lng as string),
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
