---
inclusion: always
---

# Project Structure

## Directory Layout

```
tsdown-starter/
├── doc/                    # all kiro and my doc about the project
├── src/                    # Source code
│   ├── index.ts           # Main entry point with usage examples
│   └── lib/               # Core library code
│       ├── ai-agent.ts    # Main AI agent orchestrator with tools
├── dist/                  # Build output (generated)
├── .kiro/                 # Kiro IDE configuration
│   └── steering/          # AI assistant steering rules
├── .env.example           # Environment variable template
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tsdown.config.ts       # Build configuration
├── README.md              # Project documentation
├── SUPPORTED_WEBSITES.md  # Website configuration reference
└── project-details.md     # Detailed project requirements
```

## Architecture Patterns

### Multi-Agent Architecture

The system uses a hierarchical multi-agent pattern with a main orchestrator and specialized sub-agents:

1. **Main Agent** (`runScrapingAgent`):
   - Receives and validates user queries
   - Plans execution strategy
   - Coordinates sub-agents
   - Aggregates and analyzes results
   - Generates final recommendations

2. **Sub-Agents** (parallel execution with node concurrently):
   - Agent 1: Extracts data from Site A
   - Agent 2: Extracts data from Site B
   - Agent 3: Extracts data from Site C
   - Each runs independently using Fetch Tool
   - Results merged by main agent

### Tool-Based Architecture

The core agent (`src/lib/ai-agent.ts`) follows a tool-based architecture:

1. **Tools**: Modular functions that the AI can call
   - `fetchWebPageTool`: HTTP fetching with user-agent headers
   - `extractProductDataTool`: AI-powered HTML parsing and data extraction
   - `compareProductsTool`: Multi-dimensional product analysis
   - `searchProductAcrossSitesTool`: Multi-site orchestration tool

2. **Agent Function**: `runScrapingAgent(userQuery, options)`
   - Takes natural language queries (English/Bengali)
   - Validates query format
   - Uses Gemini AI with tool calling (maxSteps configurable)
   - Returns structured responses with analysis
   - Options: `maxSteps` (default: 10), `verbose` (default: true)

3. **Tool Definition Pattern**:
   ```typescript
   const toolName = tool({
     description: "What the tool does",
     parameters: z.object({ /* zod schema */ }),
     execute: async ({ params }) => { /* implementation */ }
   });
   ```

### Workflow Pattern

```
User Query → Validation → Planning → Sub-Agent Execution (Parallel) → 
Data Aggregation → Analysis → Comparison → Recommendation → Response
```

Key workflow characteristics:
- Query validation before execution
- Parallel sub-agent execution for speed
- Comprehensive product detail extraction (A-Z)
- Graph-ready output format (array of objects)
- Error recovery and retry mechanisms

### Code Organization

- **Entry point** (`src/index.ts`): Usage examples and demonstrations
- **Library code** (`src/lib/`): Reusable agent implementation
  - `ai-agent.ts`: Main orchestrator and tools
  - `website-config.ts`: Website URL patterns and configurations
- **Tests** (`tests/`): Vitest test files matching `*.test.ts` pattern
- **Configuration**: Root-level config files for build and TypeScript
- **Documentation**: README, SUPPORTED_WEBSITES, project-details

## Module System

- **Type**: ESM (ES Modules)
- **Resolution**: Bundler mode for modern import resolution
- **Exports**: Main entry at `./dist/index.js` with TypeScript declarations
- **Path Aliases**: `@` resolves to `./src`

## File Naming Conventions

- Source files: `kebab-case.ts` or `camelCase.ts`
- Test files: `*.test.ts` suffix
- Config files: `*.config.ts` suffix
- Type declarations: Auto-generated in `dist/`
- Documentation: `UPPERCASE.md` or `kebab-case.md`
