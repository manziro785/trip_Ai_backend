"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const express_validator_1 = require("express-validator");
const validation_middleware_1 = require("../middleware/validation.middleware");
const router = (0, express_1.Router)();
const userController = new user_controller_1.UserController();
// All routes require authentication
router.use(auth_middleware_1.authenticate);
// Profile
router.get("/profile", userController.getProfile.bind(userController));
router.put("/profile", [(0, express_validator_1.body)("name").optional().trim(), (0, express_validator_1.body)("avatar").optional().isURL()], validation_middleware_1.validate, userController.updateProfile.bind(userController));
// Preferences
router.put("/preferences", userController.updatePreferences.bind(userController));
// Stats
router.get("/stats", userController.getStats.bind(userController));
// History
router.get("/history", userController.getHistory.bind(userController));
// Visited
router.post("/visited", [(0, express_validator_1.body)("placeId").isUUID()], validation_middleware_1.validate, userController.markVisited.bind(userController));
// Wishlist
router.get("/wishlist", userController.getWishlist.bind(userController));
router.post("/wishlist", [(0, express_validator_1.body)("placeId").isUUID()], validation_middleware_1.validate, userController.addToWishlist.bind(userController));
router.delete("/wishlist/:placeId", userController.removeFromWishlist.bind(userController));
// Like
router.post("/like/:placeId", userController.toggleLike.bind(userController));
exports.default = router;
//# sourceMappingURL=user.routes.js.map