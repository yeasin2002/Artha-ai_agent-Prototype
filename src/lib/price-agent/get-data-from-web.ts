import { tool } from "ai";
import axios from "axios";
import chalk from "chalk";
import * as cheerio from "cheerio";
import { z } from "zod";

export const startechProductTool = tool({
  description:
    "Fetch and extract product information from Star Tech website URL. Provides product name, price, regular price, status, product code, and brand.",
  inputSchema: z.object({
    url: z
      .string()
      .url()
      .describe(
        "The Star Tech product page URL (e.g., https://www.startech.com.bd/...)"
      ),
  }),
  execute: async ({ url }) => {
    try {
      // Fetch the HTML from the URL
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      const html = response.data;
      const $ = cheerio.load(html);

      // Find and extract only the product-short-info section
      const productShortInfo = $(".product-short-info");

      if (productShortInfo.length === 0) {
        return {
          success: false,
          error: "Product information section not found on the page",
        };
      }

      // Extract product information from the specific section
      const productName = productShortInfo.find(".product-name").text().trim();

      // Extract prices
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

      // Structure the data
      const productInfo = {
        name: productName,
        price: {
          current: priceIns,
          previous: priceDel,
          regular: regularPrice,
        },
        status: status,
        productCode: productCode,
        brand: brand,
      };
      console.log(chalk.bgGreen("Product information extracted:"), productInfo);

      return {
        success: true,
        data: productInfo,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to extract product information",
      };
    }
  },
});
