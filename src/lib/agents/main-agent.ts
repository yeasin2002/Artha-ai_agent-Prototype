/**
 * Main AI Scraping Agent
 * Orchestrates the entire scraping and comparison workflow
 */

import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { GEMINI_MODEL } from "./config.js";
import { searchProductAcrossSitesTool } from "./tools/index.js";
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
    // Step 1: Directly call the search tool to gather data
    // The execute function requires 2 arguments: input and options
    const searchResults = await searchProductAcrossSitesTool.execute!(
      {
        productQuery: userQuery,
      },
      {
        toolCallId: "search-" + Date.now(),
        messages: [],
      }
    );

    // Handle AsyncIterable response
    let finalResults: any;
    if (Symbol.asyncIterator in Object(searchResults)) {
      // If it's an async iterable, collect all results
      const chunks = [];
      for await (const chunk of searchResults as AsyncIterable<any>) {
        chunks.push(chunk);
      }
      finalResults = chunks[chunks.length - 1]; // Get the last chunk
    } else {
      finalResults = searchResults;
    }

    if (verbose) {
      console.log(
        `\n📊 Search completed: ${finalResults.successCount} sites successful\n`
      );
    }

    if (!finalResults.success || finalResults.results.length === 0) {
      return {
        success: false,
        error: "No data retrieved from websites",
        response:
          "❌ Unable to retrieve product data from the websites. The sites may be blocking requests or the product was not found.",
      };
    }

    // Step 2: Generate comprehensive response based on the data
    const analysisResult = await generateText({
      model: google(GEMINI_MODEL),
      system: `You are a product comparison expert for Bangladesh e-commerce platforms. Analyze the scraped data and provide a comprehensive, user-friendly response.`,
      prompt: `User Query: "${userQuery}"

Scraped Data from ${finalResults.successCount} websites:
${JSON.stringify(finalResults.results, null, 2)}

Provide a detailed analysis including:
1. **Summary**: Brief overview of what was found
2. **Price Comparison**: List all prices from lowest to highest with website names
3. **Availability**: Which websites have the product in stock
4. **Product Details**: Key specifications and features from the data
5. **Recommendation**: Which website offers the best deal and why
6. **Purchase Links**: Mention the websites where users can buy

Format your response in a clear, readable way with proper sections. Be specific about prices (in BDT) and availability status.`,
    });

    if (verbose) {
      console.log("\n" + "=".repeat(60));
      console.log("✅ Agent Execution Complete");
      console.log("=".repeat(60));
      console.log(`📊 Sites Searched: ${finalResults.totalSearched}`);
      console.log(`✅ Successful: ${finalResults.successCount}`);
      console.log(`❌ Failed: ${finalResults.failedCount}`);
      console.log(
        `💬 Response Length: ${analysisResult.text.length} characters`
      );
      console.log("=".repeat(60) + "\n");
    }

    return {
      success: true,
      response: analysisResult.text,
      steps: [
        {
          type: "tool-call",
          toolName: "searchProductAcrossSites",
          result: finalResults,
        },
      ],
      usage: analysisResult.usage,
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
