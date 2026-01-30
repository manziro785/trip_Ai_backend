import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
export declare class AIController {
    chat(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    adaptRoute(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getRecommendations(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=ai.controller.d.ts.map