import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import { errorHandler, notFound } from "./middleware/error.middleware";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import placeRoutes from "./routes/place.routes";
import routeRoutes from "./routes/route.routes";
import aiRoutes from "./routes/ai.routes";
import weatherRoutes from "./routes/weather.routes";
import budgetRoutes from "./routes/budget.routes";
import insightRoutes from "./routes/insight.routes";

const app: Application = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Nomad AI Backend is running",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
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

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/insights", insightRoutes);

app.use(notFound);

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      console.log(`
╔═══════════════════════════════════════╗
║     🏔️  NOMAD AI BACKEND STARTED     ║
╠═══════════════════════════════════════╣
║  Environment: ${env.NODE_ENV.padEnd(23)} ║
║  Port: ${env.PORT.toString().padEnd(30)} ║
║  Database: Connected ✅               ║
║  API Docs: http://localhost:${env.PORT}/api ║
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
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

process.on("unhandledRejection", (err: Error) => {
  console.error("❌ Unhandled Rejection:", err);
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received, shutting down gracefully...");
  process.exit(0);
});

startServer();

export default app;
