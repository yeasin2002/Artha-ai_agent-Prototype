---
inclusion: manual
---

# User Personas & Use Cases

This document defines target users and their needs. Use this context when designing features or making UX decisions.

## Persona 1: Tech Enthusiast - "Rajib"

**Demographics**:

- Age: 25-35
- Occupation: Software Developer
- Location: Dhaka, Bangladesh
- Tech Savvy: High

**Goals**:

- Building a gaming PC with best components
- Finding lowest prices across all stores
- Getting deals quickly without manual research

**Pain Points**:

- Spending hours checking multiple sites
- Missing out on better deals
- Difficulty tracking price changes

**Typical Queries**:

- "Compare Intel Core i7-13700K and AMD Ryzen 7 7700X processors"
- "Find best price for RTX 4070 Ti"
- "Show me complete gaming PC build under 150,000 BDT"

**Needs from System**:

- Fast, accurate price comparison
- Technical specification details
- Performance-per-taka analysis
- Compatibility checking for builds

---

## Persona 2: Small Business Owner - "Fatema"

**Demographics**:

- Age: 30-45
- Occupation: Retail Shop Owner
- Location: Chittagong, Bangladesh
- Tech Savvy: Medium

**Goals**:

- Buying office equipment in bulk
- Getting competitive pricing for procurement
- Making quick purchasing decisions

**Pain Points**:

- Limited time for market research
- Need to justify purchases to partners
- Difficulty comparing warranty terms

**Typical Queries**:

- "Find cheapest Dell monitors 24 inch available in stock"
- "Compare office laptops under 60,000 BDT"
- "Which store has best warranty for printers?"

**Needs from System**:

- Clear availability information
- Bulk pricing considerations
- Warranty comparison
- Quick decision support

---

## Persona 3: First-Time Buyer - "Arif"

**Demographics**:

- Age: 20-28
- Occupation: University Student
- Location: Sylhet, Bangladesh
- Tech Savvy: Low to Medium

**Goals**:

- Buying first laptop for studies
- Getting expert recommendations
- Staying within tight budget

**Pain Points**:

- Confused by technical specifications
- Fear of making wrong choice
- Limited budget constraints

**Typical Queries**:

- "Best laptop for programming under 50,000 BDT"
- "Is this laptop good for video editing?"
- "Which is better for students: HP or Lenovo?"

**Needs from System**:

- Simple, clear recommendations
- Explanation of technical terms
- Budget-focused suggestions
- Use-case specific advice

---

## Persona 4: Deal Hunter - "Nazia"

**Demographics**:

- Age: 22-40
- Occupation: Online Shopper / Reseller
- Location: Dhaka, Bangladesh
- Tech Savvy: Medium to High

**Goals**:

- Finding discounts and best deals
- Tracking price drops
- Buying at optimal time

**Pain Points**:

- Missing out on flash sales
- Difficulty tracking multiple sites
- Price changes without notification

**Typical Queries**:

- "Show me all discounted SSDs today"
- "Which store has biggest discount on graphics cards?"
- "Compare prices for Samsung 980 Pro across all sites"

**Needs from System**:

- Price history and trends
- Discount percentage calculations
- Savings potential highlights
- Quick deal identification

---

## Common Use Cases

### Use Case 1: Product Search and Comparison

**Actor**: Any user
**Flow**: User queries → System validates → Sub-agents fetch data → Comparison generated → Results displayed
**Success**: User gets comprehensive comparison in < 60 seconds

### Use Case 2: Budget-Constrained Shopping

**Actor**: Student or budget-conscious buyer
**Flow**: User specifies budget → System filters products → Recommendations within budget → Best value highlighted
**Success**: User finds suitable product within budget

### Use Case 3: Complete Build Planning

**Actor**: PC builder (Rajib persona)
**Flow**: User lists components → System checks compatibility → Finds best prices → Calculates total cost
**Success**: User gets optimized build with lowest total cost

### Use Case 4: Availability Check

**Actor**: Business owner (Fatema persona)
**Flow**: User queries product → System checks all stores → Shows in-stock locations → Provides purchase links
**Success**: User knows exactly where to buy immediately

### Use Case 5: Specification Comparison

**Actor**: First-time buyer (Arif persona)
**Flow**: User compares products → System explains differences → Recommends based on use-case → Justifies choice
**Success**: User understands differences and makes confident decision
