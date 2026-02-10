"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const authService = new auth_service_1.AuthService();
class AuthController {
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
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const { token } = await authService.login(email, password);
            res.json({
                token,
            });
        }
        catch (error) {
            next(error);
        }
    }
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
    async getCurrentUser(req, res, next) {
        try {
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