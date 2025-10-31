# 🚀 Quick Start Guide

Get your AI Web Scraping Agent up and running in 5 minutes!

## Prerequisites

- Node.js 20+ installed
- Google Gemini API key ([Get it here](https://makersuite.google.com/app/apikey))

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

Create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and add your API key:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_actual_api_key_here
```

## Step 3: Build the Project

```bash
npm run build
```

## Step 4: Run Examples

### Option A: Run with TypeScript (Development)

```bash
npm run dev:t
```

### Option B: Run with Bun (Faster)

```bash
npm run dev:b
```

### Option C: Run Built Version

```bash
npm start
```

## Example Usage

The main entry point (`src/index.ts`) includes 4 example queries:

1. **Compare Processors**: Intel vs AMD comparison
2. **Find Best Price**: RTX 4070 graphics card search
3. **Check Availability**: Samsung SSD availability check
4. **Bengali Query**: Price comparison in Bengali

## How It Works

```typescript
import { runScrapingAgent } from "./src/index.js";

// Simple query
const result = await runScrapingAgent(
  "Compare RTX 4070 prices across all sites",
  { maxSteps: 15, verbose: true }
);

console.log(result.response);
```

## Supported Websites

- ✅ Startech (startech.com.bd)
- ✅ Techland BD (techlandbd.com)
- ✅ Ryans Computers (ryans.com)
- ✅ Vibe Gaming (vibegaming.com.bd)
- ✅ Computer Mania (computermania.com.bd)
- ✅ BD Stall (bdstall.com)

## Multi-Agent Architecture

The system automatically deploys sub-agents for parallel data extraction:

```
User Query
    ↓
Main Agent (Orchestrator)
    ↓
┌───────┬───────┬───────┬───────┬───────┬───────┐
│Agent 1│Agent 2│Agent 3│Agent 4│Agent 5│Agent 6│
│Startech│Techland│Ryans│Vibe│CompMania│BDStall│
└───────┴───────┴───────┴───────┴───────┴───────┘
    ↓
Data Aggregation & Analysis
    ↓
Intelligent Recommendation
```

## Troubleshooting

### API Key Error

```
❌ Error: GOOGLE_GENERATIVE_AI_API_KEY not found
```

**Solution**: Make sure your `.env` file exists and contains the API key.

### Build Errors

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Rate Limiting

If you hit rate limits, the agent will automatically handle failures gracefully and continue with successful results.

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Check [SUPPORTED_WEBSITES.md](./SUPPORTED_WEBSITES.md) for website configurations
- Review [project-details.md](./project-details.md) for architecture details
- See [PROMPTS.MD](./PROMPTS.MD) for development prompts

## Need Help?

- Check the examples in `src/index.ts`
- Review the steering docs in `.kiro/steering/`
- Read the project requirements in `project-details.md`

Happy scraping! 🎉
