import { Response, NextFunction } from "express";
import { AuthRequest, VisitPlaceRequest } from "../types";
import { RouteService } from "../services/route.service";

const routeService = new RouteService();

export class RouteController {
  async generateRoute(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const params = req.body;
      const userId = req.user!.id;

      const route = await routeService.generateRoute(params, userId);

      res.status(201).json({
        success: true,
        data: route,
        message: "Route generated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserRoutes(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as any;

      const result = await routeService.getUserRoutes(
        userId,
        page,
        limit,
        status,
      );

      res.json({
        success: true,
        data: result.routes,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getActiveRoute(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const route = await routeService.getActiveRoute(userId);

      res.json({
        success: true,
        data: route,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRouteById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const route = await routeService.getRouteById(id as string, userId);

      res.json({
        success: true,
        data: route,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRoute(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const data = req.body;

      const route = await routeService.updateRoute(id as string, userId, data);

      res.json({
        success: true,
        data: route,
        message: "Route updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteRoute(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      await routeService.deleteRoute(id as string, userId);

      res.json({
        success: true,
        message: "Route deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }


  async startRoute(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const route = await routeService.startRoute(id as string, userId);

      res.json({
        success: true,
        data: route,
        message: "Route started successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async visitPlace(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const data: VisitPlaceRequest = req.body;

      const route = await routeService.visitPlace(id as string, userId, data);

      res.json({
        success: true,
        data: route,
        message: "Place marked as visited",
      });
    } catch (error) {
      next(error);
    }
  }

  async completeRoute(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const { rating } = req.body;

      const route = await routeService.completeRoute(
        id as string,
        userId,
        rating,
      );

      res.json({
        success: true,
        data: route,
        message: "Route completed successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async shareRoute(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const result = await routeService.shareRoute(id as string, userId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSharedRoute(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;
      const route = await routeService.getSharedRoute(token as string);

      res.json({
        success: true,
        data: route,
      });
    } catch (error) {
      next(error);
    }
  }

  async rateRoute(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { rating } = req.body;
      const userId = req.user!.id;

      const route = await routeService.rateRoute(id as string, userId, rating);

      res.json({
        success: true,
        data: route,
        message: "Route rated successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
