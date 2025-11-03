/**
 * Simple test to verify AI agent is working
 */

import { runScrapingAgent } from "../index.js";

// Check for API key
if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  console.error("\n❌ Error: GOOGLE_GENERATIVE_AI_API_KEY not found");
  console.error("\nPlease set your API key in .env file:");
  console.error("  GOOGLE_GENERATIVE_AI_API_KEY=your_key_here");
  console.error(
    "\nGet your API key from: https://makersuite.google.com/app/apikey\n"
  );
  process.exit(1);
}

async function testAgent() {
  console.log("\n🧪 Testing AI Web Scraping Agent\n");
  console.log("=".repeat(70));
  console.log("Test Query: Find Intel Core i5 processor on Startech");
  console.log("=".repeat(70));

  try {
    const result = await runScrapingAgent(
      "Find the price of Intel Core i5-13400F processor on Startech",
      { maxSteps: 8, verbose: true }
    );

    console.log("\n" + "=".repeat(70));
    console.log("📊 Test Results");
    console.log("=".repeat(70));
    console.log("Success:", result.success);
    console.log("\n📋 Response Preview:");
    console.log(result.response.substring(0, 500) + "...\n");

    if (result.success) {
      console.log("✅ Agent is working correctly!");
    } else {
      console.log("❌ Agent encountered an error:", result.error);
    }
  } catch (error) {
    console.error("\n❌ Test failed:", error);
    process.exit(1);
  }
}

testAgent();
