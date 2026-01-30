import { Router } from "express";
import { RouteController } from "../controllers/route.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
const routeController = new RouteController();

// Generate new route
router.post(
  "/generate",
  authenticate,
  routeController.generateRoute.bind(routeController),
);

// Get user routes
router.get(
  "/",
  authenticate,
  routeController.getUserRoutes.bind(routeController),
);

// Get shared route (публичный доступ)
router.get(
  "/shared/:token",
  routeController.getSharedRoute.bind(routeController),
);

// Get route by ID
router.get(
  "/:id",
  authenticate,
  routeController.getRouteById.bind(routeController),
);

// Update route
router.put(
  "/:id",
  authenticate,
  routeController.updateRoute.bind(routeController),
);

// Delete route
router.delete(
  "/:id",
  authenticate,
  routeController.deleteRoute.bind(routeController),
);

// Share route
router.post(
  "/:id/share",
  authenticate,
  routeController.shareRoute.bind(routeController),
);

// Rate route
router.post(
  "/:id/rate",
  authenticate,
  routeController.rateRoute.bind(routeController),
);

export default router;
