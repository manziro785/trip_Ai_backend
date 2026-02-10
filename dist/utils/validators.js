"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatMessageValidator = exports.addExpenseValidator = exports.nearbyPlacesValidator = exports.placeIdValidator = exports.completeRouteValidator = exports.visitPlaceValidator = exports.generateRouteValidator = exports.loginValidator = exports.registerValidator = void 0;
const express_validator_1 = require("express-validator");
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
exports.generateRouteValidator = [
    (0, express_validator_1.body)("location").trim().notEmpty().withMessage("Location is required"),
    (0, express_validator_1.body)("scheduledDate")
        .trim()
        .notEmpty()
        .isISO8601()
        .withMessage("Valid scheduled date is required"),
    (0, express_validator_1.body)("scheduledTime")
        .trim()
        .notEmpty()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("Valid time format required (HH:MM)"),
    (0, express_validator_1.body)("endTime")
        .optional()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("Valid time format required (HH:MM)"),
    (0, express_validator_1.body)("timeAvailable")
        .optional()
        .isIn(["2-3 hours", "half-day", "full-day", "weekend"])
        .withMessage("Invalid time option"),
    (0, express_validator_1.body)("duration")
        .optional()
        .isInt({ min: 30, max: 1440 })
        .withMessage("Duration must be between 30 and 1440 minutes"),
    (0, express_validator_1.body)("mood")
        .isArray({ min: 1 })
        .withMessage("At least one mood category required"),
    (0, express_validator_1.body)("budget")
        .isFloat({ min: 0 })
        .withMessage("Budget must be a positive number"),
    (0, express_validator_1.body)("companions")
        .optional()
        .isIn(["solo", "couple", "family", "friends"])
        .withMessage("Invalid companions option"),
    (0, express_validator_1.body)("transportation")
        .optional()
        .isIn(["walking", "car", "public"])
        .withMessage("Invalid transportation option"),
    (0, express_validator_1.body)("mode")
        .isIn(["quick", "detailed"])
        .withMessage("Mode must be quick or detailed"),
    (0, express_validator_1.body)("mustInclude")
        .optional()
        .isArray()
        .withMessage("mustInclude must be an array"),
    (0, express_validator_1.body)("exclude").optional().isArray().withMessage("exclude must be an array"),
    (0, express_validator_1.body)("preferences")
        .optional()
        .isObject()
        .withMessage("preferences must be an object"),
];
exports.visitPlaceValidator = [
    (0, express_validator_1.body)("placeIndex")
        .isInt({ min: 0 })
        .withMessage("Place index must be a positive integer"),
];
exports.completeRouteValidator = [
    (0, express_validator_1.body)("rating")
        .optional()
        .isFloat({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5"),
];
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
exports.addExpenseValidator = [
    (0, express_validator_1.body)("category")
        .isIn(["food", "transport", "entrance", "other"])
        .withMessage("Invalid category"),
    (0, express_validator_1.body)("amount").isFloat({ min: 0 }).withMessage("Amount must be positive"),
    (0, express_validator_1.body)("description").trim().notEmpty().withMessage("Description required"),
    (0, express_validator_1.body)("placeId").optional().isUUID(),
];
exports.chatMessageValidator = [
    (0, express_validator_1.body)("message").trim().notEmpty().withMessage("Message is required"),
    (0, express_validator_1.body)("routeId").optional().isUUID(),
    (0, express_validator_1.body)("context").optional().isObject(),
    (0, express_validator_1.body)("autoApply").optional().isBoolean(),
];
//# sourceMappingURL=validators.js.map