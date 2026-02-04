import Groq from "groq-sdk";
import { env } from "../config/env";
import { RouteGenerationParams } from "../types";
import { prisma } from "../config/database";

export class AIService {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({
      apiKey: env.GROQ_API_KEY,
    });
  }

  // Generate route using AI
  async generateRoute(params: RouteGenerationParams, userId?: string) {
    // Get available places from database
    const places = await prisma.place.findMany({
      include: {
        category: true,
      },
    });

    // Get user preferences if userId provided
    let userPreferences: any = {};
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { preferences: true },
      });
      userPreferences = user?.preferences || {};

      // Get user's visited places
      const visitedPlaces = await prisma.userPlaceInteraction.findMany({
        where: { userId, visited: true },
        select: { placeId: true },
      });
      userPreferences.visitedPlaceIds = visitedPlaces.map((v) => v.placeId);
    }

    // Create AI prompt
    const prompt = this.createRoutePrompt(params, places, userPreferences);

    // Call Groq
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

  // Chat with AI
  async chat(message: string, context?: any) {
    const systemMessage = `You are Nomad AI, a helpful travel assistant for Kyrgyzstan. 
    You help travelers with:
    - Finding places (restaurants, attractions, etc.)
    - Route modifications
    - Local tips and recommendations
    - Practical questions (toilets, weather, etc.)
    
    Be concise, helpful, and friendly. Use emojis when appropriate.`;

    const messages: any[] = [{ role: "system", content: systemMessage }];

    // Add context if provided
    if (context?.currentRoute) {
      messages.push({
        role: "system",
        content: `Current route context: ${JSON.stringify(context.currentRoute)}`,
      });
    }

    if (context?.currentPlace) {
      messages.push({
        role: "system",
        content: `User is currently at: ${context.currentPlace}`,
      });
    }

    if (context?.chatHistory && context.chatHistory.length > 0) {
      messages.push(...context.chatHistory.slice(-5)); // Last 5 messages
    }

    messages.push({ role: "user", content: message });

    const completion = await this.groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.8,
      max_tokens: 500,
    });

    return (
      completion.choices[0].message.content ||
      "Sorry, I could not generate a response."
    );
  }

  // Adapt route based on conditions
  async adaptRoute(routeId: string, condition: string, _userId: string) {
    // Get current route
    const route = await prisma.route.findUnique({
      where: { id: routeId },
    });

    if (!route) {
      throw new Error("Route not found");
    }

    const currentPlaces = route.places as any[];
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
          content:
            "You are a travel route optimizer. Adapt routes based on real-time conditions while keeping the route logical and enjoyable.",
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
  async getRecommendations(userId: string) {
    const user = await prisma.user.findUnique({
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
          content:
            "You are a personalization expert for travel recommendations.",
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
  private createRoutePrompt(
    params: RouteGenerationParams,
    places: any[],
    userPreferences: any,
  ): string {
    const isDetailedMode = params.mode === "detailed";

    // Базовый промпт
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

    // Для детального режима
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

    // Предпочтения пользователя
    prompt += `\nUSER PREFERENCES (learned from history):
${JSON.stringify(userPreferences, null, 2)}
`;

    // Список доступных мест
    prompt += `\nAVAILABLE PLACES:
${JSON.stringify(
  places.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category.name,
    description: p.description,
    priceRange: p.priceRange,
    rating: p.rating,
    lat: p.lat,
    lng: p.lng,
    openingHours: p.openingHours || "9:00-21:00", // Default если нет
  })),
  null,
  2,
)}
`;

    // Инструкции
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
