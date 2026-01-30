"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIController = void 0;
const ai_service_1 = require("../services/ai.service");
const database_1 = require("../config/database");
const aiService = new ai_service_1.AIService();
class AIController {
    // POST /api/ai/chat
    async chat(req, res, next) {
        try {
            const { message, routeId, context } = req.body;
            const userId = req.user.id;
            // Get chat history
            const chatHistory = await database_1.prisma.chatMessage.findMany({
                where: { userId, routeId: routeId || null },
                orderBy: { createdAt: "desc" },
                take: 5,
                select: { role: true, message: true },
            });
            const formattedHistory = chatHistory.reverse().map((m) => ({
                role: m.role,
                content: m.message,
            }));
            // Get AI response
            const response = await aiService.chat(message, {
                ...context,
                chatHistory: formattedHistory,
            });
            // Save messages to database
            await database_1.prisma.chatMessage.createMany({
                data: [
                    {
                        userId,
                        routeId: routeId || null,
                        message,
                        role: "user",
                        context: context || null,
                    },
                    {
                        userId,
                        routeId: routeId || null,
                        message: response,
                        role: "assistant",
                    },
                ],
            });
            res.json({
                success: true,
                data: {
                    message: response,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    // POST /api/ai/adapt-route
    async adaptRoute(req, res, next) {
        try {
            const { routeId, condition } = req.body;
            const userId = req.user.id;
            const adapted = await aiService.adaptRoute(routeId, condition, userId);
            res.json({
                success: true,
                data: adapted,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // GET /api/ai/recommendations
    async getRecommendations(req, res, next) {
        try {
            const userId = req.user.id;
            const recommendations = await aiService.getRecommendations(userId);
            res.json({
                success: true,
                data: recommendations,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AIController = AIController;
//# sourceMappingURL=ai.controller.js.map