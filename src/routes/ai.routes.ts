import { Router } from "express";
import { AIController } from "../controllers/ai.controller";
import { authenticate } from "../middleware/auth.middleware";
import { chatMessageValidator } from "../utils/validators";
import { validate } from "../middleware/validation.middleware";
import { body } from "express-validator";

const router = Router();
const aiController = new AIController();

// All AI routes require authentication
router.use(authenticate);

router.post(
  "/chat",
  chatMessageValidator,
  validate,
  aiController.chat.bind(aiController),
);

router.post(
  "/adapt-route",
  [body("routeId").isUUID(), body("condition").trim().notEmpty()],
  validate,
  aiController.adaptRoute.bind(aiController),
);

router.get(
  "/recommendations",
  aiController.getRecommendations.bind(aiController),
);

export default router;
