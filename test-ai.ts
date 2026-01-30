import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function testAI() {
  console.log("🧪 Testing Groq AI...\n");

  // Test 1: Simple chat
  console.log("Test 1: Simple Chat");
  console.log("===================");
  const chatResponse = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You are a helpful travel assistant for Kyrgyzstan.",
      },
      {
        role: "user",
        content: "What are the top 3 places to visit in Bishkek?",
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  console.log("AI Response:");
  console.log(chatResponse.choices[0].message.content);
  console.log("\n");

  // Test 2: JSON generation
  console.log("Test 2: JSON Route Generation");
  console.log("==============================");
  const routeResponse = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are a travel planner. Always respond with valid JSON only.",
      },
      {
        role: "user",
        content: `Create a 4-hour walking route in Bishkek for a foodie. 
        Respond with JSON:
        {
          "routeName": "...",
          "description": "...",
          "places": [
            {"name": "...", "duration": 60, "type": "restaurant"}
          ],
          "totalDuration": 240
        }`,
      },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  console.log("AI Response (JSON):");
  const jsonResponse = JSON.parse(
    routeResponse.choices[0].message.content || "{}",
  );
  console.log(JSON.stringify(jsonResponse, null, 2));
  console.log("\n");

  // Test 3: Speed test
  console.log("Test 3: Speed Test");
  console.log("==================");
  const startTime = Date.now();

  await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: "Give me 3 interesting facts about Kyrgyzstan.",
      },
    ],
    max_tokens: 200,
  });

  const endTime = Date.now();
  console.log(`Response time: ${endTime - startTime}ms`);
  console.log("\n");

  // Test 4: Different models comparison
  console.log("Test 4: Model Comparison");
  console.log("========================");

  const models = [
    "llama-3.3-70b-versatile",
    "llama-3.1-70b-versatile",
    "mixtral-8x7b-32768",
  ];

  for (const model of models) {
    const start = Date.now();
    const response = await groq.chat.completions.create({
      model: model,
      messages: [
        {
          role: "user",
          content: "What is the capital of Kyrgyzstan?",
        },
      ],
      max_tokens: 50,
    });
    const time = Date.now() - start;

    console.log(`\nModel: ${model}`);
    console.log(`Speed: ${time}ms`);
    console.log(`Response: ${response.choices[0].message.content}`);
  }

  console.log("\n✅ All tests completed!");
}

testAI().catch(console.error);
