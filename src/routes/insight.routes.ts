import { Router } from "express";
import { InsightController } from "../controllers/insight.controller";
import { param } from "express-validator";
import { validate } from "../middleware/validation.middleware";

const router = Router();
const insightController = new InsightController();

router.get("/", insightController.getInsights.bind(insightController));
router.get(
  "/random",
  insightController.getRandomInsight.bind(insightController),
);
router.get(
  "/trending",
  insightController.getTrendingInsights.bind(insightController),
);

router.get(
  "/:id",
  [param("id").isUUID()],
  validate,
  insightController.getInsightById.bind(insightController),
);

router.post(
  "/:id/helpful",
  [param("id").isUUID()],
  validate,
  insightController.markHelpful.bind(insightController),
);

router.get(
  "/by-place/:placeId",
  [param("placeId").isUUID()],
  validate,
  insightController.getInsightsByPlace.bind(insightController),
);

export default router;
