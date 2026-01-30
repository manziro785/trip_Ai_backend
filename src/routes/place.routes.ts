import { Router } from "express";
import { PlaceController } from "../controllers/place.controller";
import { optionalAuth } from "../middleware/auth.middleware";
import { nearbyPlacesValidator, placeIdValidator } from "../utils/validators";
import { validate } from "../middleware/validation.middleware";

const router = Router();
const placeController = new PlaceController();

// Public routes (with optional auth for user-specific data)
router.get("/", placeController.getPlaces.bind(placeController));
router.get("/categories", placeController.getCategories.bind(placeController));
router.get(
  "/nearby",
  nearbyPlacesValidator,
  validate,
  placeController.getNearbyPlaces.bind(placeController),
);
router.get(
  "/:id",
  placeIdValidator,
  validate,
  optionalAuth,
  placeController.getPlaceById.bind(placeController),
);

export default router;
