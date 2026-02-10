import { body, param, query, ValidationChain } from "express-validator";

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

export const generateRouteValidator: ValidationChain[] = [
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("scheduledDate")
    .trim()
    .notEmpty()
    .isISO8601()
    .withMessage("Valid scheduled date is required"),
  body("scheduledTime")
    .trim()
    .notEmpty()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Valid time format required (HH:MM)"),
  body("endTime")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Valid time format required (HH:MM)"),
  body("timeAvailable")
    .optional()
    .isIn(["2-3 hours", "half-day", "full-day", "weekend"])
    .withMessage("Invalid time option"),
  body("duration")
    .optional()
    .isInt({ min: 30, max: 1440 })
    .withMessage("Duration must be between 30 and 1440 minutes"),
  body("mood")
    .isArray({ min: 1 })
    .withMessage("At least one mood category required"),
  body("budget")
    .isFloat({ min: 0 })
    .withMessage("Budget must be a positive number"),
  body("companions")
    .optional()
    .isIn(["solo", "couple", "family", "friends"])
    .withMessage("Invalid companions option"),
  body("transportation")
    .optional()
    .isIn(["walking", "car", "public"])
    .withMessage("Invalid transportation option"),
  body("mode")
    .isIn(["quick", "detailed"])
    .withMessage("Mode must be quick or detailed"),
  body("mustInclude")
    .optional()
    .isArray()
    .withMessage("mustInclude must be an array"),
  body("exclude").optional().isArray().withMessage("exclude must be an array"),
  body("preferences")
    .optional()
    .isObject()
    .withMessage("preferences must be an object"),
];

export const visitPlaceValidator: ValidationChain[] = [
  body("placeIndex")
    .isInt({ min: 0 })
    .withMessage("Place index must be a positive integer"),
];

export const completeRouteValidator: ValidationChain[] = [
  body("rating")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
];

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

export const addExpenseValidator: ValidationChain[] = [
  body("category")
    .isIn(["food", "transport", "entrance", "other"])
    .withMessage("Invalid category"),
  body("amount").isFloat({ min: 0 }).withMessage("Amount must be positive"),
  body("description").trim().notEmpty().withMessage("Description required"),
  body("placeId").optional().isUUID(),
];

export const chatMessageValidator: ValidationChain[] = [
  body("message").trim().notEmpty().withMessage("Message is required"),
  body("routeId").optional().isUUID(),
  body("context").optional().isObject(),
  body("autoApply").optional().isBoolean(),
];
