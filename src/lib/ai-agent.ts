/**
 * AI Web Scraping Agent with Multi-Agent Support
 * Built with Vercel AI SDK and Google Gemini
 */

import { google } from "@ai-sdk/google";
import { generateText, tool } from "ai";
import { z } from "zod";
import {
  getAllWebsiteKeys,
  getSearchUrl,
  getWebsiteName,
} from "./website-config.js";

// Configuration
const GEMINI_MODEL =
  process.env.GEMINI_MODEL || "gemini-2.0-flash-thinking-exp-1219";
const MAX_HTML_LENGTH = 50000; // Truncate HTML to prevent token overflow

/**
 * Fetch web page content
 */
const fetchWebPageTool = tool({
  description:
    "Fetches HTML content from a given URL. Use this to retrieve web pages for scraping.",
  inputSchema: z.object({
    url: z.string().url().describe("The URL to fetch"),
  }),
  execute: async (args) => {
    const { url } = args;
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      let html = await response.text();

      // Truncate if too large
      if (html.length > MAX_HTML_LENGTH) {
        html = html.substring(0, MAX_HTML_LENGTH) + "\n[HTML truncated...]";
      }

      return {
        success: true,
        url,
        html,
        length: html.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

/**
 * Extract product data from HTML using AI
 */
const extractProductDataTool = tool({
  description:
    "Extracts structured product information from HTML content using AI. Returns comprehensive product details including name, price, specs, availability, etc.",
  inputSchema: z.object({
    html: z.string().describe("The HTML content to parse"),
    websiteName: z.string().describe("Name of the website being scraped"),
    productQuery: z.string().describe("The product search query for context"),
  }),
  execute: async (args) => {
    const { html, websiteName, productQuery } = args;
    try {
      const extractionPrompt = `You are a product data extraction expert. Analyze the following HTML from ${websiteName} and extract ALL product information.

Search Query: "${productQuery}"

Extract EVERYTHING you can find about the product(s), including but not limited to:
- Product name and full title
- Brand and manufacturer
- Model number/SKU
- Current price (in BDT - look for ৳, Tk, BDT symbols)
- Original price (if discounted)
- Discount percentage
- Availability status (in stock, out of stock, pre-order, etc.)
- All specifications (processor, RAM, storage, display, etc.)
- Features list
- Warranty information
- Product images (URLs)
- Product page URL
- Ratings and reviews
- Seller information
- Shipping details
- Any other relevant details

IMPORTANT:
- Extract prices as numbers only (remove ৳, Tk, BDT, commas)
- If multiple products are found, extract data for the MOST RELEVANT one to the query
- If no products found, return null for productData
- Be thorough - extract A-Z everything available

HTML Content:
${html}

Return a JSON object with this structure:
{
  "productData": {
    "name": "string",
    "brand": "string",
    "model": "string",
    "price": number,
    "originalPrice": number | null,
    "discount": number | null,
    "availability": "in_stock" | "out_of_stock" | "pre_order",
    "specifications": { "key": "value" },
    "features": ["string"],
    "warranty": "string",
    "images": ["url"],
    "productUrl": "string",
    "rating": number | null,
    "reviewCount": number | null,
    "description": "string",
    "additionalDetails": { "key": "value" }
  } | null,
  "websiteName": "${websiteName}",
  "scrapedAt": "${new Date().toISOString()}"
}`;

      const result = await generateText({
        model: google(GEMINI_MODEL),
        prompt: extractionPrompt,
      });

      // Parse AI response
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return {
          success: false,
          error: "Failed to parse AI response",
        };
      }

      const extractedData = JSON.parse(jsonMatch[0]);
      return {
        success: true,
        data: extractedData,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Extraction failed",
      };
    }
  },
});

/**
 * Compare multiple products and provide analysis
 */
const compareProductsTool = tool({
  description:
    "Compares multiple products across different dimensions and provides intelligent analysis and recommendations.",
  inputSchema: z.object({
    products: z
      .array(z.any())
      .describe("Array of product data objects to compare"),
    userQuery: z.string().describe("Original user query for context"),
  }),
  execute: async (args) => {
    const { products, userQuery } = args;
    try {
      const comparisonPrompt = `You are a product comparison expert. Analyze these products and provide a comprehensive comparison.

User Query: "${userQuery}"

Products Data:
${JSON.stringify(products, null, 2)}

Provide a detailed comparison including:
1. Price Analysis:
   - Lowest to highest prices
   - Price differences and savings
   - Best value for money

2. Availability Analysis:
   - Which stores have stock
   - Pre-order vs in-stock options

3. Specifications Comparison:
   - Key differences in specs
   - Performance considerations
   - Feature comparisons

4. Recommendation:
   - Which product/store is best and WHY
   - Consider price, availability, specs, warranty
   - Alternative suggestions

5. Graph-Ready Data:
   - Return array of objects with: websiteName, price, availability, productName

Return a JSON object with this structure:
{
  "priceComparison": {
    "lowest": { "website": "string", "price": number },
    "highest": { "website": "string", "price": number },
    "savings": number
  },
  "availabilityStatus": [
    { "website": "string", "status": "string" }
  ],
  "keyDifferences": ["string"],
  "recommendation": {
    "bestOption": "string",
    "reasoning": "string",
    "alternatives": ["string"]
  },
  "graphData": [
    { "website": "string", "price": number, "availability": "string", "productName": "string" }
  ],
  "summary": "string"
}`;

      const result = await generateText({
        model: google(GEMINI_MODEL),
        prompt: comparisonPrompt,
      });

      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return {
          success: false,
          error: "Failed to parse comparison result",
        };
      }

      const comparison = JSON.parse(jsonMatch[0]);
      return {
        success: true,
        comparison,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Comparison failed",
      };
    }
  },
});

/**
 * Search product across multiple sites using sub-agents
 */
const searchProductAcrossSitesTool = tool({
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
      const subAgentTasks = sitesToSearch.map(async (websiteKey: string) => {
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
            html = html.substring(0, MAX_HTML_LENGTH) + "\n[HTML truncated...]";
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
      });

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

/**
 * Validate user query
 */
function validateQuery(query: string): { valid: boolean; error?: string } {
  if (!query || query.trim().length === 0) {
    return { valid: false, error: "Query cannot be empty" };
  }

  if (query.length < 3) {
    return {
      valid: false,
      error: "Query too short. Please provide more details.",
    };
  }

  if (query.length > 500) {
    return { valid: false, error: "Query too long. Please be more concise." };
  }

  return { valid: true };
}

/**
 * Main AI Agent Options
 */
export interface AgentOptions {
  maxSteps?: number;
  verbose?: boolean;
}

/**
 * Main AI Scraping Agent
 * Orchestrates the entire scraping and comparison workflow
 */
export async function runScrapingAgent(
  userQuery: string,
  options: AgentOptions = {}
) {
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

// Export tools for external use
export {
  compareProductsTool,
  extractProductDataTool,
  fetchWebPageTool,
  searchProductAcrossSitesTool,
};

