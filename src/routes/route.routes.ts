import { Router } from "express";
import { RouteController } from "../controllers/route.controller";
import { authenticate, optionalAuth } from "../middleware/auth.middleware";
import { body, param } from "express-validator";
import { validate } from "../middleware/validation.middleware";

const router = Router();
const routeController = new RouteController();

router.post(
  "/generate",
  authenticate,
  [
    body("location").trim().notEmpty().withMessage("Location is required"),
    body("scheduledDate")
      .trim()
      .notEmpty()
      .withMessage("Scheduled date is required"),
    body("scheduledTime")
      .trim()
      .notEmpty()
      .withMessage("Scheduled time is required"),
    body("mood")
      .isArray({ min: 1 })
      .withMessage("At least one mood category required"),
    body("budget").isFloat({ min: 0 }).withMessage("Budget must be positive"),
    body("mode")
      .isIn(["quick", "detailed"])
      .withMessage("Mode must be quick or detailed"),
  ],
  validate,
  routeController.generateRoute.bind(routeController),
);

router.get(
  "/",
  authenticate,
  routeController.getUserRoutes.bind(routeController),
);

router.get(
  "/active",
  authenticate,
  routeController.getActiveRoute.bind(routeController),
);

router.get(
  "/shared/:token",
  optionalAuth,
  routeController.getSharedRoute.bind(routeController),
);

router.get(
  "/:id",
  authenticate,
  [param("id").isUUID().withMessage("Invalid route ID")],
  validate,
  routeController.getRouteById.bind(routeController),
);

router.put(
  "/:id",
  authenticate,
  [param("id").isUUID().withMessage("Invalid route ID")],
  validate,
  routeController.updateRoute.bind(routeController),
);

router.delete(
  "/:id",
  authenticate,
  [param("id").isUUID().withMessage("Invalid route ID")],
  validate,
  routeController.deleteRoute.bind(routeController),
);


router.post(
  "/:id/start",
  authenticate,
  [param("id").isUUID().withMessage("Invalid route ID")],
  validate,
  routeController.startRoute.bind(routeController),
);

router.post(
  "/:id/visit-place",
  authenticate,
  [
    param("id").isUUID().withMessage("Invalid route ID"),
    body("placeIndex")
      .isInt({ min: 0 })
      .withMessage("Place index must be a positive integer"),
  ],
  validate,
  routeController.visitPlace.bind(routeController),
);

router.post(
  "/:id/complete",
  authenticate,
  [
    param("id").isUUID().withMessage("Invalid route ID"),
    body("rating")
      .optional()
      .isFloat({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
  ],
  validate,
  routeController.completeRoute.bind(routeController),
);

router.post(
  "/:id/share",
  authenticate,
  [param("id").isUUID().withMessage("Invalid route ID")],
  validate,
  routeController.shareRoute.bind(routeController),
);

router.post(
  "/:id/rate",
  authenticate,
  [
    param("id").isUUID().withMessage("Invalid route ID"),
    body("rating")
      .isFloat({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
  ],
  validate,
  routeController.rateRoute.bind(routeController),
);

export default router;
