"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                error: "No token provided",
            });
            return;
        }
        const token = authHeader.substring(7); // Remove 'Bearer '
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            error: "Invalid or expired token",
        });
    }
};
exports.authenticate = authenticate;
const optionalAuth = (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.substring(7);
            const decoded = (0, jwt_1.verifyToken)(token);
            req.user = decoded;
        }
        next();
    }
    catch (error) {
        // If token is invalid, just continue without user
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.middleware.js.map