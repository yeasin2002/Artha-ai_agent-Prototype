/**
 * Simple direct test of the agent
 */

import { runScrapingAgent } from "./src/index.js";

async function simpleTest() {
  console.log("\n🧪 Simple Agent Test\n");

  const result = await runScrapingAgent(
    "What is the price of RTX 4070 on any Bangladesh tech store?",
    { maxSteps: 5, verbose: true }
  );

  console.log("\n" + "=".repeat(70));
  console.log("RESULT:");
  console.log("=".repeat(70));
  console.log("Success:", result.success);
  console.log("Error:", result.error || "None");
  console.log("\nResponse:");
  console.log(result.response);
  console.log("\nSteps:", result.steps?.length || 0);
  console.log("=".repeat(70));
}

simpleTest().catch(console.error);
