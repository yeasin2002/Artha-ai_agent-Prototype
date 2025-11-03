import { generateText, stepCountIs } from "ai";

import chalk from "chalk";
import { AI_MODEL_NAME } from "../../config";
import { startechProductDetailsTool, startechSearchTool } from "./tools";

export const priceAgent = async (query: string) => {
  try {
    const result = await generateText({
      model: AI_MODEL_NAME,
      stopWhen: stepCountIs(3),
      prompt: query,
      tools: {
        searchProducts: startechSearchTool,
        getProductDetails: startechProductDetailsTool,
      },
    });

    console.log(chalk.white("token used: "), result.usage.totalTokens);
    return result.text;
  } catch (error) {
    console.log("Search Agent error", error);
    return;
  }
};

// here is the link: https://www.startech.com.bd/amd-ryzen-7-7700-processor
// tools: { startechProductTool: startechProductTool },