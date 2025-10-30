// ============================================================================
// EXAMPLE USAGE
// ============================================================================
/**
 * Example: How to use the AI agent
 */

import { runScrapingAgent } from "./lib/ai-agent";

async function main() {
  // Example 1: Compare processors
  console.log("\n🎯 Example 1: Comparing Processors\n");

  const result1 = await runScrapingAgent(
    `I want to compare Intel Core i7-13700K and AMD Ryzen 7 7700X processors. 
    Please check prices on Startech, Techland, and Ryans, and tell me which is the better deal.`
  );

  console.log("\n📋 Result:", result1.response);

  // Example 2: Find best price for specific product
  console.log("\n\n🎯 Example 2: Finding Best Price\n");

  const result2 = await runScrapingAgent(
    `Find the best price for ASUS ROG Strix B650E-F Gaming WiFi motherboard 
    across all available websites and show me price comparison.`
  );

  console.log("\n📋 Result:", result2.response);

  // Example 3: Product availability check
  console.log("\n\n🎯 Example 3: Checking Availability\n");

  const result3 = await runScrapingAgent(
    `Check if RTX 4070 Ti graphics cards are available on Startech and Ryans, 
    and compare their prices if available.`
  );

  console.log("\n📋 Result:", result3.response);
}

main().catch(console.error);
