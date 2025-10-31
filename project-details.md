# AI Agent with Vercel AI Agents - Project Documentation

## 📋 Executive Summary

### Project Overview

This repo is part of a monorepo package, this is handle all AI agents that can used in backend, or to build CLI so it will the main Agent that will We will use later .

An intelligent, autonomous AI agent system that leverages Large Language Models (LLMs) to perform web scraping, product comparison, and price analysis across multiple Bangladesh e-commerce platforms without traditional scraping tools. The system uses natural language processing to understand user queries and autonomously executes complex research tasks.

### Business Problem

- **Manual Price Comparison**: Consumers waste hours manually comparing prices across different e-commerce sites
- **Information Overload**: Too many websites, too much data to process efficiently
- **Market Research**: Businesses need automated competitive pricing intelligence
- **Real-time Availability**: Difficult to track product availability across multiple stores
- **Decision Fatigue**: Users struggle to make informed purchase decisions with scattered information

### Solution

An AI-powered agent that:

- Understands natural language queries (no technical knowledge required)
- Autonomously navigates and extracts data from e-commerce websites
- Provides intelligent analysis, comparisons, and recommendations
- Delivers real-time, accurate pricing and availability information
- Saves users time and money through automated research

---

## 🎯 Project Goals & Objectives

### Primary Goals

1. **Automation**: Replace manual web scraping with AI-driven automation
2. **Intelligence**: Provide smart recommendations, not just data dumps
3. **User Experience**: Make product research as simple as asking a question
4. **Accuracy**: Deliver reliable, up-to-date information
5. **Scalability**: Easy to add new websites and product categories

---

## 👥 Target Users & User Personas (Example)

### Persona 1: Tech Enthusiast - "Rajib"

- **Age**: 25-35
- **Occupation**: Software Developer
- **Need**: Building a gaming PC, wants best deals
- **Pain Point**: Spending hours checking multiple sites
- **Goal**: Find components at lowest prices quickly
- **Tech Savvy**: High

### Persona 2: Small Business Owner - "Fatema"

- **Age**: 30-45
- **Occupation**: Retail Shop Owner
- **Need**: Buying office equipment in bulk
- **Pain Point**: Limited time for market research
- **Goal**: Get competitive pricing for procurement
- **Tech Savvy**: Medium

### Persona 3: First-Time Buyer - "Arif"

- **Age**: 20-28
- **Occupation**: University Student
- **Need**: Buying first laptop for studies
- **Pain Point**: Confused by technical specifications
- **Goal**: Get expert recommendations within budget
- **Tech Savvy**: Low to Medium

### Persona 4: Deal Hunter - "Nazia"

- **Age**: 22-40
- **Occupation**: Online Shopper
- **Need**: Finding discounts and best deals
- **Pain Point**: Missing out on price drops
- **Goal**: Always get the lowest price available
- **Tech Savvy**: Medium to High

---

## ✨ Core Features & Functionality

### Feature 1: Natural Language Query Interface

**User Story**: As a user, I want to ask questions in plain English so that I don't need to learn complex search syntax.

**Capabilities**:

- Support for various question formats
- Context awareness for follow-up questions
- Handles typos and informal language
- Multi-language support (Bengali + English)
- might have a chat interface from client and AI will response from with previous context.

**Example usecase of this AI**:

Make sure that this AI agent can handle all the following usecases when we will use with other AI agents or services like CLI or Backend.

- "Compare Intel i7 and AMD Ryzen 7"
- "কোথায় RTX 4070 সস্তা?" (Where is RTX 4070 cheaper?)
- "Show me gaming laptops under 1 lakh"

### Feature 2: Autonomous Web Scraping

**User Story**: As a user, I want the system to automatically fetch product data so that I get real-time information.

**Capabilities**:

- AI-driven HTML parsing (no brittle selectors)
- Adaptive to website layout changes
- Handles dynamic content loading
- Respects robots.txt and rate limits
- Error recovery and retry mechanisms

**Technical Approach**:

- LLM analyzes HTML structure
- Extracts relevant product information
- Validates and normalizes data
- Caches results for performance

### Feature 3: Intelligent Product Comparison

**User Story**: As a user, I want to see products compared side-by-side so that I can make informed decisions.

**Capabilities**:

- Multi-dimensional comparison (price, specs, warranty)
- Visual comparison tables
- Highlight differences and similarities
- Calculate potential savings
- Consider shipping costs and availability

**Comparison Dimensions**:

- **Price**: Current, discounted, historical
- **Specifications**: Technical details, performance
- **Availability**: In stock, pre-order, out of stock
- **Seller**: Store reputation, location, return policy
- **Value**: Price-per-performance ratio

### Feature 4: Smart Recommendations Engine

**User Story**: As a user, I want personalized recommendations so that I find the best product for my needs.

**Capabilities**:

- Budget-based filtering
- Use-case matching (gaming, office, content creation)
- Brand preference consideration
- Future-proofing suggestions
- Alternative options presentation

**Recommendation Factors**:

- User budget and requirements
- Product reviews and ratings
- Price-to-performance ratio
- Brand reliability
- Upgrade path considerations

### Feature 5: Real-Time Price Tracking

**User Story**: As a user, I want to know when prices drop so that I can buy at the best time.

**Capabilities**:

- Price history visualization
- Price drop alerts via email/notification
- Best time to buy predictions
- Seasonal trend analysis
- Price comparison over time

### Feature 6: Availability Monitoring

**User Story**: As a user, I want to know where products are in stock so that I don't waste time.

**Capabilities**:

- Real-time stock status
- Pre-order information
- Estimated restock dates
- Multiple location availability
- Stock alert notifications

### Feature 7: Batch Product Analysis

**User Story**: As a user building a complete PC, I want to compare entire builds so that I can optimize my budget.

**Capabilities**:

- Multi-product bundle comparison
- Compatibility checking (motherboard + CPU + RAM)
- Total cost calculation across stores
- Mix-and-match optimization
- Suggest complete builds within budget

### Feature 8: API & Integration



---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Web Interface│  │ Mobile App   │  │  API Client  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Next.js Application                      │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │   │
│  │  │  UI Layer  │  │ API Routes │  │ Middleware │     │   │
│  │  └────────────┘  └────────────┘  └────────────┘     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      AI AGENT LAYER                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         AI Orchestration Engine (Vercel AI SDK)      │   │
│  │                                                       │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │   │
│  │  │ Query      │  │  Planning  │  │ Execution  │     │   │
│  │  │ Parser     │  │  Engine    │  │  Engine    │     │   │
│  │  └────────────┘  └────────────┘  └────────────┘     │   │
│  │                                                       │   │
│  │  ┌─────────────────────────────────────────────┐     │   │
│  │  │         Google Gemini 2.0 Flash             │     │   │
│  │  └─────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       TOOL LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Fetch      │  │   Extract    │  │   Compare    │      │
│  │   Tool       │  │   Tool       │  │   Tool       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Search     │  │   Analyze    │  │   Cache      │      │
│  │   Tool       │  │   Tool       │  │   Tool       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Startech    │  │  Techland    │  │   Ryans      │      │
│  │  (.com.bd)   │  │  (BD.com)    │  │  (.com)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Component Descriptions



#### 3. **AI Agent Layer**

- **Query Parser**: Understands natural language input
- **Planning Engine**: Creates execution strategy
- **Execution Engine**: Coordinates tool execution
- **Gemini LLM**: Core AI model for intelligence

#### 4. **Tool Layer**

- **Fetch Tool**: Retrieves web pages
- **Extract Tool**: Parses HTML and extracts data
- **Compare Tool**: Analyzes multiple products
- **Search Tool**: Multi-site search orchestration
- **Analyze Tool**: Generates insights and recommendations
- **Cache Tool**: Manages cached results

#### 6. **External Services**

- **E-commerce Sites**: Target websites for scraping


---

## 🔄 User Journey & Workflows

### Workflow  Product Search and Product Comparison

```
Start
  │
  ├─> User enters query
  │   "Find best price for RTX 4070"
  │
  ├─> System processes query
  │   └─> Check query: if not a valid query, return error
  │   └─> Detect product category: "Graphics Card"
  │   └─> Identify search intent: "Price comparison"
  │   └─> Generate search strategy
  │
  ├─> AI Agent executes
  │   └─> Generate search URLs for all sites
  │   └─> Fetch product pages (parallel)
  │   └─> Run sub - Agents to get product details (using Fetch Tool)
  │     └─> Agent 1: Get data from A shop 
  │     └─> Agent 2: Get data from B shop
  │     └─> Agent 3: Get data from C shop
  │   └─> Extract product data using AI
  │   └─> Extract specifications
  │   └─> Gather reviews/ratings
  │   └─> Validate and normalize data
  │
  ├─> System analyzes results
  │   └─> Compare prices across sites
  │   └─> Check availability status
  │   └─> Calculate savings potential
  │   └─> Generate recommendation
  │
  ├─> Generate insights
  │   └─> Which is cheaper overall
  │   └─> Which offers better value
  │   └─> Use-case recommendations
  │   └─> Alternative suggestions
  ├─> Present comparison
  │   └─> Side-by-side table
  │   └─> Visual charts/graphs
  │   └─> Expert recommendation
  │   └─> Purchase links for both
  │
  └─> Display results to user
      └─> Price comparison table from different sites
      └─> Best deal highlighted with reason
      └─> Product Details (A-Z everything from all sites)
      └─> Generate Info to send (that can be used to display to Graph) - Array of Objects
      └─> Links to purchase
```


---

## 🗂️ Data Models & Structure


### Entity: Query

```
Query
├─ id (UUID, Primary Key)
├─ user_id (UUID, Foreign Key)
├─ query_text (Text)
├─ query_type (Enum: search, compare, availability)
├─ detected_category (String)
├─ detected_products (Array)
├─ execution_time (Float, seconds)
├─ tools_used (Array)
├─ result_summary (JSON)
├─ created_at (Timestamp)
└─ user_satisfaction (Integer, 1-5)
```

### Entity: Product

```
Product
├─ name (String)
├─ brand (String)
├─ category (String)
├─ model_number (String)
├─ specifications (JSON)
├─ description (Text)
├─ images (Array)
├─ average_price (Decimal)
├─ price_history (JSON)
├─ first_seen (Timestamp)
└─ last_updated (Timestamp)
└─ [...product-data]
```

### Entity: ProductListing

```
ProductListing
├─ id (UUID, Primary Key)
├─ product_id (UUID, Foreign Key)
├─ store_name (String)
├─ store_url (String)
├─ current_price (Decimal)
├─ original_price (Decimal, Optional)
├─ discount_percentage (Float)
├─ availability (Enum: in_stock, out_of_stock, pre_order)
├─ warranty (String)
├─ shipping_cost (Decimal)
├─ seller_rating (Float)
├─ scraped_at (Timestamp)
└─ is_valid (Boolean)
└─ [product-data]
```





---

## 📊 Technical Requirements

### Functional Requirements

#### FR-1: Natural Language Processing

- System SHALL accept queries in natural language (English & Bengali)
- System SHALL understand at least 95% of common query patterns
- System SHALL handle typos and informal language
- System SHALL support follow-up questions with context

#### FR-2: Web Scraping

- System SHALL fetch product data from configured websites
- System SHALL extract at minimum: name, price, availability
- System SHALL complete scraping within 30 seconds per site
- System SHALL handle dynamic content and JavaScript-rendered pages

#### FR-3: Data Extraction

- System SHALL accurately extract product information with 95%+ accuracy
- System SHALL normalize prices to standard format
- System SHALL detect and handle different price formats (৳, Tk, BDT)
- System SHALL validate extracted data for consistency

#### FR-4: Product Comparison

- System SHALL compare products across multiple dimensions
- System SHALL highlight key differences between products
- System SHALL calculate price differences and savings
- System SHALL generate comparison visualizations

#### FR-5: Recommendations

- System SHALL provide intelligent recommendations based on user query
- System SHALL consider budget, performance, and value
- System SHALL explain reasoning behind recommendations
- System SHALL suggest alternatives when appropriate


#### FR-7: API Access

- System SHALL provide RESTful API for programmatic access
- System SHALL authenticate API requests using API keys
- System SHALL rate-limit API requests (100 requests/hour free tier)
- System SHALL return responses in JSON format


### Non-Functional Requirements

---


## 📅 Project Phases & Timeline

**Goal**: Build core AI agent and basic scraping capability

**Success Criteria**:
- Agent can understand simple queries
- Successfully scrape product data from Startech
- Extract name, price, availability with 90%+ accuracy


**Goal**: Expand to multiple websites and comparison features
**Success Criteria**:
- Support 3 major e-commerce sites
- Complete multi-site comparison in < 60 seconds
- 80%+ cache hit rate



