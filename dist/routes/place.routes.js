"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const place_controller_1 = require("../controllers/place.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validators_1 = require("../utils/validators");
const validation_middleware_1 = require("../middleware/validation.middleware");
const router = (0, express_1.Router)();
const placeController = new place_controller_1.PlaceController();
// Public routes (with optional auth for user-specific data)
router.get("/", placeController.getPlaces.bind(placeController));
router.get("/categories", placeController.getCategories.bind(placeController));
router.get("/nearby", validators_1.nearbyPlacesValidator, validation_middleware_1.validate, placeController.getNearbyPlaces.bind(placeController));
router.get("/:id", validators_1.placeIdValidator, validation_middleware_1.validate, auth_middleware_1.optionalAuth, placeController.getPlaceById.bind(placeController));
exports.default = router;
//# sourceMappingURL=place.routes.js.map