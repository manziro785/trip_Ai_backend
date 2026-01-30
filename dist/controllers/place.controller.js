"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceController = void 0;
const place_service_1 = require("../services/place.service");
const placeService = new place_service_1.PlaceService();
class PlaceController {
    // GET /api/places
    async getPlaces(req, res, next) {
        try {
            const { categoryId, search, page, limit } = req.query;
            const result = await placeService.getPlaces({
                categoryId: categoryId,
                search: search,
                page: page ? parseInt(page) : undefined,
                limit: limit ? parseInt(limit) : undefined,
            });
            res.json({
                success: true,
                data: result.places,
                pagination: result.pagination,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // GET /api/places/:id
    async getPlaceById(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            const place = await placeService.getPlaceById(id, userId);
            res.json({
                success: true,
                data: place,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // GET /api/places/nearby
    async getNearbyPlaces(req, res, next) {
        try {
            const { lat, lng, radius } = req.query;
            const places = await placeService.getNearbyPlaces(parseFloat(lat), parseFloat(lng), radius ? parseFloat(radius) : undefined);
            res.json({
                success: true,
                data: places,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // GET /api/places/categories
    async getCategories(_req, res, next) {
        try {
            const categories = await placeService.getCategories();
            res.json({
                success: true,
                data: categories,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PlaceController = PlaceController;
//# sourceMappingURL=place.controller.js.map