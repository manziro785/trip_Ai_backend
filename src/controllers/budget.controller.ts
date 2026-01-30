import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { BudgetService } from "../services/budget.service";

const budgetService = new BudgetService();

export class BudgetController {
  // POST /api/budget/:routeId
  async createBudget(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { routeId } = req.params;
      const { plannedBudget } = req.body;
      const userId = req.user!.id;

      const budget = await budgetService.createBudget(
        routeId as string,
        userId,
        plannedBudget,
      );

      res.status(201).json({
        success: true,
        data: budget,
        message: "Budget created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/budget/:routeId
  async getBudget(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { routeId } = req.params;
      const userId = req.user!.id;

      const budget = await budgetService.getBudget(routeId as string, userId);

      res.json({
        success: true,
        data: budget,
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/budget/:routeId
  async updateBudget(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { routeId } = req.params;
      const { plannedBudget } = req.body;
      const userId = req.user!.id;

      const budget = await budgetService.updateBudget(
        routeId as string,
        userId,
        plannedBudget,
      );

      res.json({
        success: true,
        data: budget,
        message: "Budget updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/budget/:routeId/expense
  async addExpense(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { routeId } = req.params;
      const expense = req.body;
      const userId = req.user!.id;

      const budget = await budgetService.addExpense(
        routeId as string,
        userId,
        expense,
      );

      res.status(201).json({
        success: true,
        data: budget,
        message: "Expense added successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/budget/:routeId/stats
  async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { routeId } = req.params;
      const userId = req.user!.id;

      const stats = await budgetService.getBudgetStats(
        routeId as string,
        userId,
      );

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/budget/:routeId/expense/:index
  async deleteExpense(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { routeId, index } = req.params;
      const userId = req.user!.id;

      await budgetService.deleteExpense(
        routeId as string,
        userId,
        parseInt(index as string),
      );

      res.json({
        success: true,
        message: "Expense deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
