"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            error: "Validation failed",
            details: errors.array().map((err) => ({
                field: err.type === "field" ? err.path : undefined,
                message: err.msg,
            })),
        });
        return;
    }
    next();
};
exports.validate = validate;
//# sourceMappingURL=validation.middleware.js.map