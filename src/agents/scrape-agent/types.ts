/**
 * Type definitions for the AI agent
 */

export interface AgentOptions {
  maxSteps?: number;
  verbose?: boolean;
}

export interface QueryValidation {
  valid: boolean;
  error?: string;
}

export interface SubAgentResult {
  website: string;
  websiteName: string;
  success: boolean;
  data?: any;
  error?: any;
}

export interface AgentResponse {
  success: boolean;
  response: string;
  error?: string;
  steps?: any[];
  usage?: any;
}
