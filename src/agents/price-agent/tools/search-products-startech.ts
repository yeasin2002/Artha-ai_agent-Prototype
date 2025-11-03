import { BROWSER_USER_AGENT } from "@/config";
import { tool } from "ai";
import axios from "axios";
import * as cheerio from "cheerio";
import { z } from "zod";

// Tool 1: search products on star tech
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
        headers: { "User-Agent": BROWSER_USER_AGENT },
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
