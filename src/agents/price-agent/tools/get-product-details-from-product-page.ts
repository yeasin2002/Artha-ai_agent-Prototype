import { BROWSER_USER_AGENT } from "@/config";
import { tool } from "ai";
import axios from "axios";
import * as cheerio from "cheerio";
import { z } from "zod";

// Tool 2: get-product-details-from-product-page
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
        headers: { "User-Agent": BROWSER_USER_AGENT },
      });

      const html = response.data;
      const $ = cheerio.load(html);

      // Extract basic product info
      const productShortInfo = $(".product-short-info");
      const description = $("#description .full-description").text().trim();

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

      // console.log(chalk.bgGreen.red("🚀 ~ specifications: \n"), specifications);
      console.log({
        current: priceIns,
        previous: priceDel,
        regular: regularPrice,
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
        description,
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
