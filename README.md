# 🤖 AI Web Scraping Agent - Complete Setup Guide

A powerful AI agent built with Vercel AI SDK and Gemini AI that autonomously scrapes and compares products from Bangladesh e-commerce websites.
This is part of a monorepo, this package is for AI agent and scraping functionality. provide Full Powered multiple sub agent supported AI agent with vercel AI SDK and Gemini AI.

## 🌟 Features

- **🔍 Intelligent Scraping**: AI-powered web scraping without traditional scraping libraries
- **⚖️ Product Comparison**: Compare products across multiple e-commerce sites
- **⚖️ Product Details**: Extract product details from all e-commerce sites, and show all of them. 
- **💰 Price Analysis**: Find best deals and calculate potential savings
- **📊 Availability Tracking**: Check stock status across stores
- **🎯 Natural Language Interface**: Ask questions in plain English
- **🚀 Fast & Efficient**: Uses Gemini 2.0 Flash for quick responses


## 📦 Supported Websites

- **Startech** (startech.com.bd)
- **Techland BD** (techlandbd.com)
- **Ryans Computers** (ryans.com)
- more will be added in future 

## 🛠️ Installation

### Prerequisites

- Node.js 20+ 
- npm or yarn or pnpm
- Google AI Studio API Key (Gemini)

### Step 1: Install Dependencies

```bash
npm install ai @ai-sdk/google zod
# or
yarn add ai @ai-sdk/google zod
# or
pnpm add ai @ai-sdk/google zod
```

### Step 2: Environment Variables

Create a `.env.local` file in your project root:

```env
# Google AI (Gemini) API Key
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here

# Optional: Set custom model
GEMINI_MODEL=gemini-2.0-flash-exp
```

**How to get your API key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and paste it in your `.env.local` file

### Step 3: Project Structure

```
your-project/
├── lib/
│   ├── ai-agent.ts              # Main AI agent
│   └── website-config.ts        # Website configurations
├── app/
│   └── api/
│       └── scrape/
│           └── route.ts         # API endpoint (App Router)
├── components/
│   └── ProductScrapingAgent.tsx # React component
├── .env.local                   # Environment variables
└── package.json
```



## 📝 Example Queries

### Price Comparison
```
"Compare Intel Core i7-13700K and AMD Ryzen 7 7700X processors"
```

### Best Price Search
```
"Find the best price for NVIDIA RTX 4070 graphics card"
```

### Availability Check
```
"Is Samsung 980 Pro 1TB SSD available in stock at Startech and Ryans?"
```

### Budget Search
```
"Show me gaming laptops under 100,000 BDT"
```

### Multi-Product Comparison
```
"Compare prices for AMD Ryzen 7 7700X, ASUS TUF B650-PLUS, and G.Skill 32GB DDR5 across all stores"
```

## 🎯 How It Works

1. **User Query**: You provide a natural language query
2. **AI Planning**: Gemini AI analyzes and creates an action plan
3. **Tool Execution**: AI uses tools to:
   - Fetch web pages
   - Extract product data
   - Compare information
4. **Analysis**: AI analyzes all data and provides insights
5. **Response**: You get a comprehensive answer with recommendations

## 🔧 Available Tools

The AI agent has access to these tools:

### 1. `fetchWebPage`
Fetches HTML content from any URL


### 2. `extractProductData`
Extracts product information from HTML


### 3. `compareProducts`
Compares multiple products and provides analysis


### 4. `searchProductAcrossSites`


## ⚙️ Configuration

### Add More Websites

Edit `lib/website-config.ts`:

```typescript
export const SUPPORTED_WEBSITES = {
  // ... existing sites
  newsite: {
    name: 'New Site',
    baseUrl: 'https://newsite.com',
    searchPattern: 'https://newsite.com/search?q={query}',
  },
};
```


## 🎨 Customization


### Add Custom Tools

```typescript
const myCustomTool = tool({
  description: 'My custom tool',
  parameters: z.object({
    param: z.string(),
  }),
  execute: async ({ param }) => {
    // Your logic here
    return { result: '...' };
  },
});

// Add to tools in runScrapingAgent
tools: {
  // ... existing tools
  myCustomTool,
}
```

## 🐛 Troubleshooting

### Issue: API Key Error
```
Error: API key not found
```
**Solution**: Make sure `GOOGLE_GENERATIVE_AI_API_KEY` is set in `.env.local`

### Issue: No Results Found
```
Product not found on any website
```
**Solution**: 
- Check if the product name is spelled correctly
- Try a more specific or simpler query
- Verify the websites are accessible

### Issue: Timeout Errors
```
Request timeout
```
**Solution**: 
- Increase `maxSteps` parameter
- Check your internet connection
- Some sites may be blocking requests - try different user agents

### Issue: Rate Limiting
```
Too many requests
```
**Solution**:
- Add delays between requests
- Implement caching for repeated queries
- Use exponential backoff for retries

## 📊 Performance Tips

3. **Limit HTML Size**: The agent automatically truncates large HTML 
4. **Use Specific Queries**: More specific = better results
5. **Enable Verbose Logging**: Helps debug issues

## 🔒 Security Considerations

- Validate and **sanitize user inputs**

## 📈 Production Deployment





## 📄 License

MIT License - Feel free to use in your projects!

## 🙏 Acknowledgments

- Built with [Vercel AI SDK](https://sdk.vercel.ai/)
- Powered by [Google Gemini](https://deepmind.google/technologies/gemini/)
- Scraping Bangladesh's top tech e-commerce sites

---
