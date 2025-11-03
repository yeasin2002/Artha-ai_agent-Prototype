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
} from "../../../config/website-config.js";
import { GEMINI_MODEL, MAX_HTML_LENGTH } from "../config.js";
import {
  logSubAgentError,
  logSubAgentStart,
  logSubAgentSuccess,
  logSubAgentWarning,
  logger,
} from "../logger.js";
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

    logger.info("Starting multi-site product search", {
      productQuery,
      websitesRequested: websites || "all",
      timestamp: new Date().toISOString(),
    });

    try {
      const sitesToSearch = websites || getAllWebsiteKeys();

      console.log(
        `\n🤖 Deploying ${sitesToSearch.length} sub-agents for parallel extraction...`
      );

      logger.info(`Deploying ${sitesToSearch.length} sub-agents`, {
        sites: sitesToSearch,
      });

      // Create sub-agent tasks for parallel execution
      const subAgentTasks = sitesToSearch.map(
        async (websiteKey: string): Promise<SubAgentResult> => {
          const websiteName = getWebsiteName(websiteKey);
          console.log(`  └─ Sub-Agent ${websiteKey}: Starting...`);

          const startTime = Date.now();

          try {
            // Sub-agent: Fetch page
            const searchUrl = getSearchUrl(websiteKey, productQuery);

            logSubAgentStart(websiteKey, searchUrl);

            const response = await fetch(searchUrl, {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              },
            });

            if (!response.ok) {
              const errorMsg = `HTTP ${response.status}: ${response.statusText}`;
              console.log(`  └─ Sub-Agent ${websiteKey}: ❌ Fetch failed`);

              logSubAgentError(websiteKey, errorMsg, {
                searchUrl,
                statusCode: response.status,
                statusText: response.statusText,
                duration: Date.now() - startTime,
              });

              return {
                website: websiteKey,
                websiteName,
                success: false,
                error: errorMsg,
              };
            }

            let html = await response.text();
            const originalHtmlLength = html.length;

            if (html.length > MAX_HTML_LENGTH) {
              html =
                html.substring(0, MAX_HTML_LENGTH) + "\n[HTML truncated...]";

              logSubAgentWarning(
                websiteKey,
                `HTML truncated from ${originalHtmlLength} to ${MAX_HTML_LENGTH} characters`,
                {
                  originalLength: originalHtmlLength,
                  truncatedLength: html.length,
                }
              );
            }

            logger.debug(`Sub-Agent ${websiteKey}: HTML fetched`, {
              website: websiteKey,
              htmlLength: html.length,
              originalLength: originalHtmlLength,
              truncated: originalHtmlLength > MAX_HTML_LENGTH,
            });

            // Sub-agent: Extract data using AI
            const extractionPrompt = `Extract product data from this HTML for query: "${productQuery}". Return JSON with productData object or null if not found.

HTML:
${html}`;

            logger.debug(`Sub-Agent ${websiteKey}: Starting AI extraction`, {
              website: websiteKey,
              promptLength: extractionPrompt.length,
            });

            const extractResult = await generateText({
              model: google(GEMINI_MODEL),
              prompt: extractionPrompt,
            });

            logger.debug(`Sub-Agent ${websiteKey}: AI extraction completed`, {
              website: websiteKey,
              responseLength: extractResult.text.length,
            });

            const jsonMatch = extractResult.text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
              console.log(`  └─ Sub-Agent ${websiteKey}: ❌ No data found`);

              logSubAgentError(
                websiteKey,
                "Failed to parse JSON from AI response",
                {
                  searchUrl,
                  aiResponsePreview: extractResult.text.substring(0, 200),
                  duration: Date.now() - startTime,
                }
              );

              return {
                website: websiteKey,
                websiteName,
                success: false,
                error: "No product data found - JSON parsing failed",
              };
            }

            let data;
            try {
              data = JSON.parse(jsonMatch[0]);
            } catch (parseError) {
              console.log(`  └─ Sub-Agent ${websiteKey}: ❌ JSON parse error`);

              logSubAgentError(
                websiteKey,
                parseError instanceof Error ? parseError : "JSON parse error",
                {
                  searchUrl,
                  jsonString: jsonMatch[0].substring(0, 200),
                  duration: Date.now() - startTime,
                }
              );

              return {
                website: websiteKey,
                websiteName,
                success: false,
                error: "JSON parsing error",
              };
            }

            if (!data.productData) {
              console.log(`  └─ Sub-Agent ${websiteKey}: ❌ No product data`);

              logSubAgentWarning(
                websiteKey,
                "AI returned response but productData is null",
                {
                  searchUrl,
                  dataKeys: Object.keys(data),
                  duration: Date.now() - startTime,
                }
              );

              return {
                website: websiteKey,
                websiteName,
                success: false,
                error: "No product data found in response",
              };
            }

            console.log(`  └─ Sub-Agent ${websiteKey}: ✅ Data extracted`);

            const dataPreview = JSON.stringify(data.productData).substring(
              0,
              150
            );
            logSubAgentSuccess(websiteKey, dataPreview);

            logger.info(`Sub-Agent ${websiteKey}: Success`, {
              website: websiteKey,
              productName: data.productData.name,
              price: data.productData.price,
              availability: data.productData.availability,
              duration: Date.now() - startTime,
            });

            return {
              website: websiteKey,
              websiteName,
              success: true,
              data: { ...data, websiteName },
            };
          } catch (error) {
            console.log(`  └─ Sub-Agent ${websiteKey}: ❌ Error occurred`);

            const errorObj =
              error instanceof Error ? error : new Error(String(error));

            logSubAgentError(websiteKey, errorObj, {
              searchUrl: getSearchUrl(websiteKey, productQuery),
              duration: Date.now() - startTime,
              errorType: errorObj.name,
              errorMessage: errorObj.message,
              stack: errorObj.stack,
            });

            return {
              website: websiteKey,
              websiteName,
              success: false,
              error: errorObj.message || "Unknown error",
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

      // Log summary
      logger.info("Multi-site search completed", {
        totalSearched: results.length,
        successCount: successfulResults.length,
        failedCount: failedResults.length,
        successRate: `${(
          (successfulResults.length / results.length) *
          100
        ).toFixed(1)}%`,
        successfulSites: successfulResults.map((r) => r.websiteName),
        failedSites: failedResults.map((r) => ({
          site: r.websiteName,
          error: r.error,
        })),
      });

      // Log detailed failure information
      if (failedResults.length > 0) {
        logger.warn("Some sub-agents failed", {
          failures: failedResults.map((r) => ({
            website: r.websiteName,
            error: r.error,
          })),
        });
      }

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
      const errorObj =
        error instanceof Error ? error : new Error(String(error));

      logger.error("Multi-site search failed catastrophically", {
        error: errorObj.message,
        stack: errorObj.stack,
        productQuery,
      });

      return {
        success: false,
        error: errorObj.message || "Multi-site search failed",
      };
    }
  },
});
