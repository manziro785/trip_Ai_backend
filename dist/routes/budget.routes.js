"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const budget_controller_1 = require("../controllers/budget.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validators_1 = require("../utils/validators");
const validation_middleware_1 = require("../middleware/validation.middleware");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const budgetController = new budget_controller_1.BudgetController();
// All routes require authentication
router.use(auth_middleware_1.authenticate);
router.post("/:routeId", [(0, express_validator_1.param)("routeId").isUUID(), (0, express_validator_1.body)("plannedBudget").isFloat({ min: 0 })], validation_middleware_1.validate, budgetController.createBudget.bind(budgetController));
router.get("/:routeId", [(0, express_validator_1.param)("routeId").isUUID()], validation_middleware_1.validate, budgetController.getBudget.bind(budgetController));
router.put("/:routeId", [(0, express_validator_1.param)("routeId").isUUID(), (0, express_validator_1.body)("plannedBudget").isFloat({ min: 0 })], validation_middleware_1.validate, budgetController.updateBudget.bind(budgetController));
router.post("/:routeId/expense", [(0, express_validator_1.param)("routeId").isUUID(), ...validators_1.addExpenseValidator], validation_middleware_1.validate, budgetController.addExpense.bind(budgetController));
router.get("/:routeId/stats", [(0, express_validator_1.param)("routeId").isUUID()], validation_middleware_1.validate, budgetController.getStats.bind(budgetController));
router.delete("/:routeId/expense/:index", [(0, express_validator_1.param)("routeId").isUUID(), (0, express_validator_1.param)("index").isInt({ min: 0 })], validation_middleware_1.validate, budgetController.deleteExpense.bind(budgetController));
exports.default = router;
//# sourceMappingURL=budget.routes.js.map