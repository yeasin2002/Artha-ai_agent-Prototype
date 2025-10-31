import "dotenv/config";
/**
 * AI Web Scraping Agent - Main Entry Point
 * Example usage and demonstrations
 */

import { runScrapingAgent } from "./lib/ai-agent.js";

// Check for API key
if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  console.error(
    "❌ Error: GOOGLE_GENERATIVE_AI_API_KEY not found in environment"
  );
  console.error("Please set your API key:");
  console.error("  export GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here");
  console.error(
    "\nGet your API key from: https://makersuite.google.com/app/apikey"
  );
  process.exit(1);
}

async function main() {
  console.log("\n🚀 AI Web Scraping Agent - Demo\n");

  // Example 1: Compare processors
  console.log("=".repeat(70));
  console.log("🎯 Example 1: Comparing Processors");
  console.log("=".repeat(70));

  const result1 = await runScrapingAgent(
    `I want to compare Intel Core i7-13700K and AMD Ryzen 7 7700X processors. 
    Please check prices on Startech, Techland, and Ryans, and tell me which is the better deal.`,
    { maxSteps: 15, verbose: true }
  );

  console.log("\n📋 Final Response:\n");
  console.log(result1.response);
  console.log("\n");

  // Example 2: Find best price for specific product
  console.log("\n" + "=".repeat(70));
  console.log("🎯 Example 2: Finding Best Price for Graphics Card");
  console.log("=".repeat(70));

  const result2 = await runScrapingAgent(
    `Find the best price for RTX 4070 graphics card across all available websites 
    and show me a detailed price comparison with availability status.`,
    { maxSteps: 15, verbose: true }
  );

  console.log("\n📋 Final Response:\n");
  console.log(result2.response);
  console.log("\n");

  // Example 3: Product availability check
  console.log("\n" + "=".repeat(70));
  console.log("🎯 Example 3: Checking Product Availability");
  console.log("=".repeat(70));

  const result3 = await runScrapingAgent(
    `Check if Samsung 980 Pro 1TB SSD is available on Startech and Ryans. 
    If available, compare their prices and tell me which one offers better value.`,
    { maxSteps: 15, verbose: true }
  );

  console.log("\n📋 Final Response:\n");
  console.log(result3.response);
  console.log("\n");

  // Example 4: Bengali query support
  console.log("\n" + "=".repeat(70));
  console.log("🎯 Example 4: Bengali Language Query");
  console.log("=".repeat(70));

  const result4 = await runScrapingAgent(
    `কোথায় AMD Ryzen 5 7600X প্রসেসর সবচেয়ে সস্তা? দাম তুলনা করে দেখান।`,
    { maxSteps: 15, verbose: true }
  );

  console.log("\n📋 Final Response:\n");
  console.log(result4.response);
  console.log("\n");

  console.log("=".repeat(70));
  console.log("✅ All Examples Completed!");
  console.log("=".repeat(70));
}

// Run if executed directly (Node.js ESM check)
const isMainModule =
  (process.argv[1] && process.argv[1].endsWith("index.ts")) ||
  process.argv[1]?.endsWith("index.js");
if (isMainModule) {
  main().catch((error) => {
    console.error("❌ Fatal Error:", error);
    process.exit(1);
  });
}

// Export for use as library
export { runScrapingAgent } from "./lib/ai-agent.js";
export type { AgentOptions } from "./lib/ai-agent.js";
export {
  SUPPORTED_WEBSITES,
  getAllWebsiteKeys,
  getSearchUrl,
  getWebsiteName,
} from "./lib/website-config.js";
export type { WebsiteConfig } from "./lib/website-config.js";
