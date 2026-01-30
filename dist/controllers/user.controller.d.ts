import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
export declare class UserController {
    getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    updatePreferences(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    markVisited(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getWishlist(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    addToWishlist(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    removeFromWishlist(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    toggleLike(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=user.controller.d.ts.map