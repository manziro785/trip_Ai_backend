import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types";
export declare class PlaceController {
    getPlaces(req: Request, res: Response, next: NextFunction): Promise<void>;
    getPlaceById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getNearbyPlaces(req: Request, res: Response, next: NextFunction): Promise<void>;
    getCategories(_req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=place.controller.d.ts.map