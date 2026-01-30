"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteController = void 0;
const route_service_1 = require("../services/route.service");
const routeService = new route_service_1.RouteService();
class RouteController {
    // POST /api/routes/generate
    async generateRoute(req, res, next) {
        try {
            const params = req.body;
            const userId = req.user.id;
            const route = await routeService.generateRoute(params, userId);
            res.status(201).json({
                success: true,
                data: route,
                message: "Route generated successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
    // GET /api/routes
    async getUserRoutes(req, res, next) {
        try {
            const userId = req.user.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await routeService.getUserRoutes(userId, page, limit);
            res.json({
                success: true,
                data: result.routes,
                pagination: result.pagination,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // GET /api/routes/:id
    async getRouteById(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            const route = await routeService.getRouteById(id, userId);
            res.json({
                success: true,
                data: route,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // PUT /api/routes/:id
    async updateRoute(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const data = req.body;
            const route = await routeService.updateRoute(id, userId, data);
            res.json({
                success: true,
                data: route,
                message: "Route updated successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
    // DELETE /api/routes/:id
    async deleteRoute(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            await routeService.deleteRoute(id, userId);
            res.json({
                success: true,
                message: "Route deleted successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
    // POST /api/routes/:id/share
    async shareRoute(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const result = await routeService.shareRoute(id, userId);
            res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // GET /api/routes/shared/:token
    async getSharedRoute(req, res, next) {
        try {
            const { token } = req.params;
            const route = await routeService.getSharedRoute(token);
            res.json({
                success: true,
                data: route,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // POST /api/routes/:id/rate
    async rateRoute(req, res, next) {
        try {
            const { id } = req.params;
            const { rating } = req.body;
            const userId = req.user.id;
            const route = await routeService.rateRoute(id, userId, rating);
            res.json({
                success: true,
                data: route,
                message: "Route rated successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.RouteController = RouteController;
//# sourceMappingURL=route.controller.js.map