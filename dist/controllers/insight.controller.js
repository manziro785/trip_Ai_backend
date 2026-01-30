"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsightController = void 0;
const insight_service_1 = require("../services/insight.service");
const insightService = new insight_service_1.InsightService();
class InsightController {
    // GET /api/insights
    async getInsights(req, res, next) {
        try {
            const { category, placeId, page, limit } = req.query;
            const result = await insightService.getInsights({
                category: category,
                placeId: placeId,
                page: page ? parseInt(page) : undefined,
                limit: limit ? parseInt(limit) : undefined,
            });
            res.json({
                success: true,
                data: result.insights,
                pagination: result.pagination,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // GET /api/insights/:id
    async getInsightById(req, res, next) {
        try {
            const { id } = req.params;
            const insight = await insightService.getInsightById(id);
            res.json({
                success: true,
                data: insight,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // POST /api/insights/:id/helpful
    async markHelpful(req, res, next) {
        try {
            const { id } = req.params;
            const insight = await insightService.markHelpful(id);
            res.json({
                success: true,
                data: insight,
                message: "Marked as helpful",
            });
        }
        catch (error) {
            next(error);
        }
    }
    // GET /api/insights/by-place/:placeId
    async getInsightsByPlace(req, res, next) {
        try {
            const { placeId } = req.params;
            const insights = await insightService.getInsightsByPlace(placeId);
            res.json({
                success: true,
                data: insights,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // GET /api/insights/random
    async getRandomInsight(_req, res, next) {
        try {
            const insight = await insightService.getRandomInsight();
            res.json({
                success: true,
                data: insight,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // GET /api/insights/trending
    async getTrendingInsights(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const insights = await insightService.getTrendingInsights(limit);
            res.json({
                success: true,
                data: insights,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.InsightController = InsightController;
//# sourceMappingURL=insight.controller.js.map