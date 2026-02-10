import { prisma } from "../config/database";
import { AppError } from "../middleware/error.middleware";
import { BudgetExpense } from "../types";

export class BudgetService {
  async createBudget(routeId: string, userId: string, plannedBudget: number) {
    const route = await prisma.route.findUnique({
      where: { id: routeId },
    });

    if (!route) {
      throw new AppError("Route not found", 404);
    }

    if (route.userId !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    const budget = await prisma.budgetTracking.create({
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

  async getBudget(routeId: string, userId: string) {
    const budget = await prisma.budgetTracking.findUnique({
      where: {
        routeId_userId: { routeId, userId },
      },
    });

    if (!budget) {
      throw new AppError("Budget not found", 404);
    }

    const expenses = budget.expenses as unknown as BudgetExpense[];

    const breakdown = {
      food: 0,
      transport: 0,
      entrance: 0,
      other: 0,
    };

    expenses.forEach((expense: BudgetExpense) => {
      breakdown[expense.category] += expense.amount;
    });

    return {
      ...budget,
      expenses,
      breakdown,
      remaining: budget.plannedBudget - budget.spent,
    };
  }

  async updateBudget(routeId: string, userId: string, plannedBudget: number) {
    const budget = await prisma.budgetTracking.update({
      where: {
        routeId_userId: { routeId, userId },
      },
      data: {
        plannedBudget,
      },
    });

    return budget;
  }

  async addExpense(
    routeId: string,
    userId: string,
    expense: Omit<BudgetExpense, "timestamp">,
  ) {
    const budget = await prisma.budgetTracking.findUnique({
      where: {
        routeId_userId: { routeId, userId },
      },
    });

    if (!budget) {
      throw new AppError("Budget not found. Create budget first.", 404);
    }

    const newExpense: BudgetExpense = {
      ...expense,
      timestamp: new Date(),
    };

    const currentExpenses =
      (budget.expenses as unknown as BudgetExpense[]) || [];
    const updatedExpenses = [...currentExpenses, newExpense];
    const newSpent = budget.spent + expense.amount;

    const updated = await prisma.budgetTracking.update({
      where: {
        routeId_userId: { routeId, userId },
      },
      data: {
        expenses: updatedExpenses as any,
        spent: newSpent,
      },
    });

    return {
      ...updated,
      expenses: updatedExpenses,
      remaining: updated.plannedBudget - newSpent,
    };
  }

  async getBudgetStats(routeId: string, userId: string) {
    const budget = await this.getBudget(routeId, userId);
    const expenses = budget.expenses as BudgetExpense[];

    const stats = {
      totalPlanned: budget.plannedBudget,
      totalSpent: budget.spent,
      remaining: budget.remaining,
      percentSpent: (budget.spent / budget.plannedBudget) * 100,
      breakdown: budget.breakdown,
      expenseCount: expenses.length,
      averageExpense: expenses.length > 0 ? budget.spent / expenses.length : 0,
      largestExpense:
        expenses.length > 0 ? Math.max(...expenses.map((e) => e.amount)) : 0,
    };

    return stats;
  }

  async deleteExpense(routeId: string, userId: string, expenseIndex: number) {
    const budget = await prisma.budgetTracking.findUnique({
      where: {
        routeId_userId: { routeId, userId },
      },
    });

    if (!budget) {
      throw new AppError("Budget not found", 404);
    }

    const expenses = budget.expenses as unknown as BudgetExpense[];
    if (expenseIndex < 0 || expenseIndex >= expenses.length) {
      throw new AppError("Invalid expense index", 400);
    }

    const deletedExpense = expenses[expenseIndex];
    const updatedExpenses = expenses.filter((_, i) => i !== expenseIndex);
    const newSpent = budget.spent - deletedExpense.amount;

    const updated = await prisma.budgetTracking.update({
      where: {
        routeId_userId: { routeId, userId },
      },
      data: {
        expenses: updatedExpenses as any,
        spent: newSpent,
      },
    });

    return updated;
  }
}
