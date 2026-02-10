import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { PlaceService } from "../services/place.service";

const placeService = new PlaceService();

export class PlaceController {
  async getPlaces(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId, search, page, limit } = req.query;

      const result = await placeService.getPlaces({
        categoryId: categoryId as string,
        search: search as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      });

      res.json({
        success: true,
        data: result.places,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPlaceById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const place = await placeService.getPlaceById(id as string, userId);

      res.json({
        success: true,
        data: place,
      });
    } catch (error) {
      next(error);
    }
  }

  async getNearbyPlaces(req: Request, res: Response, next: NextFunction) {
    try {
      const { lat, lng, radius } = req.query;

      const places = await placeService.getNearbyPlaces(
        parseFloat(lat as string),
        parseFloat(lng as string),
        radius ? parseFloat(radius as string) : undefined,
      );

      res.json({
        success: true,
        data: places,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await placeService.getCategories();

      res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }
}
