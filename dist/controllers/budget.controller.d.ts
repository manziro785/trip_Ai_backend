import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
export declare class BudgetController {
    createBudget(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getBudget(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    updateBudget(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    addExpense(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    deleteExpense(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=budget.controller.d.ts.map