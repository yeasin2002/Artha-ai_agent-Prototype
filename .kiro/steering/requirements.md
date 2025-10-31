---
inclusion: always
---

# Project Requirements

## Functional Requirements

### FR-1: Natural Language Processing

- Accept queries in natural language (English & Bengali)
- Understand 95%+ of common query patterns
- Handle typos and informal language
- Support follow-up questions with context awareness
- Validate queries before execution

### FR-2: Web Scraping

- Fetch product data from all configured websites
- Extract minimum: name, price, availability, specifications
- Complete scraping within 30 seconds per site
- Handle dynamic content and JavaScript-rendered pages
- Respect robots.txt and implement rate limiting

### FR-3: Data Extraction

- Extract product information with 95%+ accuracy
- Normalize prices to standard format (BDT)
- Detect and handle different price formats (৳, Tk, BDT)
- Extract comprehensive A-Z product details
- Validate extracted data for consistency

### FR-4: Multi-Agent Coordination

- Deploy sub-agents for parallel data extraction
- Agent 1: Extract from Site A
- Agent 2: Extract from Site B
- Agent 3: Extract from Site C
- Aggregate results from all sub-agents
- Handle sub-agent failures gracefully

### FR-5: Product Comparison

- Compare products across multiple dimensions (price, specs, warranty, availability)
- Highlight key differences between products
- Calculate price differences and potential savings
- Generate comparison visualizations
- Output graph-ready data (array of objects)

### FR-6: Recommendations

- Provide intelligent recommendations based on user query
- Consider budget, performance, and value
- Explain reasoning behind recommendations
- Suggest alternatives when appropriate
- Support batch product analysis for complete builds

### FR-7: Error Handling

- Validate queries before execution
- Return meaningful error messages for invalid queries
- Implement retry mechanisms for failed requests
- Handle website unavailability gracefully
- Log errors for debugging

## Non-Functional Requirements

### NFR-1: Performance

- Complete multi-site comparison in < 60 seconds
- Target 80%+ cache hit rate for repeated queries
- Support parallel sub-agent execution
- Optimize HTML truncation (50k chars limit)

### NFR-2: Scalability

- Easy to add new websites via configuration
- Support for 6+ e-commerce sites initially
- Modular tool architecture for extensibility
- Designed for monorepo integration

### NFR-3: Reliability

- 95%+ data extraction accuracy
- Adaptive to website layout changes (AI-driven parsing)
- No brittle CSS selectors
- Graceful degradation on partial failures

### NFR-4: Maintainability

- Clear separation of concerns (tools, agents, config)
- Comprehensive documentation
- Type-safe with TypeScript strict mode
- Testable architecture with Vitest

### NFR-5: Usability

- Natural language interface (no technical knowledge required)
- Support for both English and Bengali queries
- Clear, actionable results
- Structured output for easy integration

## Data Requirements

### Product Data Structure

Must extract and return:

- Product name
- Brand
- Model number
- Current price (BDT)
- Original price (if discounted)
- Discount percentage
- Availability status (in_stock, out_of_stock, pre_order)
- Specifications (JSON object)
- Features (array)
- Warranty information
- Images (array of URLs)
- Product URL
- Store name
- Scraped timestamp

### Comparison Output Structure

Must include:

- Price comparison (lowest to highest)
- Potential savings calculation
- Availability across stores
- Specification differences
- Recommendation with reasoning
- Graph-ready data format (array of objects)
- Links to purchase

## Integration Requirements

### Monorepo Integration

- Package designed for use in larger monorepo
- Can be imported by backend services
- Can be used to build CLI applications
- Exports main agent function and tools
- Provides TypeScript declarations

### API Compatibility

- Functions return structured JSON
- Consistent error response format
- Support for async/await patterns
- Compatible with REST API wrapping

## Security Requirements

- Validate and sanitize user inputs
- Use environment variables for API keys
- Never expose API keys in client-side code
- Implement rate limiting to prevent abuse
- Respect website terms of service
