import fa from "fs/promises";
/**
 * Simple direct test of the agent
 */

import { runScrapingAgent } from "../index.js";

async function simpleTest() {
  console.log("\n🧪 Simple Agent Test\n");
  const USER_QUERY = `AMD Ryzen 7 7700 Gaming Processor VS AMD Ryzen 5 8600G  with Radeon Graphics`;

  const result = await runScrapingAgent(USER_QUERY, {
    maxSteps: 5,
    verbose: true,
  });

  console.log("\n" + "=".repeat(70));
  console.log("RESULT:");
  console.log("=".repeat(70));
  console.log("Success:", result.success);
  console.log("Error:", result.error || "None");
  console.log("\nResponse:");
  console.log(result.response);
  console.log("\nSteps:", result.steps?.length || 0);
  console.log("=".repeat(70));

  // create a new .md  file in /results (with a name with date - unique)
  const fileName = `results/${new Date().toISOString().replace(/:/g, "-")}.md`;
  await fa.mkdir("results", { recursive: true });
  await fa.writeFile(fileName, result.response);
}

simpleTest().catch(console.error);
