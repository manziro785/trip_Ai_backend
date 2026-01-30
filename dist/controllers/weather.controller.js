"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherController = void 0;
const weather_service_1 = require("../services/weather.service");
const weatherService = new weather_service_1.WeatherService();
class WeatherController {
    // GET /api/weather/current
    async getCurrentWeather(req, res, next) {
        try {
            const { lat, lng } = req.query;
            const weather = await weatherService.getCurrentWeather(parseFloat(lat), parseFloat(lng));
            res.json({
                success: true,
                data: weather,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // GET /api/weather/forecast
    async getForecast(req, res, next) {
        try {
            const { lat, lng, days } = req.query;
            const forecast = await weatherService.getForecast(parseFloat(lat), parseFloat(lng), days ? parseInt(days) : undefined);
            res.json({
                success: true,
                data: forecast,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // GET /api/weather/recommendations
    async getRecommendations(req, res, next) {
        try {
            const { lat, lng } = req.query;
            const result = await weatherService.getWeatherRecommendations(parseFloat(lat), parseFloat(lng));
            res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.WeatherController = WeatherController;
//# sourceMappingURL=weather.controller.js.map