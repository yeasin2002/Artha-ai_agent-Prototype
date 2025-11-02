import { generateText, stepCountIs } from "ai";

import { google } from "@ai-sdk/google";
import {
  startechProductDetailsTool,
  startechSearchTool,
} from "./startech-data-tools";

export const priceAgent = async (query?: string) => {
  try {
    const result = await generateText({
      model: google("gemini-2.5-flash"),
      stopWhen: stepCountIs(3),
      prompt: `Price and  Specification  of  AMD Ryzen 7 7700 Gaming Processor in startech?`,
      tools: {
        searchProducts: startechSearchTool,
        getProductDetails: startechProductDetailsTool,
      },
      // tools: { startechProductTool: startechProductTool },
    });

    console.log("token used: ", result.usage.totalTokens);
    return result.text;
  } catch (error) {
    console.log("Search Agent error", error);
    return;
  }
};

// here is the link: https://www.startech.com.bd/amd-ryzen-7-7700-processor