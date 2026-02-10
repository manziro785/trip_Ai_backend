# Trip Backend

AI-powered travel guide backend for Kyrgyzstan. Generates routes, provides AI chat and recommendations, tracks budgets, serves places, and offers weather-based suggestions.

**Tech Stack**
- Node.js, Express
- TypeScript
- PostgreSQL + Prisma
- Groq SDK (LLM)
- OpenWeather API (weather)
- Cloudinary (media)

**Base URL**
- Local: `http://localhost:5000`
- API root: `/api`

**Auth**
- Protected endpoints require `Authorization: Bearer <JWT>`.

**Endpoints**

Auth (`/api/auth`)
- `POST /register` — Register user
- `POST /login` — Login with email/password
- `POST /google` — Google OAuth login
- `GET /me` — Get current user (auth)

Users (`/api/users`) (auth)
- `GET /profile` — Get profile
- `PUT /profile` — Update profile
- `PUT /preferences` — Update preferences
- `GET /stats` — User stats
- `GET /history` — User interaction history
- `POST /visited` — Mark place as visited
- `GET /wishlist` — Get wishlist
- `POST /wishlist` — Add to wishlist
- `DELETE /wishlist/:placeId` — Remove from wishlist
- `POST /like/:placeId` — Toggle like

Places (`/api/places`)
- `GET /` — List places
- `GET /categories` — List categories
- `GET /nearby` — Nearby places by lat/lng
- `GET /:id` — Place details (optional auth)

Routes (`/api/routes`) (auth)
- `POST /generate` — Generate route
- `GET /` — Get user routes
- `GET /active` — Get active route
- `GET /shared/:token` — Get shared route (optional auth)
- `GET /:id` — Get route by id
- `PUT /:id` — Update route
- `DELETE /:id` — Delete route
- `POST /:id/start` — Start route
- `POST /:id/visit-place` — Mark place visited in route
- `POST /:id/complete` — Complete route
- `POST /:id/share` — Share route
- `POST /:id/rate` — Rate route

AI (`/api/ai`) (auth)
- `POST /chat` — AI chat (can modify route)
- `POST /adapt-route` — Adapt route by condition
- `GET /recommendations` — Personalized recommendations

Weather (`/api/weather`)
- `GET /current` — Current weather by lat/lng
- `GET /forecast` — Forecast by lat/lng (days=1..7)
- `GET /recommendations` — Weather-based tips + current weather

Budget (`/api/budget`) (auth)
- `POST /:routeId` — Create budget for route
- `GET /:routeId` — Get budget
- `PUT /:routeId` — Update budget
- `POST /:routeId/expense` — Add expense
- `GET /:routeId/stats` — Budget stats
- `DELETE /:routeId/expense/:index` — Delete expense

Insights (`/api/insights`)
- `GET /` — List insights
- `GET /random` — Random insight
- `GET /trending` — Trending insights
- `GET /:id` — Insight details
- `POST /:id/helpful` — Mark insight as helpful
- `GET /by-place/:placeId` — Insights for a place

