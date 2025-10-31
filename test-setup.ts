/**
 * Quick test to verify the AI agent setup
 */

import { runScrapingAgent } from "./src/index.js";

async function testSetup() {
  console.log("🧪 Testing AI Agent Setup...\n");

  // Simple test query
  const result = await runScrapingAgent(
    "Find the price of Intel Core i5 processor on Startech",
    { maxSteps: 5, verbose: true }
  );

  console.log("\n📋 Test Result:");
  console.log("Success:", result.success);
  console.log("Response:", result.response.substring(0, 200) + "...");
}

testSetup().catch(console.error);
