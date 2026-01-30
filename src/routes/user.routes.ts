import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { body } from "express-validator";
import { validate } from "../middleware/validation.middleware";

const router = Router();
const userController = new UserController();

// All routes require authentication
router.use(authenticate);

// Profile
router.get("/profile", userController.getProfile.bind(userController));
router.put(
  "/profile",
  [body("name").optional().trim(), body("avatar").optional().isURL()],
  validate,
  userController.updateProfile.bind(userController),
);

// Preferences
router.put(
  "/preferences",
  userController.updatePreferences.bind(userController),
);

// Stats
router.get("/stats", userController.getStats.bind(userController));

// History
router.get("/history", userController.getHistory.bind(userController));

// Visited
router.post(
  "/visited",
  [body("placeId").isUUID()],
  validate,
  userController.markVisited.bind(userController),
);

// Wishlist
router.get("/wishlist", userController.getWishlist.bind(userController));
router.post(
  "/wishlist",
  [body("placeId").isUUID()],
  validate,
  userController.addToWishlist.bind(userController),
);
router.delete(
  "/wishlist/:placeId",
  userController.removeFromWishlist.bind(userController),
);

// Like
router.post("/like/:placeId", userController.toggleLike.bind(userController));

export default router;
