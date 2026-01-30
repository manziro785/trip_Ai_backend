import { body, param, query, ValidationChain } from "express-validator";

// Auth Validators
export const registerValidator: ValidationChain[] = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("name").optional().trim().isLength({ min: 2 }),
];

export const loginValidator: ValidationChain[] = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Route Generation Validators
export const generateRouteValidator: ValidationChain[] = [
  body("timeAvailable")
    .isIn(["2-3 hours", "half-day", "full-day", "weekend"])
    .withMessage("Invalid time option"),
  body("mood")
    .isArray({ min: 1 })
    .withMessage("At least one mood category required"),
  body("budget")
    .isIn(["low", "medium", "high", "unlimited"])
    .withMessage("Invalid budget option"),
  body("location").optional().trim(),
  body("companions").optional().isIn(["solo", "couple", "family", "friends"]),
  body("transportation").optional().isIn(["walking", "car", "public"]),
];

// Place Validators
export const placeIdValidator: ValidationChain[] = [
  param("id").isUUID().withMessage("Invalid place ID"),
];

export const nearbyPlacesValidator: ValidationChain[] = [
  query("lat").isFloat().withMessage("Invalid latitude"),
  query("lng").isFloat().withMessage("Invalid longitude"),
  query("radius")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Radius must be 1-50 km"),
];

// Budget Validators
export const addExpenseValidator: ValidationChain[] = [
  body("category")
    .isIn(["food", "transport", "entrance", "other"])
    .withMessage("Invalid category"),
  body("amount").isFloat({ min: 0 }).withMessage("Amount must be positive"),
  body("description").trim().notEmpty().withMessage("Description required"),
  body("placeId").optional().isUUID(),
];

// Chat Validators
export const chatMessageValidator: ValidationChain[] = [
  body("message").trim().notEmpty().withMessage("Message is required"),
  body("routeId").optional().isUUID(),
  body("context").optional().isObject(),
];
