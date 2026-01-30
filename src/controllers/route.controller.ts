import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { RouteService } from "../services/route.service";

const routeService = new RouteService();

export class RouteController {
  // POST /api/routes/generate
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

  // GET /api/routes
  async getUserRoutes(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await routeService.getUserRoutes(userId, page, limit);

      res.json({
        success: true,
        data: result.routes,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/routes/:id
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

  // PUT /api/routes/:id
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

  // DELETE /api/routes/:id
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

  // POST /api/routes/:id/share
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

  // GET /api/routes/shared/:token
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

  // POST /api/routes/:id/rate
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
