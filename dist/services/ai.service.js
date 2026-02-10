"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const env_1 = require("../config/env");
const database_1 = require("../config/database");
class AIService {
    constructor() {
        this.groq = new groq_sdk_1.default({
            apiKey: env_1.env.GROQ_API_KEY,
        });
    }
    async generateRoute(params, userId) {
        const places = await database_1.prisma.place.findMany({
            include: {
                category: true,
            },
        });
        let userPreferences = {};
        if (userId) {
            const user = await database_1.prisma.user.findUnique({
                where: { id: userId },
                select: { preferences: true },
            });
            userPreferences = user?.preferences || {};
            const visitedPlaces = await database_1.prisma.userPlaceInteraction.findMany({
                where: { userId, visited: true },
                select: { placeId: true },
            });
            userPreferences.visitedPlaceIds = visitedPlaces.map((v) => v.placeId);
        }
        const prompt = this.createRoutePrompt(params, places, userPreferences);
        const completion = await this.groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are an expert travel guide for Kyrgyzstan. Create personalized travel routes based on user preferences. 
          Always respond with valid JSON only, no additional text.
          
          IMPORTANT RULES:
          1. All places must be actually open at the specified times
          2. Calculate realistic walking/transport times between places
          3. Stay within the budget
          4. For "quick" mode: be creative but follow mood preferences
          5. For "detailed" mode: MUST include all items from mustInclude array
          6. Never include items from exclude array
          7. Consider time of day for activities (e.g., restaurants open hours)
          8. Add practical tips and photo spots where relevant`,
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            response_format: { type: "json_object" },
        });
        const responseText = completion.choices[0].message.content;
        if (!responseText) {
            throw new Error("AI response is empty");
        }
        const routeData = JSON.parse(responseText);
        return routeData;
    }
    async chat(message, context, autoApply = false) {
        const systemMessage = `You are Nomad AI, a helpful travel assistant for Kyrgyzstan.

IMPORTANT ABILITIES:
- You can MODIFY routes based on user requests
- If user wants to change their route, respond with JSON action
- You understand natural language route modifications

ROUTE MODIFICATION EXAMPLES:
User: "Убери кафе из маршрута"
→ Action: Remove all places with category "food"

User: "Хочу только достопримечательности"
→ Action: Keep only "history" category places

User: "Добавь еще одно место для обеда"
→ Action: Add a restaurant

When user wants to modify route, respond with:
{
  "action": "modify_route",
  "explanation": "Removed all cafes, kept only attractions",
  "modifications": {
    "remove": ["place-id-1"],
    "add": [...],
    "filter": { "categories": ["history", "nature"] }
  }
}

For simple questions, just respond with text.`;
        const messages = [{ role: "system", content: systemMessage }];
        if (context?.currentRoute) {
            messages.push({
                role: "system",
                content: `Current route: ${JSON.stringify(context.currentRoute)}`,
            });
        }
        if (context?.chatHistory && context.chatHistory.length > 0) {
            messages.push(...context.chatHistory.slice(-5));
        }
        messages.push({ role: "user", content: message });
        const completion = await this.groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages,
            temperature: 0.8,
            max_tokens: 1000,
        });
        const responseText = completion.choices[0].message.content || "";
        try {
            const parsed = JSON.parse(responseText);
            if (parsed.action === "modify_route" && autoApply && context?.routeId) {
                const updatedRoute = await this.applyRouteModifications(context.routeId, parsed.modifications, context.currentRoute);
                return {
                    message: parsed.explanation,
                    routeUpdated: true,
                    updatedRoute,
                };
            }
            return {
                message: parsed.explanation || responseText,
                action: parsed.action,
                modifications: parsed.modifications,
            };
        }
        catch {
            return {
                message: responseText,
                routeUpdated: false,
            };
        }
    }
    async applyRouteModifications(routeId, modifications, currentRoute) {
        const { remove, add, filter } = modifications;
        let places = [...currentRoute.places];
        if (remove && remove.length > 0) {
            places = places.filter((p) => !remove.includes(p.placeId));
        }
        if (filter?.categories) {
            places = places.filter((p) => filter.categories.includes(p.category.toLowerCase()));
        }
        if (add && add.length > 0) {
            places = [...places, ...add];
        }
        let totalDuration = 0;
        let totalCost = 0;
        let currentTime = currentRoute.scheduledTime;
        places = places.map((place, index) => {
            const startTime = currentTime;
            const endTime = this.addMinutes(currentTime, place.duration);
            totalDuration += place.duration;
            totalCost += place.estimatedCost;
            if (index < places.length - 1) {
                const travelTime = place.transportFromPrevious?.duration || 15;
                currentTime = this.addMinutes(endTime, travelTime);
                totalDuration += travelTime;
            }
            return {
                ...place,
                startTime,
                endTime,
            };
        });
        const updatedRoute = await database_1.prisma.route.update({
            where: { id: routeId },
            data: {
                places: places,
                totalDuration,
                totalCost,
            },
        });
        return updatedRoute;
    }
    addMinutes(time, minutes) {
        const [hours, mins] = time.split(":").map(Number);
        const totalMinutes = hours * 60 + mins + minutes;
        const newHours = Math.floor(totalMinutes / 60) % 24;
        const newMins = totalMinutes % 60;
        return `${String(newHours).padStart(2, "0")}:${String(newMins).padStart(2, "0")}`;
    }
    async adaptRoute(routeId, condition, _userId) {
        const route = await database_1.prisma.route.findUnique({
            where: { id: routeId },
        });
        if (!route) {
            throw new Error("Route not found");
        }
        const currentPlaces = route.places;
        const currentPlace = route.currentPlace || 0;
        const prompt = `The user is currently on this route:
    Current place index: ${currentPlace}
    Places: ${JSON.stringify(currentPlaces)}
    
    Current condition/issue: ${condition}
    
    Please adapt the REMAINING places in the route (from index ${currentPlace} onwards) according to the condition.
    
    Examples:
    - "Начался дождь" → Replace outdoor places with indoor alternatives
    - "Устал" → Reduce number of places, add rest stops
    - "Мало времени" → Keep only the most important places
    - "Проголодался" → Add a restaurant as next place
    
    Respond with JSON:
    {
      "explanation": "Brief explanation of changes made",
      "adaptedPlaces": [...full list of places, including unchanged ones],
      "totalDuration": number,
      "totalCost": number
    }`;
        const completion = await this.groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a travel route optimizer. Adapt routes based on real-time conditions while keeping the route logical and enjoyable.",
                },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
            response_format: { type: "json_object" },
        });
        const responseText = completion.choices[0].message.content;
        if (!responseText) {
            throw new Error("AI response is empty");
        }
        return JSON.parse(responseText);
    }
    async getRecommendations(userId) {
        const user = await database_1.prisma.user.findUnique({
            where: { id: userId },
            include: {
                interactions: {
                    where: { liked: true },
                    include: {
                        place: {
                            include: { category: true },
                        },
                    },
                    take: 10,
                },
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        const likedPlaces = user.interactions.map((i) => ({
            name: i.place.name,
            category: i.place.category?.name ?? "Unknown",
        }));
        const prompt = `Based on these places the user liked:
    ${JSON.stringify(likedPlaces)}
    
    And user preferences:
    ${JSON.stringify(user.preferences)}
    
    Recommend 5 new places in Kyrgyzstan they might enjoy. 
    Respond with JSON: { "recommendations": [{ "placeName": "...", "reason": "..." }] }`;
        const completion = await this.groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a personalization expert for travel recommendations.",
                },
                { role: "user", content: prompt },
            ],
            temperature: 0.8,
            response_format: { type: "json_object" },
        });
        const responseText = completion.choices[0].message.content;
        if (!responseText) {
            throw new Error("AI response is empty");
        }
        return JSON.parse(responseText);
    }
    createRoutePrompt(params, places, userPreferences) {
        const isDetailedMode = params.mode === "detailed";
        let prompt = `Create a personalized travel route for Kyrgyzstan with these parameters:

LOCATION: ${params.location}
DATE: ${params.scheduledDate}
TIME: ${params.scheduledTime} - ${params.endTime || "end of day"}
DURATION: ${params.duration ? `${params.duration} minutes` : params.timeAvailable}
MOOD/INTERESTS: ${params.mood.join(", ")}
BUDGET: ${params.budget} KGS
COMPANIONS: ${params.companions || "solo"}
TRANSPORTATION: ${params.transportation || "walking"}
MODE: ${params.mode}
`;
        if (isDetailedMode && params.mustInclude && params.mustInclude.length > 0) {
            prompt += `\nMUST INCLUDE (обязательно):
${params.mustInclude.map((item) => `- ${item}`).join("\n")}
`;
        }
        if (isDetailedMode && params.exclude && params.exclude.length > 0) {
            prompt += `\nDO NOT INCLUDE (исключить):
${params.exclude.map((item) => `- ${item}`).join("\n")}
`;
        }
        if (isDetailedMode && params.preferences) {
            prompt += `\nPREFERENCES:
- Pace: ${params.preferences.pace || "moderate"}
- Cuisine: ${params.preferences.cuisine?.join(", ") || "any"}
- Fitness level: ${params.preferences.fitnessLevel || "medium"}
`;
        }
        prompt += `\nUSER PREFERENCES (learned from history):
${JSON.stringify(userPreferences, null, 2)}
`;
        prompt += `\nAVAILABLE PLACES:
${JSON.stringify(places.map((p) => ({
            id: p.id,
            name: p.name,
            category: p.category?.name ?? "Uncategorized",
            description: p.description,
            priceRange: p.priceRange,
            rating: p.rating,
            lat: p.lat,
            lng: p.lng,
            openingHours: p.openingHours || "9:00-21:00",
        })), null, 2)}
`;
        prompt += `\nCreate a route that:
1. Matches the user's time, mood, and budget
2. ${isDetailedMode && params.mustInclude ? "INCLUDES ALL items from mustInclude list" : "Follows mood preferences"}
3. ${isDetailedMode && params.exclude ? "EXCLUDES ALL items from exclude list" : "Avoids dislikes"}
4. Avoids places the user has already visited (if provided in preferences)
5. Considers transportation type and time
6. Flows logically (nearby places together, realistic travel times)
7. Includes interesting local tips and photo spots
8. All places must be open at the specified times
9. Calculate exact start/end times for each place

Respond with JSON:
{
  "routeName": "Attractive route name",
  "description": "Brief description of the route experience",
  "places": [
    {
      "placeId": "uuid from available places",
      "name": "Place name",
      "category": "Category name",
      "description": "Brief description",
      "startTime": "10:00",
      "endTime": "11:30",
      "duration": 90,
      "estimatedCost": 450,
      "transportFromPrevious": {
        "type": "walking",
        "duration": 15,
        "distance": 1.2
      } or null for first place,
      "tips": "Local tip or advice",
      "photoSpot": "Where to take best photos"
    }
  ],
  "totalDuration": 240,
  "totalCost": 1500,
  "distance": 5.5
}`;
        return prompt;
    }
}
exports.AIService = AIService;
//# sourceMappingURL=ai.service.js.map