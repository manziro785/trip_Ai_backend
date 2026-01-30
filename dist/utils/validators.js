"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatMessageValidator = exports.addExpenseValidator = exports.nearbyPlacesValidator = exports.placeIdValidator = exports.generateRouteValidator = exports.loginValidator = exports.registerValidator = void 0;
const express_validator_1 = require("express-validator");
// Auth Validators
exports.registerValidator = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email address"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    (0, express_validator_1.body)("name").optional().trim().isLength({ min: 2 }),
];
exports.loginValidator = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email address"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
];
// Route Generation Validators
exports.generateRouteValidator = [
    (0, express_validator_1.body)("timeAvailable")
        .isIn(["2-3 hours", "half-day", "full-day", "weekend"])
        .withMessage("Invalid time option"),
    (0, express_validator_1.body)("mood")
        .isArray({ min: 1 })
        .withMessage("At least one mood category required"),
    (0, express_validator_1.body)("budget")
        .isIn(["low", "medium", "high", "unlimited"])
        .withMessage("Invalid budget option"),
    (0, express_validator_1.body)("location").optional().trim(),
    (0, express_validator_1.body)("companions").optional().isIn(["solo", "couple", "family", "friends"]),
    (0, express_validator_1.body)("transportation").optional().isIn(["walking", "car", "public"]),
];
// Place Validators
exports.placeIdValidator = [
    (0, express_validator_1.param)("id").isUUID().withMessage("Invalid place ID"),
];
exports.nearbyPlacesValidator = [
    (0, express_validator_1.query)("lat").isFloat().withMessage("Invalid latitude"),
    (0, express_validator_1.query)("lng").isFloat().withMessage("Invalid longitude"),
    (0, express_validator_1.query)("radius")
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage("Radius must be 1-50 km"),
];
// Budget Validators
exports.addExpenseValidator = [
    (0, express_validator_1.body)("category")
        .isIn(["food", "transport", "entrance", "other"])
        .withMessage("Invalid category"),
    (0, express_validator_1.body)("amount").isFloat({ min: 0 }).withMessage("Amount must be positive"),
    (0, express_validator_1.body)("description").trim().notEmpty().withMessage("Description required"),
    (0, express_validator_1.body)("placeId").optional().isUUID(),
];
// Chat Validators
exports.chatMessageValidator = [
    (0, express_validator_1.body)("message").trim().notEmpty().withMessage("Message is required"),
    (0, express_validator_1.body)("routeId").optional().isUUID(),
    (0, express_validator_1.body)("context").optional().isObject(),
];
//# sourceMappingURL=validators.js.map