import { Request, Response, NextFunction } from "express";
export declare class WeatherController {
    getCurrentWeather(req: Request, res: Response, next: NextFunction): Promise<void>;
    getForecast(req: Request, res: Response, next: NextFunction): Promise<void>;
    getRecommendations(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=weather.controller.d.ts.map