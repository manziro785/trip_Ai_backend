import { Router } from "express";
import { BudgetController } from "../controllers/budget.controller";
import { authenticate } from "../middleware/auth.middleware";
import { addExpenseValidator } from "../utils/validators";
import { validate } from "../middleware/validation.middleware";
import { body, param } from "express-validator";

const router = Router();
const budgetController = new BudgetController();

router.use(authenticate);

router.post(
  "/:routeId",
  [param("routeId").isUUID(), body("plannedBudget").isFloat({ min: 0 })],
  validate,
  budgetController.createBudget.bind(budgetController),
);

router.get(
  "/:routeId",
  [param("routeId").isUUID()],
  validate,
  budgetController.getBudget.bind(budgetController),
);

router.put(
  "/:routeId",
  [param("routeId").isUUID(), body("plannedBudget").isFloat({ min: 0 })],
  validate,
  budgetController.updateBudget.bind(budgetController),
);

router.post(
  "/:routeId/expense",
  [param("routeId").isUUID(), ...addExpenseValidator],
  validate,
  budgetController.addExpense.bind(budgetController),
);

router.get(
  "/:routeId/stats",
  [param("routeId").isUUID()],
  validate,
  budgetController.getStats.bind(budgetController),
);

router.delete(
  "/:routeId/expense/:index",
  [param("routeId").isUUID(), param("index").isInt({ min: 0 })],
  validate,
  budgetController.deleteExpense.bind(budgetController),
);

export default router;
