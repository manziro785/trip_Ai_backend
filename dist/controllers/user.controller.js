"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const userService = new user_service_1.UserService();
class UserController {
    // GET /api/users/profile
    async getProfile(req, res, next) {
        try {
            const profile = await userService.getProfile(req.user.id);
            res.json({
                success: true,
                data: profile,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // PUT /api/users/profile
    async updateProfile(req, res, next) {
        try {
            const { name, avatar } = req.body;
            const profile = await userService.updateProfile(req.user.id, {
                name,
                avatar,
            });
            res.json({
                success: true,
                data: profile,
                message: "Profile updated successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
    // PUT /api/users/preferences
    async updatePreferences(req, res, next) {
        try {
            const preferences = req.body;
            const result = await userService.updatePreferences(req.user.id, preferences);
            res.json({
                success: true,
                data: result,
                message: "Preferences updated successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
    // GET /api/users/stats
    async getStats(req, res, next) {
        try {
            const stats = await userService.getUserStats(req.user.id);
            res.json({
                success: true,
                data: stats,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // GET /api/users/history
    async getHistory(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 20;
            const history = await userService.getVisitHistory(req.user.id, limit);
            res.json({
                success: true,
                data: history,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // POST /api/users/visited
    async markVisited(req, res, next) {
        try {
            const { placeId } = req.body;
            await userService.markPlaceVisited(req.user.id, placeId);
            res.json({
                success: true,
                message: "Place marked as visited",
            });
        }
        catch (error) {
            next(error);
        }
    }
    // GET /api/users/wishlist
    async getWishlist(req, res, next) {
        try {
            const wishlist = await userService.getWishlist(req.user.id);
            res.json({
                success: true,
                data: wishlist,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // POST /api/users/wishlist
    async addToWishlist(req, res, next) {
        try {
            const { placeId } = req.body;
            await userService.addToWishlist(req.user.id, placeId);
            res.json({
                success: true,
                message: "Added to wishlist",
            });
        }
        catch (error) {
            next(error);
        }
    }
    // DELETE /api/users/wishlist/:placeId
    async removeFromWishlist(req, res, next) {
        try {
            const { placeId } = req.params;
            await userService.removeFromWishlist(req.user.id, placeId);
            res.json({
                success: true,
                message: "Removed from wishlist",
            });
        }
        catch (error) {
            next(error);
        }
    }
    // POST /api/users/like/:placeId
    async toggleLike(req, res, next) {
        try {
            const { placeId } = req.params;
            const result = await userService.toggleLike(req.user.id, placeId);
            res.json({
                success: true,
                data: result,
                message: result.liked ? "Place liked" : "Like removed",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map