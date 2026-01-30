"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_controller_1 = require("../controllers/ai.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validators_1 = require("../utils/validators");
const validation_middleware_1 = require("../middleware/validation.middleware");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const aiController = new ai_controller_1.AIController();
// All AI routes require authentication
router.use(auth_middleware_1.authenticate);
router.post("/chat", validators_1.chatMessageValidator, validation_middleware_1.validate, aiController.chat.bind(aiController));
router.post("/adapt-route", [(0, express_validator_1.body)("routeId").isUUID(), (0, express_validator_1.body)("condition").trim().notEmpty()], validation_middleware_1.validate, aiController.adaptRoute.bind(aiController));
router.get("/recommendations", aiController.getRecommendations.bind(aiController));
exports.default = router;
//# sourceMappingURL=ai.routes.js.map