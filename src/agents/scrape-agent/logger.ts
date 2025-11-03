/**
 * Winston Logger Configuration
 * Provides detailed logging for agent operations
 */

import path from "path";
import winston from "winston";

// Create logs directory path
const logsDir = path.join(process.cwd(), "logs");

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += `\n${JSON.stringify(meta, null, 2)}`;
    }
    return msg;
  })
);

// Custom format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create the logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: fileFormat,
  transports: [
    // Console transport
    new winston.transports.Console({
      format: consoleFormat,
      level: "debug",
    }),
    // Error log file
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Combined log file
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Sub-agent specific log
    new winston.transports.File({
      filename: path.join(logsDir, "sub-agents.log"),
      level: "debug",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, "exceptions.log"),
    }),
  ],
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, "rejections.log"),
    }),
  ],
});

// Create child logger for sub-agents
export const createSubAgentLogger = (websiteKey: string) => {
  return logger.child({
    component: "sub-agent",
    website: websiteKey,
  });
};

// Export convenience methods
export const logSubAgentStart = (websiteKey: string, searchUrl: string) => {
  logger.info(`Sub-Agent ${websiteKey}: Starting`, {
    website: websiteKey,
    searchUrl,
    timestamp: new Date().toISOString(),
  });
};

export const logSubAgentSuccess = (
  websiteKey: string,
  dataPreview: string
) => {
  logger.info(`Sub-Agent ${websiteKey}: Data extracted successfully`, {
    website: websiteKey,
    dataPreview,
    timestamp: new Date().toISOString(),
  });
};

export const logSubAgentError = (
  websiteKey: string,
  error: Error | string,
  context?: Record<string, any>
) => {
  const errorMessage = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : undefined;

  logger.error(`Sub-Agent ${websiteKey}: Failed`, {
    website: websiteKey,
    error: errorMessage,
    stack: errorStack,
    context,
    timestamp: new Date().toISOString(),
  });
};

export const logSubAgentWarning = (
  websiteKey: string,
  message: string,
  context?: Record<string, any>
) => {
  logger.warn(`Sub-Agent ${websiteKey}: ${message}`, {
    website: websiteKey,
    context,
    timestamp: new Date().toISOString(),
  });
};
