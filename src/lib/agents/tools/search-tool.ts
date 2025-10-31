/**
 * Search Product Across Sites Tool
 * Orchestrates multiple sub-agents for parallel data extraction
 */

import { google } from "@ai-sdk/google";
import { generateText, tool } from "ai";
import { z } from "zod";
import {
  getAllWebsiteKeys,
  getSearchUrl,
  getWebsiteName,
} from "../../website-config.js";
import { GEMINI_MODEL, MAX_HTML_LENGTH } from "../config.js";
import type { SubAgentResult } from "../types.js";

export const searchProductAcrossSitesTool = tool({
  description:
    "Orchestrates multiple sub-agents to search and extract product data from all supported websites in parallel. Each sub-agent handles one website.",
  inputSchema: z.object({
    productQuery: z
      .string()
      .describe("The product to search for across all sites"),
    websites: z
      .array(z.string())
      .optional()
      .describe("Specific websites to search (optional, defaults to all)"),
  }),
  execute: async (args) => {
    const { productQuery, websites } = args;
    try {
      const sitesToSearch = websites || getAllWebsiteKeys();

      console.log(
        `\n🤖 Deploying ${sitesToSearch.length} sub-agents for parallel extraction...`
      );

      // Create sub-agent tasks for parallel execution
      const subAgentTasks = sitesToSearch.map(
        async (websiteKey: string): Promise<SubAgentResult> => {
          const websiteName = getWebsiteName(websiteKey);
          console.log(`  └─ Sub-Agent ${websiteKey}: Starting...`);

          try {
            // Sub-agent: Fetch page
            const searchUrl = getSearchUrl(websiteKey, productQuery);
            const response = await fetch(searchUrl, {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              },
            });

            if (!response.ok) {
              console.log(`  └─ Sub-Agent ${websiteKey}: ❌ Fetch failed`);
              return {
                website: websiteKey,
                websiteName,
                success: false,
                error: `HTTP ${response.status}`,
              };
            }

            let html = await response.text();
            if (html.length > MAX_HTML_LENGTH) {
              html =
                html.substring(0, MAX_HTML_LENGTH) + "\n[HTML truncated...]";
            }

            // Sub-agent: Extract data using AI
            const extractionPrompt = `Extract product data from this HTML for query: "${productQuery}". Return JSON with productData object or null if not found.

HTML:
${html}`;

            const extractResult = await generateText({
              model: google(GEMINI_MODEL),
              prompt: extractionPrompt,
            });

            const jsonMatch = extractResult.text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
              console.log(`  └─ Sub-Agent ${websiteKey}: ❌ No data found`);
              return {
                website: websiteKey,
                websiteName,
                success: false,
                error: "No product data found",
              };
            }

            const data = JSON.parse(jsonMatch[0]);
            if (!data.productData) {
              console.log(`  └─ Sub-Agent ${websiteKey}: ❌ No product data`);
              return {
                website: websiteKey,
                websiteName,
                success: false,
                error: "No product data found",
              };
            }

            console.log(`  └─ Sub-Agent ${websiteKey}: ✅ Data extracted`);
            return {
              website: websiteKey,
              websiteName,
              success: true,
              data: { ...data, websiteName },
            };
          } catch (error) {
            console.log(`  └─ Sub-Agent ${websiteKey}: ❌ Error occurred`);
            return {
              website: websiteKey,
              websiteName,
              success: false,
              error: error instanceof Error ? error.message : "Unknown error",
            };
          }
        }
      );

      // Execute all sub-agents in parallel
      const results = await Promise.all(subAgentTasks);

      // Filter successful results
      const successfulResults = results.filter((r) => r.success);
      const failedResults = results.filter((r) => !r.success);

      console.log(
        `\n📊 Sub-Agent Results: ${successfulResults.length} successful, ${failedResults.length} failed\n`
      );

      return {
        success: true,
        totalSearched: results.length,
        successCount: successfulResults.length,
        failedCount: failedResults.length,
        results: successfulResults,
        failures: failedResults.map((r) => ({
          website: r.websiteName,
          error: r.error,
        })),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Multi-site search failed",
      };
    }
  },
});
