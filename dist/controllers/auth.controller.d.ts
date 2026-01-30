import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
export declare class AuthController {
    register(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    login(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    googleAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getCurrentUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map