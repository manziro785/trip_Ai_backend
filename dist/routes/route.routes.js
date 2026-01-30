"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_controller_1 = require("../controllers/route.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const routeController = new route_controller_1.RouteController();
// Generate new route
router.post("/generate", auth_middleware_1.authenticate, routeController.generateRoute.bind(routeController));
// Get user routes
router.get("/", auth_middleware_1.authenticate, routeController.getUserRoutes.bind(routeController));
// Get shared route (публичный доступ)
router.get("/shared/:token", routeController.getSharedRoute.bind(routeController));
// Get route by ID
router.get("/:id", auth_middleware_1.authenticate, routeController.getRouteById.bind(routeController));
// Update route
router.put("/:id", auth_middleware_1.authenticate, routeController.updateRoute.bind(routeController));
// Delete route
router.delete("/:id", auth_middleware_1.authenticate, routeController.deleteRoute.bind(routeController));
// Share route
router.post("/:id/share", auth_middleware_1.authenticate, routeController.shareRoute.bind(routeController));
// Rate route
router.post("/:id/rate", auth_middleware_1.authenticate, routeController.rateRoute.bind(routeController));
exports.default = router;
//# sourceMappingURL=route.routes.js.map