---
inclusion: always
---

# Project Structure

## Directory Layout

```
tsdown-starter/
├── src/                    # Source code
│   ├── index.ts           # Main entry point with usage examples
│   └── lib/               # Core library code
│       └── ai-agent.ts    # AI agent implementation with tools
├── tests/                 # Test files
│   └── index.test.ts      # Unit tests
├── dist/                  # Build output (generated)
├── .kiro/                 # Kiro IDE configuration
│   └── steering/          # AI assistant steering rules
├── .env.example           # Environment variable template
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── tsdown.config.ts       # Build configuration
```

## Architecture Patterns

### AI Agent Pattern

The core agent (`src/lib/ai-agent.ts`) follows a tool-based architecture:

1. **Tools**: Modular functions that the AI can call

   - `fetchWebPageTool`: HTTP fetching with headers
   - `extractProductDataTool`: AI-powered HTML parsing
   - `compareProductsTool`: Multi-product analysis
   - `searchProductAcrossSitesTool`: Orchestration tool

2. **Agent Function**: `runScrapingAgent()`

   - Takes natural language queries
   - Uses Gemini AI with tool calling
   - Returns structured responses with analysis

3. **Tool Definition Pattern**:
   ```typescript
   const toolName = tool({
     description: "What the tool does",
     parameters: z.object({
       /* zod schema */
     }),
     execute: async ({ params }) => {
       /* implementation */
     },
   });
   ```

### Code Organization

- **Entry point** (`src/index.ts`): Usage examples and demonstrations
- **Library code** (`src/lib/`): Reusable agent implementation
- **Tests** (`tests/`): Vitest test files matching `*.test.ts` pattern
- **Configuration**: Root-level config files for build and TypeScript

## Module System

- **Type**: ESM (ES Modules)
- **Resolution**: Bundler mode for modern import resolution
- **Exports**: Main entry at `./dist/index.js` with TypeScript declarations
- **Path Aliases**: `@` resolves to `./src`

## File Naming Conventions

- Source files: `kebab-case.ts` or `camelCase.ts`
- Config files: `*.config.ts` suffix
- Type declarations: Auto-generated in `dist/`
