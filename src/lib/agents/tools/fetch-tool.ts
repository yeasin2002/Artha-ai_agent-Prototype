/**
 * Fetch Web Page Tool
 * Fetches HTML content from URLs
 */

import { tool } from "ai";
import { z } from "zod";
import { MAX_HTML_LENGTH } from "../config.js";

export const fetchWebPageTool = tool({
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
