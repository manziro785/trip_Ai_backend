"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_controller_1 = require("../controllers/route.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const express_validator_1 = require("express-validator");
const validation_middleware_1 = require("../middleware/validation.middleware");
const router = (0, express_1.Router)();
const routeController = new route_controller_1.RouteController();
router.post("/generate", auth_middleware_1.authenticate, [
    (0, express_validator_1.body)("location").trim().notEmpty().withMessage("Location is required"),
    (0, express_validator_1.body)("scheduledDate")
        .trim()
        .notEmpty()
        .withMessage("Scheduled date is required"),
    (0, express_validator_1.body)("scheduledTime")
        .trim()
        .notEmpty()
        .withMessage("Scheduled time is required"),
    (0, express_validator_1.body)("mood")
        .isArray({ min: 1 })
        .withMessage("At least one mood category required"),
    (0, express_validator_1.body)("budget").isFloat({ min: 0 }).withMessage("Budget must be positive"),
    (0, express_validator_1.body)("mode")
        .isIn(["quick", "detailed"])
        .withMessage("Mode must be quick or detailed"),
], validation_middleware_1.validate, routeController.generateRoute.bind(routeController));
router.get("/", auth_middleware_1.authenticate, routeController.getUserRoutes.bind(routeController));
router.get("/active", auth_middleware_1.authenticate, routeController.getActiveRoute.bind(routeController));
router.get("/shared/:token", auth_middleware_1.optionalAuth, routeController.getSharedRoute.bind(routeController));
router.get("/:id", auth_middleware_1.authenticate, [(0, express_validator_1.param)("id").isUUID().withMessage("Invalid route ID")], validation_middleware_1.validate, routeController.getRouteById.bind(routeController));
router.put("/:id", auth_middleware_1.authenticate, [(0, express_validator_1.param)("id").isUUID().withMessage("Invalid route ID")], validation_middleware_1.validate, routeController.updateRoute.bind(routeController));
router.delete("/:id", auth_middleware_1.authenticate, [(0, express_validator_1.param)("id").isUUID().withMessage("Invalid route ID")], validation_middleware_1.validate, routeController.deleteRoute.bind(routeController));
router.post("/:id/start", auth_middleware_1.authenticate, [(0, express_validator_1.param)("id").isUUID().withMessage("Invalid route ID")], validation_middleware_1.validate, routeController.startRoute.bind(routeController));
router.post("/:id/visit-place", auth_middleware_1.authenticate, [
    (0, express_validator_1.param)("id").isUUID().withMessage("Invalid route ID"),
    (0, express_validator_1.body)("placeIndex")
        .isInt({ min: 0 })
        .withMessage("Place index must be a positive integer"),
], validation_middleware_1.validate, routeController.visitPlace.bind(routeController));
router.post("/:id/complete", auth_middleware_1.authenticate, [
    (0, express_validator_1.param)("id").isUUID().withMessage("Invalid route ID"),
    (0, express_validator_1.body)("rating")
        .optional()
        .isFloat({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5"),
], validation_middleware_1.validate, routeController.completeRoute.bind(routeController));
router.post("/:id/share", auth_middleware_1.authenticate, [(0, express_validator_1.param)("id").isUUID().withMessage("Invalid route ID")], validation_middleware_1.validate, routeController.shareRoute.bind(routeController));
router.post("/:id/rate", auth_middleware_1.authenticate, [
    (0, express_validator_1.param)("id").isUUID().withMessage("Invalid route ID"),
    (0, express_validator_1.body)("rating")
        .isFloat({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5"),
], validation_middleware_1.validate, routeController.rateRoute.bind(routeController));
exports.default = router;
//# sourceMappingURL=route.routes.js.map