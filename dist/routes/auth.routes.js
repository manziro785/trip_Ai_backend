"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validators_1 = require("../utils/validators");
const validation_middleware_1 = require("../middleware/validation.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
// Public routes
router.post("/register", validators_1.registerValidator, validation_middleware_1.validate, authController.register.bind(authController));
router.post("/login", validators_1.loginValidator, validation_middleware_1.validate, authController.login.bind(authController));
router.post("/google", authController.googleAuth.bind(authController));
// Protected routes
router.get("/me", auth_middleware_1.authenticate, authController.getCurrentUser.bind(authController));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map