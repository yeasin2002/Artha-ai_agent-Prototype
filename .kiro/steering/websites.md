---
inclusion: always
---

# Supported Websites Configuration

This document defines the e-commerce websites supported by the AI agent for product scraping and comparison.

## Website List

### 1. Startech

- **Base URL**: `http://startech.com.bd/`
- **Search Pattern**: `http://startech.com.bd/product/search?search={query}`
- **Product Page**: `https://www.startech.com.bd/{product-slug}`
- **Type**: Major tech retailer
- **Status**: Active

### 2. Techland BD

- **Base URL**: `https://techland.com.bd/`
- **Search Pattern**: `https://www.techlandbd.com/search/advance/product/result/{query}`
- **Product Page**: `https://www.techlandbd.com/{product-slug}`
- **Type**: Electronics store
- **Status**: Active

### 3. Ryans Computers

- **Base URL**: `https://ryansbd.com/`
- **Search Pattern**: `https://www.ryans.com/search?q={query}`
- **Product Page**: `https://www.ryans.com/{product-slug}`
- **Type**: Computer and tech products
- **Status**: Active

### 4. Vibe Gaming

- **Base URL**: `https://vibegaming.com.bd/`
- **Search Pattern**: `https://vibegaming.com.bd/?s={query}&post_type=product`
- **Product Page**: `https://vibegaming.com.bd/product/{product-slug}`
- **Type**: Gaming peripherals
- **Status**: Active

### 5. Computer Mania

- **Base URL**: `https://computermania.com.bd/`
- **Search Pattern**: `https://computermania.com.bd/?s={query}&post_type=product`
- **Product Page**: `https://computermania.com.bd/product/{product-slug}`
- **Type**: PC components
- **Status**: Active

### 6. BD Stall

- **Base URL**: `https://www.bdstall.com`
- **Search Pattern**: `https://www.bdstall.com/search/?term={query}`
- **Product Page**: `https://www.bdstall.com/details/{product-slug}`
- **Type**: General electronics
- **Status**: Active

## Configuration Structure

When implementing `website-config.ts`, use this structure:

```typescript
export const SUPPORTED_WEBSITES = {
  startech: {
    name: "Startech",
    baseUrl: "http://startech.com.bd/",
    searchPattern: "http://startech.com.bd/product/search?search={query}",
    productPattern: "https://www.startech.com.bd/{product-slug}",
  },
  techland: {
    name: "Techland BD",
    baseUrl: "https://techland.com.bd/",
    searchPattern:
      "https://www.techlandbd.com/search/advance/product/result/{query}",
    productPattern: "https://www.techlandbd.com/{product-slug}",
  },
  // ... other sites
};
```

## Adding New Websites

To add a new website:

1. Add entry to `SUPPORTED_WEBSITES` in `website-config.ts`
2. Include: name, baseUrl, searchPattern, productPattern
3. Test scraping with sample queries
4. Update this documentation
5. Update README.md supported sites list

## URL Pattern Variables

- `{query}`: User search query (URL-encoded)
- `{product-slug}`: Product-specific URL slug
- Patterns should be complete URLs, not relative paths
