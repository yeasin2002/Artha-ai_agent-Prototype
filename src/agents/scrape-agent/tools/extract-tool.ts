/**
 * Extract Product Data Tool
 * Uses AI to extract structured product information from HTML
 */

import { google } from "@ai-sdk/google";
import { generateText, tool } from "ai";
import { z } from "zod";
import { GEMINI_MODEL } from "../config.js";

export const extractProductDataTool = tool({
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
