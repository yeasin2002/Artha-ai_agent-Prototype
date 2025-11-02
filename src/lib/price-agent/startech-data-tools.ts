import { tool } from "ai";
import { z } from "zod";
import * as cheerio from "cheerio";
import axios from "axios";

// Tool 1: Search products on Star Tech
export const startechSearchTool = tool({
  description:
    "Search for products on Star Tech website and get a list of matching products with name, URL, and price. Returns search results that the AI can analyze to find the best match.",
  inputSchema: z.object({
    query: z.string().describe('The search query (e.g., "AMD Ryzen 7 7700")'),
  }),
  execute: async ({ query }) => {
    try {
      // Construct search URL
      const searchUrl = `https://www.startech.com.bd/product/search?search=${encodeURIComponent(
        query
      )}`;

      // Fetch the search results page
      const response = await axios.get(searchUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      const html = response.data;
      const $ = cheerio.load(html);

      // Find all product items
      const products: Array<{
        name: string;
        url: string;
        price: string;
        oldPrice?: string;
        inStock: boolean;
      }> = [];

      $(".p-item").each((i, element) => {
        const $item = $(element);

        // Extract product name and URL
        const $nameLink = $item.find(".p-item-name a");
        const name = $nameLink.text().trim();
        const url = $nameLink.attr("href") || "";

        // Extract price
        const priceNew = $item.find(".price-new").text().trim();
        const priceOld = $item.find(".price-old").text().trim();

        // Check stock status
        const outOfStock = $item.find(".stock-status").length > 0;

        if (name && url) {
          products.push({
            name,
            url,
            price: priceNew || "Out Of Stock",
            oldPrice: priceOld || undefined,
            inStock: !outOfStock && priceNew !== "",
          });
        }
      });

      return {
        success: true,
        query,
        searchUrl,
        totalResults: products.length,
        products,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: `Failed to fetch search results: ${error.message}`,
        };
      }
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to search products",
      };
    }
  },
});

// Tool 2: Get product details from product page
export const startechProductDetailsTool = tool({
  description:
    "Fetch detailed product information from a Star Tech product page URL. Returns product name, prices, status, brand, and full specifications.",
  inputSchema: z.object({
    url: z.string().url().describe("The Star Tech product page URL"),
  }),
  execute: async ({ url }) => {
    try {
      // Fetch the product page
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      const html = response.data;
      const $ = cheerio.load(html);

      // Extract basic product info
      const productShortInfo = $(".product-short-info");

      if (productShortInfo.length === 0) {
        return {
          success: false,
          error: "Product information section not found on the page",
        };
      }

      const productName = productShortInfo.find(".product-name").text().trim();
      const priceIns = productShortInfo
        .find(".product-price ins")
        .text()
        .trim();
      const priceDel = productShortInfo
        .find(".product-price del")
        .text()
        .trim();
      const regularPrice = productShortInfo
        .find(".product-regular-price")
        .text()
        .trim();
      const status = productShortInfo.find(".product-status").text().trim();
      const productCode = productShortInfo.find(".product-code").text().trim();
      const brand = productShortInfo.find(".product-brand").text().trim();

      // Extract specifications
      const specifications: Record<
        string,
        Array<{ name: string; value: string }>
      > = {};

      $("#specification .data-table").each((i, table) => {
        const $table = $(table);
        let currentSection = "";

        $table.find("tr").each((j, row) => {
          const $row = $(row);

          // Check if this is a heading row
          const heading = $row.find(".heading-row");
          if (heading.length > 0) {
            currentSection = heading.text().trim();
            specifications[currentSection] = [];
          } else {
            // This is a data row
            const name = $row.find(".name").text().trim();
            const value =
              $row
                .find(".value")
                .html()
                ?.replace(/<br\s*\/?>/gi, ", ")
                .trim() || "";
            const cleanValue = $("<div>").html(value).text().trim();

            if (name && currentSection) {
              specifications[currentSection].push({
                name,
                value: cleanValue,
              });
            }
          }
        });
      });

      return {
        success: true,
        url,
        basicInfo: {
          name: productName,
          price: {
            current: priceIns,
            previous: priceDel,
            regular: regularPrice,
          },
          status,
          productCode,
          brand,
        },
        specifications,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: `Failed to fetch product details: ${error.message}`,
        };
      }
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to extract product details",
      };
    }
  },
});

// Example usage with Vercel AI SDK
// import { generateText } from 'ai';
// import { openai } from '@ai-sdk/openai';
//
// const result = await generateText({
//   model: openai('gpt-4-turbo'),
//   tools: {
//     searchProducts: startechSearchTool,
//     getProductDetails: startechProductDetailsTool,
//   },
//   maxSteps: 10,
//   prompt: 'Find me the AMD Ryzen 7 7700 processor and tell me its specifications',
// });
//
// The AI agent will:
// 1. Use searchProducts to find matching products
// 2. Analyze the results to pick the best match
// 3. Use getProductDetails with the selected product URL
// 4. Return comprehensive product information
