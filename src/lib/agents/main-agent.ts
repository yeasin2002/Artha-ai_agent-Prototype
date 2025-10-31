/**
 * Main AI Scraping Agent
 * Orchestrates the entire scraping and comparison workflow
 */

import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { getAllWebsiteKeys, getWebsiteName } from "../website-config.js";
import { GEMINI_MODEL } from "./config.js";
import {
  compareProductsTool,
  extractProductDataTool,
  fetchWebPageTool,
  searchProductAcrossSitesTool,
} from "./tools/index.js";
import type { AgentOptions, AgentResponse } from "./types.js";
import { validateQuery } from "./validators.js";

/**
 * Run the AI Scraping Agent
 */
export async function runScrapingAgent(
  userQuery: string,
  options: AgentOptions = {}
): Promise<AgentResponse> {
  const { maxSteps = 10, verbose = true } = options;

  // Validate query
  const validation = validateQuery(userQuery);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
      response: `❌ Invalid query: ${validation.error}`,
    };
  }

  if (verbose) {
    console.log("\n" + "=".repeat(60));
    console.log("🤖 AI Web Scraping Agent - Starting");
    console.log("=".repeat(60));
    console.log(`📝 Query: ${userQuery}`);
    console.log(`⚙️  Max Steps: ${maxSteps}`);
    console.log("=".repeat(60) + "\n");
  }

  try {
    const result = await generateText({
      model: google(GEMINI_MODEL),
      system: `You are an intelligent web scraping and product comparison agent for Bangladesh e-commerce platforms.

Your capabilities:
1. Search products across multiple websites simultaneously using sub-agents
2. Extract comprehensive product details (A-Z everything)
3. Compare products across price, specs, availability, warranty
4. Provide intelligent recommendations based on user needs
5. Support both English and Bengali queries

Available websites: ${getAllWebsiteKeys().map(getWebsiteName).join(", ")}

Workflow:
1. Understand the user query and validate it
2. Use searchProductAcrossSitesTool to deploy sub-agents for parallel data extraction
3. Each sub-agent fetches and extracts data from one website
4. Aggregate all results from sub-agents
5. Use compareProductsTool to analyze and compare products
6. Provide comprehensive response with:
   - Price comparison (lowest to highest)
   - Availability status
   - Key differences
   - Clear recommendation with reasoning
   - Graph-ready data for visualization
   - Purchase links

IMPORTANT:
- Always use searchProductAcrossSitesTool first to get data from all sites
- Extract ALL product details (A-Z)
- Provide actionable recommendations
- Handle Bengali queries naturally
- If a site fails, continue with others
- Be thorough and accurate`,
      prompt: userQuery,
      tools: {
        fetchWebPage: fetchWebPageTool,
        extractProductData: extractProductDataTool,
        compareProducts: compareProductsTool,
        searchProductAcrossSites: searchProductAcrossSitesTool,
      },
    });

    if (verbose) {
      console.log("\n" + "=".repeat(60));
      console.log("✅ Agent Execution Complete");
      console.log("=".repeat(60));
      console.log(`📊 Steps Used: ${result.steps?.length || 0}/${maxSteps}`);
      console.log(`💬 Response Length: ${result.text.length} characters`);
      console.log("=".repeat(60) + "\n");
    }

    return {
      success: true,
      response: result.text,
      steps: result.steps,
      usage: result.usage,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    if (verbose) {
      console.error("\n❌ Agent Error:", errorMessage);
    }

    return {
      success: false,
      error: errorMessage,
      response: `❌ An error occurred: ${errorMessage}`,
    };
  }
}
