/**
 * AI Web Scraping Agent with Multi-Agent Support
 * Built with Vercel AI SDK and Google Gemini
 * 
 * This file re-exports the modular agent system for backward compatibility.
 * The actual implementation is in the ./agents/ directory.
 */

export {
    GEMINI_MODEL,
    MAX_HTML_LENGTH, compareProductsTool, extractProductDataTool, fetchWebPageTool, runScrapingAgent, searchProductAcrossSitesTool,
    validateQuery
} from "./agents/index.js";

export type { AgentOptions, AgentResponse } from "./agents/index.js";
