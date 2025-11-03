# AI Agent System - Modular Architecture

This directory contains the refactored, modular implementation of the AI Web Scraping Agent.

## Directory Structure

```
agents/
├── config.ts              # Configuration constants
├── types.ts               # TypeScript type definitions
├── validators.ts          # Query validation utilities
├── main-agent.ts          # Main orchestrator agent
├── index.ts               # Module exports
└── tools/                 # Agent tools
    ├── fetch-tool.ts      # Web page fetching
    ├── extract-tool.ts    # Product data extraction
    ├── compare-tool.ts    # Product comparison
    ├── search-tool.ts     # Multi-site search orchestration
    └── index.ts           # Tools exports
```

## File Descriptions

### Core Files

#### `config.ts`

- Contains configuration constants
- `GEMINI_MODEL`: AI model identifier
- `MAX_HTML_LENGTH`: HTML truncation limit

#### `types.ts`

- TypeScript type definitions
- `AgentOptions`: Configuration options for the agent
- `AgentResponse`: Response structure from the agent
- `SubAgentResult`: Result from individual sub-agents
- `QueryValidation`: Query validation result

#### `validators.ts`

- Query validation logic
- `validateQuery()`: Validates user input queries

#### `main-agent.ts`

- Main orchestrator agent
- `runScrapingAgent()`: Primary entry point
- Coordinates all tools and sub-agents
- Handles the complete workflow

### Tools Directory

#### `fetch-tool.ts`

- **Purpose**: Fetches HTML content from URLs
- **Tool**: `fetchWebPageTool`
- **Features**:
  - Custom user-agent headers
  - HTML truncation for large pages
  - Error handling

#### `extract-tool.ts`

- **Purpose**: Extracts structured product data from HTML
- **Tool**: `extractProductDataTool`
- **Features**:
  - AI-powered extraction
  - Comprehensive product details (A-Z)
  - JSON response parsing

#### `compare-tool.ts`

- **Purpose**: Compares multiple products
- **Tool**: `compareProductsTool`
- **Features**:
  - Price analysis
  - Availability comparison
  - Specification differences
  - Intelligent recommendations
  - Graph-ready data output

#### `search-tool.ts`

- **Purpose**: Orchestrates multi-site product search
- **Tool**: `searchProductAcrossSitesTool`
- **Features**:
  - Parallel sub-agent deployment
  - One sub-agent per website
  - Aggregates results
  - Error recovery

## Usage

### Import the Main Agent

```typescript
import { runScrapingAgent } from "./agents/index.js";

const result = await runScrapingAgent("Find RTX 4070 prices", {
  maxSteps: 15,
  verbose: true,
});
```

### Import Individual Tools

```typescript
import {
  fetchWebPageTool,
  extractProductDataTool,
  compareProductsTool,
  searchProductAcrossSitesTool,
} from "./agents/tools/index.js";
```

### Import Types

```typescript
import type { AgentOptions, AgentResponse } from "./agents/types.js";
```

## Benefits of This Structure

### 1. **Modularity**

- Each tool is in its own file
- Easy to understand and maintain
- Clear separation of concerns

### 2. **Reusability**

- Tools can be imported individually
- Can be used in different contexts
- Easy to test in isolation

### 3. **Scalability**

- Easy to add new tools
- Simple to extend functionality
- Clear structure for new features

### 4. **Maintainability**

- Smaller, focused files
- Easier to debug
- Clear dependencies

### 5. **Type Safety**

- Centralized type definitions
- Consistent interfaces
- Better IDE support

## Adding New Tools

To add a new tool:

1. Create a new file in `tools/` directory:

```typescript
// tools/my-new-tool.ts
import { tool } from "ai";
import { z } from "zod";

export const myNewTool = tool({
  description: "What this tool does",
  inputSchema: z.object({
    param: z.string().describe("Parameter description"),
  }),
  execute: async (args) => {
    // Implementation
    return { success: true, data: "result" };
  },
});
```

2. Export it from `tools/index.ts`:

```typescript
export { myNewTool } from "./my-new-tool.js";
```

3. Add it to `main-agent.ts` tools object:

```typescript
tools: {
  // ... existing tools
  myNewTool: myNewTool,
}
```

## Testing

All existing tests work without modification due to backward compatibility exports in `src/lib/ai-agent.ts`.

```bash
# Run tests
npm run test

# Type check
npm run typecheck

# Build
npm run build
```

## Backward Compatibility

The original `src/lib/ai-agent.ts` now re-exports everything from this modular structure, ensuring existing code continues to work:

```typescript
// Old import (still works)
import { runScrapingAgent } from "./lib/ai-agent.js";

// New import (recommended)
import { runScrapingAgent } from "./lib/agents/index.js";
```

## Architecture Flow

```
User Query
    ↓
main-agent.ts (Orchestrator)
    ↓
Tools (Parallel Execution)
    ├─ searchProductAcrossSitesTool
    │   ├─ Sub-Agent 1 (Startech)
    │   ├─ Sub-Agent 2 (Techland)
    │   ├─ Sub-Agent 3 (Ryans)
    │   └─ ... (more sites)
    ├─ compareProductsTool
    └─ extractProductDataTool
    ↓
Aggregated Results
    ↓
AI-Generated Response
```

## Configuration

Edit `config.ts` to change:

- AI model
- HTML truncation limits
- Other constants

## Type Definitions

All types are in `types.ts` for easy reference and modification.

---

**Status**: ✅ Fully functional and tested
**Compatibility**: ✅ Backward compatible with existing code
