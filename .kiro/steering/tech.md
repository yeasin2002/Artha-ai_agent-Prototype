---
inclusion: always
---

# Technology Stack

## Runtime Requirements

- **Node.js**: 20+ (minimum version)
- **Package Manager**: npm, yarn, or pnpm
- **Runtime Support**: Both Bun and Node.js environments

## Build System

- **tsdown**: Modern TypeScript bundler for building the package
- **TypeScript 5.9+**: Strict mode enabled with full type safety
- **Target**: ESNext with ES2023 lib support

## Core Dependencies

- **Vercel AI SDK** (`ai`): Agentic AI framework with tool calling and multi-agent orchestration
- **@ai-sdk/google**: Google Gemini AI integration
- **@google/generative-ai**: Direct Gemini API access
- **Gemini 2.0 Flash**: Primary LLM model for fast, efficient responses
- **Zod**: Schema validation for tool parameters and data structures
- **Cheerio**: HTML parsing library (available but not actively used - AI does the parsing)
- **tsx**: TypeScript execution for development

## Development Tools

- **Vitest**: Testing framework for unit tests
- **bumpp**: Version management and release automation
- **TypeScript**: Type checking and declaration generation

## Common Commands

```bash
# Development
npm run dev          # Watch mode with tsdown
npm run dev:t        # Run with tsx (TypeScript execution)
npm run dev:b        # Run with bun (faster runtime)

# Building
npm run build        # Build production bundle with tsdown

# Testing
npm run test         # Run tests with vitest

# Type Checking
npm run typecheck    # TypeScript type checking without emit

# Running
npm start            # Run built output from dist/
```

## Environment Variables

Required:
- `GOOGLE_GENERATIVE_AI_API_KEY`: Gemini API key from Google AI Studio (get from https://makersuite.google.com/app/apikey)

Optional:
- `GEMINI_MODEL`: Custom model selection (default: gemini-2.0-flash-exp)

## Build Configuration

- **Entry**: `src/**/*.ts` (all TypeScript files)
- **Output**: `dist/` directory
- **Minification**: Enabled for production
- **Source maps**: Enabled for declarations
- **Module system**: ESM with bundler resolution
- **Path alias**: `@` maps to `./src`
- **Declaration**: Auto-generated TypeScript declarations

## Performance Considerations

- **HTML Truncation**: Automatically limits HTML to 50k characters to prevent token overflow
- **Parallel Execution**: Sub-agents run simultaneously for faster data extraction
- **Caching**: Results cached for repeated queries (target 80%+ cache hit rate)
- **Rate Limiting**: Respects robots.txt and implements delays between requests
- **Timeout**: Target 30 seconds per site, 60 seconds total for multi-site comparison
