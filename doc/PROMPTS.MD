# AI Agent Development Prompts

This document contains useful prompts for working with Kiro on this AI web scraping agent project.

## Initial Setup

### Create Website Configuration

```
Create src/lib/website-config.ts with all 6 supported websites from the steering docs.
Export SUPPORTED_WEBSITES object with proper TypeScript types.
```

### Setup Environment File

```
Create .env.example with GOOGLE_GENERATIVE_AI_API_KEY and GEMINI_MODEL variables.
Add comments explaining how to get the API key.
```

## Feature Development

### Implement Multi-Agent System

```
Update src/lib/ai-agent.ts to implement parallel sub-agent execution.
Each sub-agent should fetch and extract data from one website simultaneously.
Use Promise.all for parallel execution. Handle failures gracefully.
```

### Add Query Validation

```
Add a validateQuery function that checks if user input is a valid product search query.
Return meaningful error messages for invalid queries. Support English and Bengali.
```

### Implement Caching

```
Add a simple in-memory cache for product data using Map.
Cache key should be query + website combination.
Set TTL to 1 hour. Return cached data when available.
```

### Add Bengali Language Support

```
Update the system prompt in runScrapingAgent to handle Bengali queries.
Test with queries like "কোথায় RTX 4070 সস্তা?" and ensure proper response.
```

### Create Graph-Ready Output

```
Modify compareProductsTool to return an array of objects suitable for charting.
Include: website, price, availability, productName fields.
Sort by price ascending.
```

## Testing & Debugging

### Test Single Website Scraping

```
Create a test that fetches and extracts product data from Startech for "Intel i7-13700K".
Verify all required fields are extracted: name, price, availability, specs.
```

### Test Multi-Site Comparison

```
Run the agent with query "Compare RTX 4070 prices across all sites".
Verify it fetches from all 6 websites and returns comparison with lowest price highlighted.
```

### Debug Extraction Issues

```
Add verbose logging to extractProductDataTool showing what HTML sections are being analyzed.
Log the AI's JSON response before parsing to debug extraction failures.
```

## Optimization

### Reduce Response Time

```
Profile the agent execution and identify bottlenecks.
Optimize by: increasing parallel execution, reducing HTML size, improving prompts.
Target: < 60 seconds for multi-site comparison.
```

### Improve Extraction Accuracy

```
Update the extraction prompt in extractProductDataTool to be more specific about price formats.
Handle edge cases: out of stock, pre-order, bundle pricing.
Test accuracy against 20 sample products.
```

## Documentation

### Update README Examples

```
Add 3 new example queries to README.md showing Bengali support,
budget searches, and multi-product comparison.
```

### Document API Response Format

```
Create a section in README showing the exact JSON structure returned by runScrapingAgent.
Include example response with all fields populated.
```

## Common Tasks

### Add New Website

```
Add [website name] to SUPPORTED_WEBSITES in website-config.ts.
Include baseUrl, searchPattern, and productPattern.
Test with a sample query and verify data extraction works.
```

### Fix Price Parsing

```
The agent is not correctly parsing prices in BDT format.
Update extractProductDataTool prompt to handle ৳, Tk, and BDT symbols.
Normalize all prices to numeric format.
```

### Handle Timeout Errors

```
Some websites are timing out during fetch.
Add timeout parameter (30s) to fetch calls.
Implement retry logic with exponential backoff (3 attempts).
```

### Export Tools for External Use

```
Ensure all tools (fetchWebPageTool, extractProductDataTool, etc.) are exported
from ai-agent.ts so they can be used independently in other packages.
```

## Quick Fixes

### Update Dependencies

```
Update all dependencies to latest versions. Run npm update and test that build still works.
```

### Fix TypeScript Errors

```
Run typecheck and fix all type errors in src/lib/ai-agent.ts.
Ensure strict mode compliance.
```

### Format Code

```
Format all TypeScript files in src/ using the project's formatting rules.
```

## Advanced Features

### Implement Price History Tracking

```
Add a priceHistory field to product data that tracks price changes over time.
Store in a JSON file or database. Show price trends in comparison output.
```

### Add Compatibility Checking

```
Create a new tool that checks component compatibility (e.g., CPU + Motherboard).
Use AI to analyze specifications and warn about incompatibilities.
```

### Build CLI Interface

```
Create a CLI wrapper for the agent using commander.js.
Support commands: search, compare, watch (for price drops).
Output formatted tables using cli-table3.
```

### Add Email Notifications

```
Implement price drop alerts that send email when a product price falls below threshold.
Use nodemailer. Store user preferences in config file.
```
