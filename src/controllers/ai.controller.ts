import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { AIService } from "../services/ai.service";
import { prisma } from "../config/database";

const aiService = new AIService();

export class AIController {
  // POST /api/ai/chat
  async chat(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { message, routeId, context } = req.body;
      const userId = req.user!.id;

      // Get chat history
      const chatHistory = await prisma.chatMessage.findMany({
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
      await prisma.chatMessage.createMany({
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
    } catch (error) {
      next(error);
    }
  }

  // POST /api/ai/adapt-route
  async adaptRoute(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { routeId, condition } = req.body;
      const userId = req.user!.id;

      const adapted = await aiService.adaptRoute(routeId, condition, userId);

      res.json({
        success: true,
        data: adapted,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/ai/recommendations
  async getRecommendations(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user!.id;

      const recommendations = await aiService.getRecommendations(userId);

      res.json({
        success: true,
        data: recommendations,
      });
    } catch (error) {
      next(error);
    }
  }
}
