"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetService = void 0;
const database_1 = require("../config/database");
const error_middleware_1 = require("../middleware/error.middleware");
class BudgetService {
    async createBudget(routeId, userId, plannedBudget) {
        const route = await database_1.prisma.route.findUnique({
            where: { id: routeId },
        });
        if (!route) {
            throw new error_middleware_1.AppError("Route not found", 404);
        }
        if (route.userId !== userId) {
            throw new error_middleware_1.AppError("Unauthorized", 403);
        }
        const budget = await database_1.prisma.budgetTracking.create({
            data: {
                routeId,
                userId,
                plannedBudget,
                spent: 0,
                expenses: [],
            },
        });
        return budget;
    }
    async getBudget(routeId, userId) {
        const budget = await database_1.prisma.budgetTracking.findUnique({
            where: {
                routeId_userId: { routeId, userId },
            },
        });
        if (!budget) {
            throw new error_middleware_1.AppError("Budget not found", 404);
        }
        const expenses = budget.expenses;
        const breakdown = {
            food: 0,
            transport: 0,
            entrance: 0,
            other: 0,
        };
        expenses.forEach((expense) => {
            breakdown[expense.category] += expense.amount;
        });
        return {
            ...budget,
            expenses,
            breakdown,
            remaining: budget.plannedBudget - budget.spent,
        };
    }
    async updateBudget(routeId, userId, plannedBudget) {
        const budget = await database_1.prisma.budgetTracking.update({
            where: {
                routeId_userId: { routeId, userId },
            },
            data: {
                plannedBudget,
            },
        });
        return budget;
    }
    async addExpense(routeId, userId, expense) {
        const budget = await database_1.prisma.budgetTracking.findUnique({
            where: {
                routeId_userId: { routeId, userId },
            },
        });
        if (!budget) {
            throw new error_middleware_1.AppError("Budget not found. Create budget first.", 404);
        }
        const newExpense = {
            ...expense,
            timestamp: new Date(),
        };
        const currentExpenses = budget.expenses || [];
        const updatedExpenses = [...currentExpenses, newExpense];
        const newSpent = budget.spent + expense.amount;
        const updated = await database_1.prisma.budgetTracking.update({
            where: {
                routeId_userId: { routeId, userId },
            },
            data: {
                expenses: updatedExpenses,
                spent: newSpent,
            },
        });
        return {
            ...updated,
            expenses: updatedExpenses,
            remaining: updated.plannedBudget - newSpent,
        };
    }
    async getBudgetStats(routeId, userId) {
        const budget = await this.getBudget(routeId, userId);
        const expenses = budget.expenses;
        const stats = {
            totalPlanned: budget.plannedBudget,
            totalSpent: budget.spent,
            remaining: budget.remaining,
            percentSpent: (budget.spent / budget.plannedBudget) * 100,
            breakdown: budget.breakdown,
            expenseCount: expenses.length,
            averageExpense: expenses.length > 0 ? budget.spent / expenses.length : 0,
            largestExpense: expenses.length > 0 ? Math.max(...expenses.map((e) => e.amount)) : 0,
        };
        return stats;
    }
    async deleteExpense(routeId, userId, expenseIndex) {
        const budget = await database_1.prisma.budgetTracking.findUnique({
            where: {
                routeId_userId: { routeId, userId },
            },
        });
        if (!budget) {
            throw new error_middleware_1.AppError("Budget not found", 404);
        }
        const expenses = budget.expenses;
        if (expenseIndex < 0 || expenseIndex >= expenses.length) {
            throw new error_middleware_1.AppError("Invalid expense index", 400);
        }
        const deletedExpense = expenses[expenseIndex];
        const updatedExpenses = expenses.filter((_, i) => i !== expenseIndex);
        const newSpent = budget.spent - deletedExpense.amount;
        const updated = await database_1.prisma.budgetTracking.update({
            where: {
                routeId_userId: { routeId, userId },
            },
            data: {
                expenses: updatedExpenses,
                spent: newSpent,
            },
        });
        return updated;
    }
}
exports.BudgetService = BudgetService;
//# sourceMappingURL=budget.service.js.map