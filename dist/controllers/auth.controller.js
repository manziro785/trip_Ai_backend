"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const authService = new auth_service_1.AuthService();
class AuthController {
    // POST /api/auth/register
    async register(req, res, next) {
        try {
            const { email, password, name } = req.body;
            const result = await authService.register(email, password, name);
            res.status(201).json({
                success: true,
                data: result,
                message: "User registered successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
    // POST /api/auth/login
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            res.json({
                success: true,
                data: result,
                message: "Login successful",
            });
        }
        catch (error) {
            next(error);
        }
    }
    // POST /api/auth/google
    async googleAuth(req, res, next) {
        try {
            const { googleId, email, name, avatar } = req.body;
            const result = await authService.googleAuth(googleId, email, name, avatar);
            res.json({
                success: true,
                data: result,
                message: "Google authentication successful",
            });
        }
        catch (error) {
            next(error);
        }
    }
    // GET /api/auth/me
    async getCurrentUser(req, res, next) {
        try {
            // User is already attached by auth middleware
            res.json({
                success: true,
                data: req.user,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map