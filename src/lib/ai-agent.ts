import { google } from "@ai-sdk/google";
import { generateText, tool } from "ai";
import { z } from "zod";

/**
 * AI AGENT FOR WEB SCRAPING AND PRODUCT COMPARISON
 *
 * This agent uses Gemini AI to autonomously scrape product data from e-commerce websites
 * and compare products across multiple sites without using traditional scraping tools.
 *
 * Features:
 * - Fetch web pages dynamically
 * - Extract product information using AI
 * - Compare products across multiple sites
 * - Smart data analysis and recommendations
 */

// ============================================================================
// TOOL 1: FETCH WEB PAGE
// ============================================================================
/**
 * Fetches the HTML content of a web page
 * This tool allows the AI agent to retrieve raw HTML from any URL
 */
const fetchWebPageTool = tool({
  description: `Fetches the HTML content from a given URL. Use this tool to retrieve web pages 
  that you need to analyze or extract data from. Returns the raw HTML content.`,
  parameters: z.object({
    url: z.string().url().describe("The complete URL to fetch"),
    userAgent: z.string().optional().describe("Optional user agent string"),
  }),
  execute: async ({ url, userAgent }) => {
    try {
      console.log(`🌐 Fetching: ${url}`);

      const response = await fetch(url, {
        headers: {
          "User-Agent":
            userAgent ||
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();

      // Limit HTML size to prevent token overflow (first 50k chars should be enough)
      const truncatedHtml = html.slice(0, 50000);

      return {
        success: true,
        url,
        html: truncatedHtml,
        contentLength: html.length,
        truncated: html.length > 50000,
      };
    } catch (error) {
      console.error(`❌ Error fetching ${url}:`, error);
      return {
        success: false,
        url,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

// ============================================================================
// TOOL 2: EXTRACT PRODUCT DATA
// ============================================================================
/**
 * Extracts structured product information from HTML content
 * The AI analyzes the HTML and extracts relevant product details
 */
const extractProductDataTool = tool({
  description: `Analyzes HTML content and extracts structured product information. 
  Use this after fetching a product page to get details like name, price, specifications, 
  availability, images, etc. Returns structured product data.`,
  parameters: z.object({
    html: z.string().describe("The HTML content to analyze"),
    productQuery: z
      .string()
      .describe('What product to look for (e.g., "Intel Core i7-13700K")'),
    websiteName: z
      .string()
      .describe('Name of the website (e.g., "Startech", "Ryans")'),
  }),
  execute: async ({ html, productQuery, websiteName }) => {
    try {
      console.log(
        `🔍 Extracting product data for: ${productQuery} from ${websiteName}`
      );

      // Use AI to extract product information from HTML
      const extractionResult = await generateText({
        model: google("gemini-2.0-flash-exp"),
        prompt: `You are a web scraping expert. Analyze the following HTML and extract ALL product information related to "${productQuery}".

IMPORTANT INSTRUCTIONS:
1. Find the product that matches or is most similar to "${productQuery}"
2. Extract ALL available information in a structured format
3. Look for: product name, price (in BDT), SKU, availability, specifications, features, warranty, images
4. Pay special attention to prices - extract both regular price and any discounted prices
5. For specifications, extract as much technical detail as possible
6. If you find multiple products, extract data for the most relevant one
7. Return data in valid JSON format only, no additional text

HTML Content (from ${websiteName}):
${html}

Return ONLY a JSON object with this structure:
{
  "found": true/false,
  "productName": "exact product name",
  "price": "price in numbers only",
  "currency": "BDT",
  "originalPrice": "if there's a discount",
  "availability": "in stock/out of stock/pre-order",
  "sku": "product SKU/model",
  "url": "product URL if available",
  "images": ["image URLs"],
  "specifications": {
    "key": "value pairs of all specs"
  },
  "features": ["list of features"],
  "warranty": "warranty information",
  "brand": "brand name",
  "category": "product category"
}`,
      });

      // Parse the AI's response
      let productData;
      try {
        // Try to extract JSON from the response
        const jsonMatch = extractionResult.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          productData = JSON.parse(jsonMatch[0]);
        } else {
          productData = JSON.parse(extractionResult.text);
        }
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", parseError);
        productData = {
          found: false,
          error: "Failed to parse extracted data",
          rawResponse: extractionResult.text,
        };
      }

      return {
        success: true,
        website: websiteName,
        query: productQuery,
        data: productData,
      };
    } catch (error) {
      console.error(`❌ Error extracting product data:`, error);
      return {
        success: false,
        website: websiteName,
        query: productQuery,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

// ============================================================================
// TOOL 3: COMPARE PRODUCTS
// ============================================================================
/**
 * Compares product data from multiple sources and provides analysis
 * Uses AI to generate intelligent comparisons and recommendations
 */
const compareProductsTool = tool({
  description: `Compares multiple product entries and provides detailed analysis including 
  price comparison, feature differences, best value recommendation, and shopping advice. 
  Use this after collecting product data from multiple sources.`,
  parameters: z.object({
    products: z
      .array(z.any())
      .describe("Array of product data objects to compare"),
    userPreferences: z
      .string()
      .optional()
      .describe("Any specific user preferences or priorities"),
  }),
  execute: async ({ products, userPreferences }) => {
    try {
      console.log(`📊 Comparing ${products.length} products...`);

      // Use AI to generate intelligent comparison
      const comparisonResult = await generateText({
        model: google("gemini-2.0-flash-exp"),
        prompt: `You are a shopping advisor AI. Compare these products and provide detailed analysis.

Products to compare:
${JSON.stringify(products, null, 2)}

User preferences: ${userPreferences || "Best value for money"}

Provide a comprehensive comparison including:
1. Price comparison (lowest to highest, calculate savings)
2. Availability status across stores
3. Specification differences (if any)
4. Warranty comparison
5. Overall recommendation with reasoning
6. Pros and cons for each option
7. Best deal identification

Return your analysis in a clear, structured format.`,
      });

      // Extract price comparison data
      const priceData = products
        .filter((p: any) => p.data?.found && p.data?.price)
        .map((p: any) => ({
          website: p.website,
          price: parseFloat(p.data.price),
          availability: p.data.availability,
          productName: p.data.productName,
        }))
        .sort((a: any, b: any) => a.price - b.price);

      const lowestPrice = priceData.length > 0 ? priceData[0] : null;
      const highestPrice =
        priceData.length > 0 ? priceData[priceData.length - 1] : null;
      const priceDifference =
        lowestPrice && highestPrice
          ? highestPrice.price - lowestPrice.price
          : 0;

      return {
        success: true,
        totalProducts: products.length,
        foundProducts: products.filter((p: any) => p.data?.found).length,
        priceComparison: {
          lowest: lowestPrice,
          highest: highestPrice,
          potentialSavings: priceDifference,
          currency: "BDT",
        },
        detailedAnalysis: comparisonResult.text,
        products: products,
      };
    } catch (error) {
      console.error(`❌ Error comparing products:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

// ============================================================================
// TOOL 4: SEARCH PRODUCT ACROSS SITES
// ============================================================================
/**
 * Searches for a product across multiple e-commerce sites
 * Orchestrates the fetching and extraction process
 */
const searchProductAcrossSitesTool = tool({
  description: `Searches for a specific product across multiple e-commerce websites. 
  This is a high-level tool that coordinates fetching and extracting product data 
  from multiple sites automatically. Returns aggregated results.`,
  parameters: z.object({
    productName: z.string().describe("The product name or model to search for"),
    websites: z
      .array(
        z.object({
          name: z.string(),
          searchUrl: z.string().url(),
        })
      )
      .describe("Array of websites with their search URLs"),
  }),
  execute: async ({ productName, websites }) => {
    console.log(
      `🔎 Searching for "${productName}" across ${websites.length} websites...`
    );

    const results = [];

    for (const site of websites) {
      try {
        // Fetch the page
        const fetchResult = await fetchWebPageTool.execute({
          url: site.searchUrl,
        });

        if (fetchResult.success && fetchResult.html) {
          // Extract product data
          const extractResult = await extractProductDataTool.execute({
            html: fetchResult.html,
            productQuery: productName,
            websiteName: site.name,
          });

          results.push({
            website: site.name,
            url: site.searchUrl,
            ...extractResult,
          });
        } else {
          results.push({
            website: site.name,
            url: site.searchUrl,
            success: false,
            error: fetchResult.error || "Failed to fetch page",
          });
        }
      } catch (error) {
        results.push({
          website: site.name,
          url: site.searchUrl,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return {
      success: true,
      query: productName,
      totalSites: websites.length,
      results,
    };
  },
});

// ============================================================================
// MAIN AI AGENT
// ============================================================================
/**
 * The main AI agent that orchestrates web scraping and product comparison
 *
 * @param userQuery - Natural language query from the user
 * @param options - Optional configuration
 * @returns AI-generated response with product data and comparison
 */
export async function runScrapingAgent(
  userQuery: string,
  options: {
    maxSteps?: number;
    verbose?: boolean;
  } = {}
) {
  const { maxSteps = 10, verbose = true } = options;

  if (verbose) {
    console.log("🤖 AI Scraping Agent Starting...");
    console.log("📝 User Query:", userQuery);
    console.log("━".repeat(80));
  }

  try {
    // Run the agent with all available tools
    const result = await generateText({
      model: google("gemini-2.0-flash-exp"),
      maxSteps,
      tools: {
        fetchWebPage: fetchWebPageTool,
        extractProductData: extractProductDataTool,
        compareProducts: compareProductsTool,
        searchProductAcrossSites: searchProductAcrossSitesTool,
      },
      system: `You are an expert AI shopping assistant and web scraping agent. Your job is to help users find and compare products across multiple e-commerce websites in Bangladesh.

AVAILABLE WEBSITES:
1. Startech (startech.com.bd) - Major tech retailer
2. Techland (techlandbd.com) - Electronics store
3. Ryans (ryans.com) - Computer and tech products

YOUR CAPABILITIES:
- Fetch web pages from any URL
- Extract product information from HTML
- Compare products across multiple sites
- Provide shopping recommendations

WORKFLOW:
1. Understand what product the user wants to find/compare
2. Construct appropriate search or product page URLs for each website
3. Use fetchWebPage to get HTML content
4. Use extractProductData to parse product information
5. Use compareProducts to analyze and recommend the best option
6. Present clear, actionable results to the user

IMPORTANT GUIDELINES:
- Always check multiple websites for better comparison
- Look for the exact product model when possible
- Pay attention to prices, availability, and warranty
- Provide clear price comparisons and savings calculations
- Give honest recommendations based on data
- If a product is not found on a site, mention it clearly
- Format prices in BDT (Bangladeshi Taka)

Be thorough, accurate, and helpful in your analysis.`,
      prompt: userQuery,
    });

    if (verbose) {
      console.log("━".repeat(80));
      console.log("✅ Agent Execution Complete");
      console.log(`📊 Steps taken: ${result.steps?.length || 0}`);
    }

    return {
      success: true,
      response: result.text,
      steps: result.steps,
      toolCalls: result.steps?.reduce((acc, step) => {
        return acc + (step.toolCalls?.length || 0);
      }, 0),
    };
  } catch (error) {
    console.error("❌ Agent Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ============================================================================
// EXAMPLE USAGE
// ============================================================================
/**
 * Example: How to use the AI agent
 */
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

// Uncomment to run examples
// main().catch(console.error);

// Export for use in other files
export {
  compareProductsTool,
  extractProductDataTool,
  fetchWebPageTool,
  searchProductAcrossSitesTool,
};
