import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { registerValidator, loginValidator } from "../utils/validators";
import { validate } from "../middleware/validation.middleware";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
const authController = new AuthController();

// Public routes
router.post(
  "/register",
  registerValidator,
  validate,
  authController.register.bind(authController),
);
router.post(
  "/login",
  loginValidator,
  validate,
  authController.login.bind(authController),
);
router.post("/google", authController.googleAuth.bind(authController));

// Protected routes
router.get(
  "/me",
  authenticate,
  authController.getCurrentUser.bind(authController),
);

export default router;
