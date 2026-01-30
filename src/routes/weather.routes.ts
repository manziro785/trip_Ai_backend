import { Router } from "express";
import { WeatherController } from "../controllers/weather.controller";
import { query } from "express-validator";
import { validate } from "../middleware/validation.middleware";

const router = Router();
const weatherController = new WeatherController();

const latLngValidator = [
  query("lat").isFloat({ min: -90, max: 90 }).withMessage("Invalid latitude"),
  query("lng")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude"),
];

router.get(
  "/current",
  latLngValidator,
  validate,
  weatherController.getCurrentWeather.bind(weatherController),
);

router.get(
  "/forecast",
  [...latLngValidator, query("days").optional().isInt({ min: 1, max: 7 })],
  validate,
  weatherController.getForecast.bind(weatherController),
);

router.get(
  "/recommendations",
  latLngValidator,
  validate,
  weatherController.getRecommendations.bind(weatherController),
);

export default router;
