"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const insight_controller_1 = require("../controllers/insight.controller");
const express_validator_1 = require("express-validator");
const validation_middleware_1 = require("../middleware/validation.middleware");
const router = (0, express_1.Router)();
const insightController = new insight_controller_1.InsightController();
router.get("/", insightController.getInsights.bind(insightController));
router.get("/random", insightController.getRandomInsight.bind(insightController));
router.get("/trending", insightController.getTrendingInsights.bind(insightController));
router.get("/:id", [(0, express_validator_1.param)("id").isUUID()], validation_middleware_1.validate, insightController.getInsightById.bind(insightController));
router.post("/:id/helpful", [(0, express_validator_1.param)("id").isUUID()], validation_middleware_1.validate, insightController.markHelpful.bind(insightController));
router.get("/by-place/:placeId", [(0, express_validator_1.param)("placeId").isUUID()], validation_middleware_1.validate, insightController.getInsightsByPlace.bind(insightController));
exports.default = router;
//# sourceMappingURL=insight.routes.js.map