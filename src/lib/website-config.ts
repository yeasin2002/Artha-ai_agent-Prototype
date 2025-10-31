/**
 * Website Configuration for E-commerce Scraping
 * Defines supported websites and their URL patterns
 */

export interface WebsiteConfig {
  name: string;
  baseUrl: string;
  searchPattern: string;
  productPattern: string;
}

export const SUPPORTED_WEBSITES: Record<string, WebsiteConfig> = {
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
  ryans: {
    name: "Ryans Computers",
    baseUrl: "https://ryansbd.com/",
    searchPattern: "https://www.ryans.com/search?q={query}",
    productPattern: "https://www.ryans.com/{product-slug}",
  },
  vibegaming: {
    name: "Vibe Gaming",
    baseUrl: "https://vibegaming.com.bd/",
    searchPattern: "https://vibegaming.com.bd/?s={query}&post_type=product",
    productPattern: "https://vibegaming.com.bd/product/{product-slug}",
  },
  computermania: {
    name: "Computer Mania",
    baseUrl: "https://computermania.com.bd/",
    searchPattern: "https://computermania.com.bd/?s={query}&post_type=product",
    productPattern: "https://computermania.com.bd/product/{product-slug}",
  },
  bdstall: {
    name: "BD Stall",
    baseUrl: "https://www.bdstall.com",
    searchPattern: "https://www.bdstall.com/search/?term={query}",
    productPattern: "https://www.bdstall.com/details/{product-slug}",
  },
};

/**
 * Get search URL for a website
 */
export function getSearchUrl(websiteKey: string, query: string): string {
  const website = SUPPORTED_WEBSITES[websiteKey];
  if (!website) {
    throw new Error(`Unsupported website: ${websiteKey}`);
  }
  return website.searchPattern.replace("{query}", encodeURIComponent(query));
}

/**
 * Get all website keys
 */
export function getAllWebsiteKeys(): string[] {
  return Object.keys(SUPPORTED_WEBSITES);
}

/**
 * Get website name by key
 */
export function getWebsiteName(websiteKey: string): string {
  return SUPPORTED_WEBSITES[websiteKey]?.name || websiteKey;
}
