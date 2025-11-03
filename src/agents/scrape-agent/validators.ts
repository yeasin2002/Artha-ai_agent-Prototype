/**
 * Query validation utilities
 */

import type { QueryValidation } from "./types.js";

/**
 * Validate user query
 */
export function validateQuery(query: string): QueryValidation {
  if (!query || query.trim().length === 0) {
    return { valid: false, error: "Query cannot be empty" };
  }

  if (query.length < 3) {
    return {
      valid: false,
      error: "Query too short. Please provide more details.",
    };
  }

  if (query.length > 500) {
    return { valid: false, error: "Query too long. Please be more concise." };
  }

  return { valid: true };
}
