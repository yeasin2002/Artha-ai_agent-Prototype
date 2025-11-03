# 📝 Logging System Documentation

## Overview

The AI Web Scraping Agent now includes comprehensive Winston-based logging to track all operations, errors, and performance metrics.

## Features

✅ **Detailed Error Tracking** - Every sub-agent failure is logged with full context
✅ **Performance Metrics** - Duration tracking for each operation
✅ **Multiple Log Levels** - Debug, Info, Warn, Error
✅ **Structured Logging** - JSON format for easy parsing
✅ **File Rotation** - Automatic log rotation (5MB max, 5 files)
✅ **Console Output** - Colored, formatted console logs
✅ **Separate Log Files** - Different files for different purposes

## Log Files

All logs are stored in the `logs/` directory:

### 1. `combined.log`

- **Purpose**: All log entries from all levels
- **Format**: JSON
- **Use**: Complete audit trail

### 2. `sub-agents.log`

- **Purpose**: Detailed sub-agent operations
- **Format**: JSON
- **Use**: Debugging scraping issues
- **Contains**:
  - Start/stop times
  - HTTP responses
  - HTML truncation warnings
  - AI extraction results
  - Success/failure reasons

### 3. `error.log`

- **Purpose**: Only error-level logs
- **Format**: JSON
- **Use**: Quick error review

### 4. `exceptions.log`

- **Purpose**: Uncaught exceptions
- **Format**: JSON
- **Use**: Critical error tracking

### 5. `rejections.log`

- **Purpose**: Unhandled promise rejections
- **Format**: JSON
- **Use**: Async error tracking

## Log Levels

### DEBUG

Detailed information for debugging:

- HTML fetch details
- AI extraction progress
- Data parsing steps

### INFO

General informational messages:

- Agent start/stop
- Sub-agent success
- Search completion summaries

### WARN

Warning messages:

- HTML truncation
- Missing data fields
- Partial failures

### ERROR

Error messages:

- HTTP failures
- JSON parsing errors
- AI extraction failures
- Network errors

## What Gets Logged

### Sub-Agent Operations

#### 1. Start

```json
{
  "level": "info",
  "message": "Sub-Agent startech: Starting",
  "website": "startech",
  "searchUrl": "http://startech.com.bd/product/search?search=RTX+4070",
  "timestamp": "2025-11-02 12:19:57"
}
```

#### 2. HTTP Fetch

```json
{
  "level": "debug",
  "message": "Sub-Agent startech: HTML fetched",
  "website": "startech",
  "htmlLength": 50020,
  "originalLength": 389019,
  "truncated": true,
  "timestamp": "2025-11-02 12:19:58"
}
```

#### 3. Success

```json
{
  "level": "info",
  "message": "Sub-Agent startech: Success",
  "website": "startech",
  "productName": "RTX 4070",
  "price": 79000,
  "availability": "in_stock",
  "duration": 16928,
  "timestamp": "2025-11-02 12:20:14"
}
```

#### 4. Failure

```json
{
  "level": "error",
  "message": "Sub-Agent computermania: Failed",
  "website": "computermania",
  "error": "HTTP 403: Forbidden",
  "searchUrl": "https://computermania.com.bd/?s=RTX+4070",
  "duration": 1234,
  "errorType": "HTTPError",
  "stack": "Error: HTTP 403...",
  "timestamp": "2025-11-02 12:20:15"
}
```

### Search Summary

```json
{
  "level": "info",
  "message": "Multi-site search completed",
  "totalSearched": 6,
  "successCount": 4,
  "failedCount": 2,
  "successRate": "66.7%",
  "successfulSites": ["Startech", "Techland BD", "Ryans", "BD Stall"],
  "failedSites": [
    { "site": "Vibe Gaming", "error": "No product data found" },
    { "site": "Computer Mania", "error": "HTTP 403: Forbidden" }
  ],
  "timestamp": "2025-11-02 12:20:15"
}
```

## Viewing Logs

### Method 1: Direct File Access

```bash
# View latest logs
cat logs/sub-agents.log | tail -n 50

# View errors only
cat logs/error.log

# View combined logs
cat logs/combined.log
```

### Method 2: Log Viewer Utility

```bash
# View success summary
bun run src/lib/agents/view-logs.ts summary

# View all errors
bun run src/lib/agents/view-logs.ts errors

# View all warnings
bun run src/lib/agents/view-logs.ts warnings

# View all sub-agent logs
bun run src/lib/agents/view-logs.ts sub-agents

# View all combined logs
bun run src/lib/agents/view-logs.ts all
```

### Method 3: Programmatic Access

```typescript
import { logger } from "./src/lib/agents/logger.js";

// Read logs programmatically
import fs from "fs";
const logs = fs.readFileSync("logs/sub-agents.log", "utf-8");
const entries = logs.split("\n").map((line) => JSON.parse(line));
```

## Common Error Patterns

### 1. HTTP 403 Forbidden

```json
{
  "error": "HTTP 403: Forbidden",
  "statusCode": 403
}
```

**Cause**: Website blocking automated requests
**Solution**: Website may need different user-agent or rate limiting

### 2. No Product Data Found

```json
{
  "error": "No product data found in response",
  "dataKeys": ["productData"]
}
```

**Cause**: AI couldn't extract product from HTML
**Solution**: Product might not exist or HTML structure changed

### 3. JSON Parse Error

```json
{
  "error": "JSON parsing error",
  "jsonString": "{invalid json..."
}
```

**Cause**: AI returned malformed JSON
**Solution**: Prompt engineering or retry logic needed

### 4. HTML Truncation

```json
{
  "level": "warn",
  "message": "HTML truncated from 389019 to 50000 characters",
  "originalLength": 389019,
  "truncatedLength": 50020
}
```

**Cause**: HTML too large for AI processing
**Solution**: Normal behavior, product data usually in first 50k chars

## Performance Metrics

Each sub-agent logs duration:

```json
{
  "duration": 16928, // milliseconds
  "website": "startech"
}
```

**Typical Durations**:

- Fast: 5-10 seconds
- Normal: 10-20 seconds
- Slow: 20-30 seconds
- Timeout: > 30 seconds

## Debugging Failed Sub-Agents

### Step 1: Check Error Log

```bash
bun run src/lib/agents/view-logs.ts errors
```

### Step 2: Identify Error Type

- **HTTP Error**: Website blocking or down
- **Parse Error**: AI extraction issue
- **No Data**: Product not found

### Step 3: Check Context

Look for:

- `searchUrl`: Was the URL correct?
- `statusCode`: What HTTP status?
- `duration`: Did it timeout?
- `htmlLength`: Was HTML fetched?

### Step 4: Review Full Log

```bash
cat logs/sub-agents.log | grep "websitename"
```

## Configuration

### Change Log Level

```typescript
// In .env file
LOG_LEVEL = debug; // debug, info, warn, error
```

### Disable Console Logging

```typescript
// In src/lib/agents/logger.ts
// Remove or comment out Console transport
```

### Change Log File Size

```typescript
// In src/lib/agents/logger.ts
new winston.transports.File({
  filename: "logs/combined.log",
  maxsize: 10485760, // 10MB instead of 5MB
  maxFiles: 10, // Keep 10 files instead of 5
});
```

## Best Practices

### 1. Regular Log Review

Check logs after each run to identify patterns

### 2. Monitor Success Rate

Aim for 60%+ success rate across all sites

### 3. Track Performance

Monitor duration to identify slow sites

### 4. Archive Old Logs

Logs auto-rotate, but archive important ones

### 5. Use Structured Queries

Parse JSON logs for analysis:

```bash
# Count errors by website
cat logs/sub-agents.log | grep "error" | jq -r '.website' | sort | uniq -c
```

## Troubleshooting

### Logs Not Created

```bash
# Ensure logs directory exists
mkdir -p logs
```

### Permission Errors

```bash
# Fix permissions
chmod 755 logs
```

### Logs Too Large

```bash
# Clear old logs
rm logs/*.log
```

### Can't Parse JSON

```bash
# Validate JSON
cat logs/sub-agents.log | jq . > /dev/null
```

## Example Analysis

### Find Most Common Errors

```bash
cat logs/sub-agents.log | grep '"level":"error"' | jq -r '.error' | sort | uniq -c | sort -rn
```

### Calculate Average Duration

```bash
cat logs/sub-agents.log | grep '"duration"' | jq '.duration' | awk '{sum+=$1; count++} END {print sum/count}'
```

### List Failed Sites

```bash
cat logs/sub-agents.log | grep '"level":"error"' | jq -r '.website' | sort | uniq
```

## Summary

The logging system provides:

- ✅ Complete visibility into agent operations
- ✅ Detailed error tracking with context
- ✅ Performance metrics
- ✅ Easy debugging tools
- ✅ Structured data for analysis

All sub-agent failures now include:

- Exact error message
- HTTP status codes
- Search URLs
- Duration metrics
- Full stack traces
- Contextual information

---

**Status**: ✅ Fully Implemented
**Log Location**: `./logs/`
**Viewer**: `bun run src/lib/agents/view-logs.ts`
