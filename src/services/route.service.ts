import { prisma } from "../config/database";
import { RouteGenerationParams } from "../types";
import { AIService } from "./ai.service";
import { AppError } from "../middleware/error.middleware";
import crypto from "crypto";

const aiService = new AIService();

export class RouteService {
  // Generate new route
  async generateRoute(params: RouteGenerationParams, userId: string) {
    // Use AI to generate route
    const aiRoute = await aiService.generateRoute(params, userId);

    // Create route in database
    const route = await prisma.route.create({
      data: {
        userId,
        name: aiRoute.routeName,
        description: aiRoute.description,
        params: params as any,
        places: aiRoute.places,
        totalDuration: aiRoute.totalDuration,
        totalCost: aiRoute.totalCost,
        distance: aiRoute.distance,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return route;
  }

  // Get user routes
  async getUserRoutes(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [routes, total] = await Promise.all([
      prisma.route.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.route.count({ where: { userId } }),
    ]);

    return {
      routes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get route by ID
  async getRouteById(routeId: string, userId?: string) {
    const route = await prisma.route.findUnique({
      where: { id: routeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!route) {
      throw new AppError("Route not found", 404);
    }

    // Check if user has access (own route or shared)
    if (userId && route.userId !== userId && !route.sharedToken) {
      throw new AppError("Unauthorized access", 403);
    }

    return route;
  }

  // Update route
  async updateRoute(routeId: string, userId: string, data: any) {
    const route = await prisma.route.findUnique({
      where: { id: routeId },
    });

    if (!route) {
      throw new AppError("Route not found", 404);
    }

    if (route.userId !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    const updated = await prisma.route.update({
      where: { id: routeId },
      data,
    });

    return updated;
  }

  // Delete route
  async deleteRoute(routeId: string, userId: string) {
    const route = await prisma.route.findUnique({
      where: { id: routeId },
    });

    if (!route) {
      throw new AppError("Route not found", 404);
    }

    if (route.userId !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    await prisma.route.delete({
      where: { id: routeId },
    });

    return { success: true };
  }

  // Share route
  async shareRoute(routeId: string, userId: string) {
    const route = await prisma.route.findUnique({
      where: { id: routeId },
    });

    if (!route) {
      throw new AppError("Route not found", 404);
    }

    if (route.userId !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    // Generate share token if not exists
    const sharedToken =
      route.sharedToken || crypto.randomBytes(16).toString("hex");

    const updated = await prisma.route.update({
      where: { id: routeId },
      data: { sharedToken },
    });

    return {
      shareUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/routes/shared/${sharedToken}`,
      token: sharedToken,
      updated,
    };
  }

  // Get shared route
  async getSharedRoute(token: string) {
    const route = await prisma.route.findUnique({
      where: { sharedToken: token },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!route) {
      throw new AppError("Shared route not found", 404);
    }

    return route;
  }

  // Rate route
  async rateRoute(routeId: string, userId: string, rating: number) {
    const route = await prisma.route.findUnique({
      where: { id: routeId },
    });

    if (!route) {
      throw new AppError("Route not found", 404);
    }

    if (route.userId !== userId) {
      throw new AppError("Can only rate your own routes", 403);
    }

    const updated = await prisma.route.update({
      where: { id: routeId },
      data: { rating },
    });

    return updated;
  }
}
