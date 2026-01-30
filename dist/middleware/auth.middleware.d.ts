import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const optionalAuth: (req: AuthRequest, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map