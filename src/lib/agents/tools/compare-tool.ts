/**
 * Compare Products Tool
 * Analyzes and compares multiple products
 */

import { google } from "@ai-sdk/google";
import { generateText, tool } from "ai";
import { z } from "zod";
import { GEMINI_MODEL } from "../config.js";

export const compareProductsTool = tool({
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
