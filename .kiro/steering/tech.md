---
inclusion: always
---

# Technology Stack

## Build System

- **tsdown**: Modern TypeScript bundler for building the package
- **TypeScript 5.9+**: Strict mode enabled with full type safety
- **Bun/Node.js**: Runtime support for both environments

## Core Dependencies

- **Vercel AI SDK** (`ai`): Agentic AI framework with tool calling
- **@ai-sdk/google**: Google Gemini AI integration
- **@google/generative-ai**: Direct Gemini API access
- **Zod**: Schema validation for tool parameters
- **Cheerio**: HTML parsing (available but not actively used - AI does the parsing)
- **tsx**: TypeScript execution for development

## Development Tools

- **Vitest**: Testing framework
- **bumpp**: Version management
- **TypeScript**: Type checking and declaration generation

## Common Commands

```bash
# Development
npm run dev          # Watch mode with tsdown
npm run dev:t        # Run with tsx
npm run dev:b        # Run with bun

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

- `GOOGLE_GENERATIVE_AI_API_KEY`: Gemini API key from Google AI Studio

Optional:

- `GEMINI_MODEL`: Custom model selection (default: gemini-2.0-flash-exp)

## Build Configuration

- **Entry**: `src/**/*.ts` (all TypeScript files)
- **Output**: `dist/` directory
- **Minification**: Enabled
- **Source maps**: Enabled for declarations
- **Module system**: ESM with bundler resolution
- **Path alias**: `@` maps to `./src`
