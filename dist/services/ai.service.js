"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const openai_1 = __importDefault(require("openai"));
const env_1 = require("../config/env");
const database_1 = require("../config/database");
class AIService {
    constructor() {
        this.openai = new openai_1.default({
            apiKey: env_1.env.OPENAI_API_KEY,
        });
    }
    // Generate route using AI
    async generateRoute(params, userId) {
        // Get available places from database
        const places = await database_1.prisma.place.findMany({
            include: {
                category: true,
            },
        });
        // Get user preferences if userId provided
        let userPreferences = {};
        if (userId) {
            const user = await database_1.prisma.user.findUnique({
                where: { id: userId },
                select: { preferences: true },
            });
            userPreferences = user?.preferences || {};
            // Get user's visited places
            const visitedPlaces = await database_1.prisma.userPlaceInteraction.findMany({
                where: { userId, visited: true },
                select: { placeId: true },
            });
            userPreferences.visitedPlaceIds = visitedPlaces.map((v) => v.placeId);
        }
        // Create AI prompt
        const prompt = this.createRoutePrompt(params, places, userPreferences);
        // Call OpenAI
        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are an expert travel guide for Kyrgyzstan. Create personalized travel routes based on user preferences. 
          Always respond with valid JSON only, no additional text.`,
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
    // Chat with AI
    async chat(message, context) {
        const systemMessage = `You are Nomad AI, a helpful travel assistant for Kyrgyzstan. 
    You help travelers with:
    - Finding places (restaurants, attractions, etc.)
    - Route modifications
    - Local tips and recommendations
    - Practical questions (toilets, weather, etc.)
    
    Be concise, helpful, and friendly. Use emojis when appropriate.`;
        const messages = [{ role: "system", content: systemMessage }];
        // Add context if provided
        if (context?.currentRoute) {
            messages.push({
                role: "system",
                content: `Current route context: ${JSON.stringify(context.currentRoute)}`,
            });
        }
        if (context?.chatHistory && context.chatHistory.length > 0) {
            messages.push(...context.chatHistory.slice(-5)); // Last 5 messages
        }
        messages.push({ role: "user", content: message });
        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
            temperature: 0.8,
            max_tokens: 500,
        });
        return (completion.choices[0].message.content ||
            "Sorry, I could not generate a response.");
    }
    // Adapt route based on conditions
    async adaptRoute(routeId, condition, _userId) {
        // Get current route
        const route = await database_1.prisma.route.findUnique({
            where: { id: routeId },
        });
        if (!route) {
            throw new Error("Route not found");
        }
        const prompt = `The user is currently on this route:
    ${JSON.stringify(route.places)}
    
    Condition: ${condition}
    
    Please adapt the route accordingly. Respond with JSON containing:
    {
      "adaptedPlaces": [...],
      "explanation": "Why these changes were made",
      "totalDuration": number,
      "totalCost": number
    }`;
        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a travel route optimizer. Adapt routes based on real-time conditions.",
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
    // Get personalized recommendations
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
            category: i.place.category.name,
        }));
        const prompt = `Based on these places the user liked:
    ${JSON.stringify(likedPlaces)}
    
    And user preferences:
    ${JSON.stringify(user.preferences)}
    
    Recommend 5 new places in Kyrgyzstan they might enjoy. 
    Respond with JSON: { "recommendations": [{ "placeName": "...", "reason": "..." }] }`;
        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o-mini",
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
    // Helper: Create route generation prompt
    createRoutePrompt(params, places, userPreferences) {
        return `Create a personalized travel route for Kyrgyzstan with these parameters:

TIME AVAILABLE: ${params.timeAvailable}
MOOD/INTERESTS: ${params.mood.join(", ")}
BUDGET: ${params.budget}
LOCATION: ${params.location || "Bishkek"}
COMPANIONS: ${params.companions || "solo"}
TRANSPORTATION: ${params.transportation || "walking"}

USER PREFERENCES:
${JSON.stringify(userPreferences, null, 2)}

AVAILABLE PLACES:
${JSON.stringify(places.map((p) => ({
            id: p.id,
            name: p.name,
            category: p.category.name,
            description: p.description,
            priceRange: p.priceRange,
            rating: p.rating,
            lat: p.lat,
            lng: p.lng,
        })), null, 2)}

Create a route that:
1. Matches the user's time, mood, and budget
2. Avoids places they've already visited (if provided)
3. Considers transportation type
4. Flows logically (close places together)
5. Includes interesting local tips

Respond with JSON:
{
  "routeName": "Attractive route name",
  "description": "Brief description",
  "places": [
    {
      "placeId": "uuid",
      "name": "Place name",
      "duration": 60,
      "startTime": "10:00",
      "transportFromPrevious": {
        "type": "walking",
        "duration": 15,
        "distance": 1.2
      },
      "tips": "Local tip or photo spot"
    }
  ],
  "totalDuration": 240,
  "totalCost": 1500,
  "distance": 5.5
}`;
    }
}
exports.AIService = AIService;
//# sourceMappingURL=ai.service.js.map