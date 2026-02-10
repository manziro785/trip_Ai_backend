import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
export declare class RouteController {
    generateRoute(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getUserRoutes(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getActiveRoute(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getRouteById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    updateRoute(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    deleteRoute(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    startRoute(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    visitPlace(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    completeRoute(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    shareRoute(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getSharedRoute(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    rateRoute(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=route.controller.d.ts.map