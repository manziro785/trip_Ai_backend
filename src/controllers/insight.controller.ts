import { Request, Response, NextFunction } from "express";
import { InsightService } from "../services/insight.service";

const insightService = new InsightService();

export class InsightController {
  async getInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, placeId, page, limit } = req.query;

      const result = await insightService.getInsights({
        category: category as string,
        placeId: placeId as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      });

      res.json({
        success: true,
        data: result.insights,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getInsightById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const insight = await insightService.getInsightById(id as string);

      res.json({
        success: true,
        data: insight,
      });
    } catch (error) {
      next(error);
    }
  }

  async markHelpful(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const insight = await insightService.markHelpful(id as string);

      res.json({
        success: true,
        data: insight,
        message: "Marked as helpful",
      });
    } catch (error) {
      next(error);
    }
  }

  async getInsightsByPlace(req: Request, res: Response, next: NextFunction) {
    try {
      const { placeId } = req.params;

      const insights = await insightService.getInsightsByPlace(
        placeId as string,
      );

      res.json({
        success: true,
        data: insights,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRandomInsight(_req: Request, res: Response, next: NextFunction) {
    try {
      const insight = await insightService.getRandomInsight();

      res.json({
        success: true,
        data: insight,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTrendingInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;

      const insights = await insightService.getTrendingInsights(limit);

      res.json({
        success: true,
        data: insights,
      });
    } catch (error) {
      next(error);
    }
  }
}
