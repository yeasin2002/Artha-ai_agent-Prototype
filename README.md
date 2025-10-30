# 🤖 AI Web Scraping Agent - Complete Setup Guide

A powerful AI agent built with Vercel AI SDK and Gemini AI that autonomously scrapes and compares products from Bangladesh e-commerce websites.

## 🌟 Features

- **🔍 Intelligent Scraping**: AI-powered web scraping without traditional scraping libraries
- **⚖️ Product Comparison**: Compare products across multiple e-commerce sites
- **💰 Price Analysis**: Find best deals and calculate potential savings
- **📊 Availability Tracking**: Check stock status across stores
- **🎯 Natural Language Interface**: Ask questions in plain English
- **🚀 Fast & Efficient**: Uses Gemini 2.0 Flash for quick responses

## 📦 Supported Websites

- **Startech** (startech.com.bd)
- **Techland BD** (techlandbd.com)
- **Ryans Computers** (ryans.com)

## 🛠️ Installation

### Prerequisites

- Node.js 18+ 
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

### Step 4: Copy Files

1. Copy `ai-agent.ts` to `lib/ai-agent.ts`
2. Copy `website-config.ts` to `lib/website-config.ts`
3. Copy the API route to `app/api/scrape/route.ts`
4. Copy the React component to `components/ProductScrapingAgent.tsx`

## 🚀 Usage

### Method 1: Direct Function Call

```typescript
import { runScrapingAgent } from '@/lib/ai-agent';

async function main() {
  const result = await runScrapingAgent(
    'Compare Intel Core i7-13700K and AMD Ryzen 7 7700X on all websites'
  );
  
  console.log(result.response);
}

main();
```

### Method 2: API Endpoint

```typescript
// Make a POST request to your API
const response = await fetch('/api/scrape', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: 'Find best price for RTX 4070 Ti',
    mode: 'compare',
  }),
});

const data = await response.json();
console.log(data.response);
```

### Method 3: React Component

```tsx
import ProductScrapingAgent from '@/components/ProductScrapingAgent';

export default function Home() {
  return (
    <main>
      <ProductScrapingAgent />
    </main>
  );
}
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
```typescript
fetchWebPage({ url: 'https://...' })
```

### 2. `extractProductData`
Extracts product information from HTML
```typescript
extractProductData({ 
  html: '...',
  productQuery: 'RTX 4070',
  websiteName: 'Startech'
})
```

### 3. `compareProducts`
Compares multiple products and provides analysis
```typescript
compareProducts({ 
  products: [...],
  userPreferences: 'Best value for money'
})
```

### 4. `searchProductAcrossSites`
High-level tool that searches across multiple sites
```typescript
searchProductAcrossSites({
  productName: 'Intel i7-13700K',
  websites: [...]
})
```

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

### Customize Agent Behavior

Edit the system prompt in `lib/ai-agent.ts`:

```typescript
system: `You are an expert AI shopping assistant...
[Customize behavior here]`
```

### Adjust Performance

```typescript
const result = await runScrapingAgent(query, {
  maxSteps: 15,  // Increase for more thorough searches
  verbose: true, // Enable detailed logging
});
```

## 🎨 Customization

### Change AI Model

```typescript
import { google } from '@ai-sdk/google';

// Use a different Gemini model
const result = await generateText({
  model: google('gemini-pro'),  // or 'gemini-2.0-flash-exp'
  // ...
});
```

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

1. **Cache Results**: Store results for popular queries
2. **Batch Requests**: Group related queries together
3. **Limit HTML Size**: The agent automatically truncates large HTML (50k chars)
4. **Use Specific Queries**: More specific = better results
5. **Enable Verbose Logging**: Helps debug issues

## 🔒 Security Considerations

- **Never expose API keys** in client-side code
- Use **environment variables** for sensitive data
- Implement **rate limiting** on your API endpoints
- Add **authentication** for production use
- Validate and **sanitize user inputs**

## 📈 Production Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
# Or use Vercel CLI
vercel --prod
```

### Environment Variables in Vercel

Go to Project Settings → Environment Variables:
```
GOOGLE_GENERATIVE_AI_API_KEY = your_key_here
```

## 🤝 Contributing

Want to add more features?
- Add more e-commerce websites
- Implement price history tracking
- Add email notifications for price drops
- Create Chrome extension
- Build mobile app

## 📄 License

MIT License - Feel free to use in your projects!

## 🙏 Acknowledgments

- Built with [Vercel AI SDK](https://sdk.vercel.ai/)
- Powered by [Google Gemini](https://deepmind.google/technologies/gemini/)
- Scraping Bangladesh's top tech e-commerce sites

---

## 🚀 Quick Start Command

```bash
# Clone, install, and run
git clone your-repo
cd your-project
npm install
echo "GOOGLE_GENERATIVE_AI_API_KEY=your_key" > .env.local
npm run dev
```

Visit `http://localhost:3000` and start scraping! 🎉