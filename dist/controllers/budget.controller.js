"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetController = void 0;
const budget_service_1 = require("../services/budget.service");
const budgetService = new budget_service_1.BudgetService();
class BudgetController {
    // POST /api/budget/:routeId
    async createBudget(req, res, next) {
        try {
            const { routeId } = req.params;
            const { plannedBudget } = req.body;
            const userId = req.user.id;
            const budget = await budgetService.createBudget(routeId, userId, plannedBudget);
            res.status(201).json({
                success: true,
                data: budget,
                message: "Budget created successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
    // GET /api/budget/:routeId
    async getBudget(req, res, next) {
        try {
            const { routeId } = req.params;
            const userId = req.user.id;
            const budget = await budgetService.getBudget(routeId, userId);
            res.json({
                success: true,
                data: budget,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // PUT /api/budget/:routeId
    async updateBudget(req, res, next) {
        try {
            const { routeId } = req.params;
            const { plannedBudget } = req.body;
            const userId = req.user.id;
            const budget = await budgetService.updateBudget(routeId, userId, plannedBudget);
            res.json({
                success: true,
                data: budget,
                message: "Budget updated successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
    // POST /api/budget/:routeId/expense
    async addExpense(req, res, next) {
        try {
            const { routeId } = req.params;
            const expense = req.body;
            const userId = req.user.id;
            const budget = await budgetService.addExpense(routeId, userId, expense);
            res.status(201).json({
                success: true,
                data: budget,
                message: "Expense added successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
    // GET /api/budget/:routeId/stats
    async getStats(req, res, next) {
        try {
            const { routeId } = req.params;
            const userId = req.user.id;
            const stats = await budgetService.getBudgetStats(routeId, userId);
            res.json({
                success: true,
                data: stats,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // DELETE /api/budget/:routeId/expense/:index
    async deleteExpense(req, res, next) {
        try {
            const { routeId, index } = req.params;
            const userId = req.user.id;
            await budgetService.deleteExpense(routeId, userId, parseInt(index));
            res.json({
                success: true,
                message: "Expense deleted successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.BudgetController = BudgetController;
//# sourceMappingURL=budget.controller.js.map