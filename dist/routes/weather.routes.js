"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const weather_controller_1 = require("../controllers/weather.controller");
const express_validator_1 = require("express-validator");
const validation_middleware_1 = require("../middleware/validation.middleware");
const router = (0, express_1.Router)();
const weatherController = new weather_controller_1.WeatherController();
const latLngValidator = [
    (0, express_validator_1.query)("lat").isFloat({ min: -90, max: 90 }).withMessage("Invalid latitude"),
    (0, express_validator_1.query)("lng")
        .isFloat({ min: -180, max: 180 })
        .withMessage("Invalid longitude"),
];
router.get("/current", latLngValidator, validation_middleware_1.validate, weatherController.getCurrentWeather.bind(weatherController));
router.get("/forecast", [...latLngValidator, (0, express_validator_1.query)("days").optional().isInt({ min: 1, max: 7 })], validation_middleware_1.validate, weatherController.getForecast.bind(weatherController));
router.get("/recommendations", latLngValidator, validation_middleware_1.validate, weatherController.getRecommendations.bind(weatherController));
exports.default = router;
//# sourceMappingURL=weather.routes.js.map