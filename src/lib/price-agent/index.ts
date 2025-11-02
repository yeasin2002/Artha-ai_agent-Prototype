import { generateText, stepCountIs } from "ai";

import { google } from "@ai-sdk/google";
import { startechProductTool } from "./get-data-from-web";

export const priceAgent = async (query?: string) => {
  try {
    const result = await generateText({
      model: google("gemini-2.5-flash"),
      stopWhen: stepCountIs(3),
      prompt: `What are the Specification  of  AMD Ryzen 7 7700 Gaming Processor in startech?
        here is the link: https://www.startech.com.bd/amd-ryzen-7-7700-processor
        `,
      // tools: { startechProductTool: startechProductTool },
    });
    console.log("token used: ", result.usage.totalTokens);
    return result.text;
  } catch (error) {
    console.log("Search Agent error", error);
    return;
  }
};
