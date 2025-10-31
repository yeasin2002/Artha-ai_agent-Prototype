/**
 * Agent Configuration
 */

export const GEMINI_MODEL =
  process.env.GEMINI_MODEL || "gemini-2.0-flash-thinking-exp-1219";

export const MAX_HTML_LENGTH = 50000; // Truncate HTML to prevent token overflow
