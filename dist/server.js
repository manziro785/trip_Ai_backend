"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const error_middleware_1 = require("./middleware/error.middleware");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const place_routes_1 = __importDefault(require("./routes/place.routes"));
const route_routes_1 = __importDefault(require("./routes/route.routes"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const weather_routes_1 = __importDefault(require("./routes/weather.routes"));
const budget_routes_1 = __importDefault(require("./routes/budget.routes"));
const insight_routes_1 = __importDefault(require("./routes/insight.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: env_1.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use((0, morgan_1.default)(env_1.env.NODE_ENV === "development" ? "dev" : "combined"));
app.get("/health", (_req, res) => {
    res.json({
        success: true,
        message: "Nomad AI Backend is running",
        timestamp: new Date().toISOString(),
        environment: env_1.env.NODE_ENV,
    });
});
app.get("/api", (_req, res) => {
    res.json({
        success: true,
        message: "Nomad AI API",
        version: "1.0.0",
        endpoints: {
            auth: "/api/auth",
            users: "/api/users",
            places: "/api/places",
            routes: "/api/routes",
            ai: "/api/ai",
            weather: "/api/weather",
            budget: "/api/budget",
            insights: "/api/insights",
        },
    });
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/places", place_routes_1.default);
app.use("/api/routes", route_routes_1.default);
app.use("/api/ai", ai_routes_1.default);
app.use("/api/weather", weather_routes_1.default);
app.use("/api/budget", budget_routes_1.default);
app.use("/api/insights", insight_routes_1.default);
app.use(error_middleware_1.notFound);
app.use(error_middleware_1.errorHandler);
const startServer = async () => {
    try {
        await (0, database_1.connectDatabase)();
        app.listen(env_1.env.PORT, () => {
            console.log(`
╔═══════════════════════════════════════╗
║     🏔️  NOMAD AI BACKEND STARTED     ║
╠═══════════════════════════════════════╣
║  Environment: ${env_1.env.NODE_ENV.padEnd(23)} ║
║  Port: ${env_1.env.PORT.toString().padEnd(30)} ║
║  Database: Connected ✅               ║
║  API Docs: http://localhost:${env_1.env.PORT}/api ║
╚═══════════════════════════════════════╝

📍 Available endpoints:
   - /api/auth      → Authentication
   - /api/users     → User management
   - /api/places    → Places & categories
   - /api/routes    → Route generation
   - /api/ai        → AI chat & recommendations
   - /api/weather   → Weather data
   - /api/budget    → Budget tracking
   - /api/insights  → Local insights
      `);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};
process.on("unhandledRejection", (err) => {
    console.error("❌ Unhandled Rejection:", err);
    process.exit(1);
});
process.on("SIGTERM", () => {
    console.log("👋 SIGTERM received, shutting down gracefully...");
    process.exit(0);
});
startServer();
exports.default = app;
//# sourceMappingURL=server.js.map