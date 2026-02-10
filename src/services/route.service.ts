import { prisma } from "../config/database";
import {
  RouteGenerationParams,
  RouteStatus,
  VisitPlaceRequest,
} from "../types";
import { AIService } from "./ai.service";
import { AppError } from "../middleware/error.middleware";
import crypto from "crypto";

const aiService = new AIService();

export class RouteService {
  async generateRoute(params: RouteGenerationParams, userId: string) {
    if (!params.scheduledDate || !params.scheduledTime) {
      throw new AppError("scheduledDate and scheduledTime are required", 400);
    }

    let endTime = params.endTime;
    if (!endTime && params.duration) {
      const [hours, minutes] = params.scheduledTime.split(":").map(Number);
      const startMinutes = hours * 60 + minutes;
      const endMinutes = startMinutes + params.duration;
      const endHours = Math.floor(endMinutes / 60) % 24;
      const endMins = endMinutes % 60;
      endTime = `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`;
    } else if (!endTime && params.timeAvailable) {
      const durationMap: { [key: string]: number } = {
        "2-3 hours": 180,
        "half-day": 270,
        "full-day": 480,
        weekend: 960,
      };
      const duration = durationMap[params.timeAvailable] || 240;
      const [hours, minutes] = params.scheduledTime.split(":").map(Number);
      const startMinutes = hours * 60 + minutes;
      const endMinutes = startMinutes + duration;
      const endHours = Math.floor(endMinutes / 60) % 24;
      const endMins = endMinutes % 60;
      endTime = `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`;
    }

    const aiRoute = await aiService.generateRoute(params, userId);

    const scheduledDateTime = new Date(params.scheduledDate);

    const route = await prisma.route.create({
      data: {
        userId,
        name: aiRoute.routeName,
        description: aiRoute.description,
        status: "SAVED",
        scheduledDate: scheduledDateTime,
        scheduledTime: params.scheduledTime,
        endTime: endTime || "18:00",
        params: params as any,
        places: aiRoute.places,
        totalDuration: aiRoute.totalDuration,
        totalCost: aiRoute.totalCost,
        distance: aiRoute.distance,
        startedAt: null,
        completedAt: null,
        visitedPlaces: [],
        currentPlace: 0,
        rating: null,
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

  async getUserRoutes(
    userId: string,
    page: number = 1,
    limit: number = 10,
    status?: RouteStatus,
  ) {
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const [routes, total] = await Promise.all([
      prisma.route.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.route.count({ where }),
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

  async getActiveRoute(userId: string) {
    const route = await prisma.route.findFirst({
      where: {
        userId,
        status: "ACTIVE",
      },
      orderBy: {
        startedAt: "desc",
      },
    });

    return route;
  }

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

    if (userId && route.userId !== userId && !route.sharedToken) {
      throw new AppError("Unauthorized access", 403);
    }

    return route;
  }

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


  async startRoute(routeId: string, userId: string) {
    const route = await prisma.route.findUnique({
      where: { id: routeId },
    });

    if (!route) {
      throw new AppError("Route not found", 404);
    }

    if (route.userId !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    if (route.status === "ACTIVE") {
      throw new AppError("Route is already active", 400);
    }

    if (route.status === "ARCHIVED") {
      throw new AppError("Cannot start archived route", 400);
    }

    const activeRoute = await this.getActiveRoute(userId);
    if (activeRoute) {
      throw new AppError(
        "You already have an active route. Complete or pause it first.",
        400,
      );
    }

    const updated = await prisma.route.update({
      where: { id: routeId },
      data: {
        status: "ACTIVE",
        startedAt: new Date(),
        currentPlace: 0,
        visitedPlaces: [],
      },
    });

    return updated;
  }

  async visitPlace(routeId: string, userId: string, data: VisitPlaceRequest) {
    const route = await prisma.route.findUnique({
      where: { id: routeId },
    });

    if (!route) {
      throw new AppError("Route not found", 404);
    }

    if (route.userId !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    if (route.status !== "ACTIVE") {
      throw new AppError("Route is not active", 400);
    }

    const places = route.places as any[];
    if (data.placeIndex < 0 || data.placeIndex >= places.length) {
      throw new AppError("Invalid place index", 400);
    }

    const placeId = places[data.placeIndex].placeId;
    const visitedPlaces = (route.visitedPlaces as string[]) || [];

    if (!visitedPlaces.includes(placeId)) {
      visitedPlaces.push(placeId);
    }

    const nextPlace = Math.min(data.placeIndex + 1, places.length);

    const updated = await prisma.route.update({
      where: { id: routeId },
      data: {
        visitedPlaces: visitedPlaces as any,
        currentPlace: nextPlace,
      },
    });

    try {
      await prisma.userPlaceInteraction.upsert({
        where: {
          userId_placeId: { userId, placeId },
        },
        update: {
          visited: true,
          visitedAt: new Date(),
        },
        create: {
          userId,
          placeId,
          visited: true,
          visitedAt: new Date(),
        },
      });
    } catch (error) {
      console.log("Place not found in database:", placeId);
    }

    return updated;
  }

  async completeRoute(routeId: string, userId: string, rating?: number) {
    const route = await prisma.route.findUnique({
      where: { id: routeId },
    });

    if (!route) {
      throw new AppError("Route not found", 404);
    }

    if (route.userId !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    if (route.status !== "ACTIVE") {
      throw new AppError("Route is not active", 400);
    }

    const updated = await prisma.route.update({
      where: { id: routeId },
      data: {
        status: "ARCHIVED",
        completedAt: new Date(),
        rating: rating || null,
      },
    });

    return updated;
  }

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

    const sharedToken =
      route.sharedToken || crypto.randomBytes(16).toString("hex");

    const updated = await prisma.route.update({
      where: { id: routeId },
      data: { sharedToken },
    });

    return {
      shareUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/routes/shared/${sharedToken}`,
      token: sharedToken,
      route: updated,
    };
  }

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

    if (rating < 1 || rating > 5) {
      throw new AppError("Rating must be between 1 and 5", 400);
    }

    const updated = await prisma.route.update({
      where: { id: routeId },
      data: { rating },
    });

    return updated;
  }
}
