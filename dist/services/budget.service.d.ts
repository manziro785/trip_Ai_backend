import { BudgetExpense } from "../types";
export declare class BudgetService {
    createBudget(routeId: string, userId: string, plannedBudget: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        routeId: string;
        userId: string;
        plannedBudget: number;
        spent: number;
        expenses: import("@prisma/client/runtime/library").JsonValue;
    }>;
    getBudget(routeId: string, userId: string): Promise<{
        expenses: BudgetExpense[];
        breakdown: {
            food: number;
            transport: number;
            entrance: number;
            other: number;
        };
        remaining: number;
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        routeId: string;
        userId: string;
        plannedBudget: number;
        spent: number;
    }>;
    updateBudget(routeId: string, userId: string, plannedBudget: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        routeId: string;
        userId: string;
        plannedBudget: number;
        spent: number;
        expenses: import("@prisma/client/runtime/library").JsonValue;
    }>;
    addExpense(routeId: string, userId: string, expense: Omit<BudgetExpense, "timestamp">): Promise<{
        expenses: BudgetExpense[];
        remaining: number;
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        routeId: string;
        userId: string;
        plannedBudget: number;
        spent: number;
    }>;
    getBudgetStats(routeId: string, userId: string): Promise<{
        totalPlanned: number;
        totalSpent: number;
        remaining: number;
        percentSpent: number;
        breakdown: {
            food: number;
            transport: number;
            entrance: number;
            other: number;
        };
        expenseCount: number;
        averageExpense: number;
        largestExpense: number;
    }>;
    deleteExpense(routeId: string, userId: string, expenseIndex: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        routeId: string;
        userId: string;
        plannedBudget: number;
        spent: number;
        expenses: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
//# sourceMappingURL=budget.service.d.ts.map