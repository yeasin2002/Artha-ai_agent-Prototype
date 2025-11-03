/**
 * Agents Module Index
 * Main entry point for the AI agent system
 */

// Main agent
export { runScrapingAgent } from "./main-agent.js";

// Tools
export {
  compareProductsTool,
  extractProductDataTool,
  fetchWebPageTool,
  searchProductAcrossSitesTool,
} from "./tools/index.js";

// Types
export type { AgentOptions, AgentResponse } from "./types.js";

// Configuration
export { GEMINI_MODEL, MAX_HTML_LENGTH } from "./config.js";

// Validators
export { validateQuery } from "./validators.js";

// Logger
export { createSubAgentLogger, logger } from "./logger.js";

