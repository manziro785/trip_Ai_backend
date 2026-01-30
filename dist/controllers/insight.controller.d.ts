import { Request, Response, NextFunction } from "express";
export declare class InsightController {
    getInsights(req: Request, res: Response, next: NextFunction): Promise<void>;
    getInsightById(req: Request, res: Response, next: NextFunction): Promise<void>;
    markHelpful(req: Request, res: Response, next: NextFunction): Promise<void>;
    getInsightsByPlace(req: Request, res: Response, next: NextFunction): Promise<void>;
    getRandomInsight(_req: Request, res: Response, next: NextFunction): Promise<void>;
    getTrendingInsights(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=insight.controller.d.ts.map