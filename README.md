/**
 * QUICK TEST SCRIPT FOR AI SCRAPING AGENT
 * 
 * Run this to test your agent setup:
 * npx tsx test-agent.ts
 * 
 * or add to package.json:
 * "scripts": { "test": "npx tsx test-agent.ts" }
 * then run: npm test
 */

import { runScrapingAgent } from './lib/ai-agent';
import { generateAllSearchUrls, detectProductCategory } from './lib/website-config';

// ============================================================================
// COLORS FOR CONSOLE OUTPUT
// ============================================================================

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(color: keyof typeof colors, message: string) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// ============================================================================
// TEST FUNCTIONS
// ============================================================================

async function testBasicSetup() {
  log('cyan', '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('bright', '🧪 TEST 1: Basic Setup Verification');
  log('cyan', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Test 1: Check environment variables
  log('yellow', '📋 Checking environment variables...');
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  
  if (!apiKey) {
    log('red', '❌ GOOGLE_GENERATIVE_AI_API_KEY not found in environment');
    log('yellow', '💡 Add it to your .env.local file');
    return false;
  }
  
  log('green', '✅ API key found');

  // Test 2: Check website configuration
  log('yellow', '📋 Checking website configuration...');
  const searchUrls = generateAllSearchUrls('test product');
  
  if (searchUrls.length === 0) {
    log('red', '❌ No websites configured');
    return false;
  }
  
  log('green', `✅ ${searchUrls.length} websites configured:`);
  searchUrls.forEach(site => {
    console.log(`   - ${site.name}`);
  });

  return true;
}

async function testProductCategoryDetection() {
  log('cyan', '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('bright', '🧪 TEST 2: Product Category Detection');
  log('cyan', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const testCases = [
    { query: 'Intel Core i7-13700K', expected: 'processor' },
    { query: 'RTX 4070 Ti graphics card', expected: 'graphics_card' },
    { query: 'Samsung 980 Pro NVMe SSD', expected: 'storage' },
    { query: 'ASUS ROG Strix motherboard', expected: 'motherboard' },
  ];

  for (const test of testCases) {
    const detected = detectProductCategory(test.query);
    const passed = detected === test.expected;
    
    if (passed) {
      log('green', `✅ "${test.query}" → ${detected}`);
    } else {
      log('red', `❌ "${test.query}" → ${detected} (expected: ${test.expected})`);
    }
  }
}

async function testSimpleScraping() {
  log('cyan', '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('bright', '🧪 TEST 3: Simple Product Search');
  log('cyan', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  log('yellow', '🔍 Searching for a popular product...');
  log('dim', 'This may take 30-60 seconds...\n');

  try {
    const result = await runScrapingAgent(
      'Find the price of Intel Core i7 processor on Startech',
      { maxSteps: 5, verbose: false }
    );

    if (result.success) {
      log('green', '✅ Agent executed successfully!');
      log('bright', '\n📊 Results:');
      log('dim', '─'.repeat(80));
      console.log(result.response);
      log('dim', '─'.repeat(80));
      log('cyan', `\n📈 Stats: ${result.toolCalls} tool calls in ${result.steps?.length || 0} steps`);
    } else {
      log('red', '❌ Agent failed:');
      console.error(result.error);
    }
  } catch (error) {
    log('red', '❌ Test failed with error:');
    console.error(error);
  }
}

async function testPriceComparison() {
  log('cyan', '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('bright', '🧪 TEST 4: Price Comparison (Advanced)');
  log('cyan', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  log('yellow', '⚖️  Comparing products across multiple sites...');
  log('dim', 'This may take 60-90 seconds...\n');

  try {
    const result = await runScrapingAgent(
      'Compare the price of AMD Ryzen 7 7700X processor on Startech, Techland, and Ryans. Show me the best deal.',
      { maxSteps: 10, verbose: false }
    );

    if (result.success) {
      log('green', '✅ Comparison completed!');
      log('bright', '\n📊 Comparison Results:');
      log('dim', '─'.repeat(80));
      console.log(result.response);
      log('dim', '─'.repeat(80));
      log('cyan', `\n📈 Stats: ${result.toolCalls} tool calls in ${result.steps?.length || 0} steps`);
    } else {
      log('red', '❌ Comparison failed:');
      console.error(result.error);
    }
  } catch (error) {
    log('red', '❌ Test failed with error:');
    console.error(error);
  }
}

async function testAvailabilityCheck() {
  log('cyan', '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('bright', '🧪 TEST 5: Availability Check');
  log('cyan', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  log('yellow', '📦 Checking product availability...');
  log('dim', 'This may take 30-45 seconds...\n');

  try {
    const result = await runScrapingAgent(
      'Check if RTX 4070 graphics card is in stock at Startech',
      { maxSteps: 5, verbose: false }
    );

    if (result.success) {
      log('green', '✅ Availability check completed!');
      log('bright', '\n📊 Results:');
      log('dim', '─'.repeat(80));
      console.log(result.response);
      log('dim', '─'.repeat(80));
    } else {
      log('red', '❌ Check failed:');
      console.error(result.error);
    }
  } catch (error) {
    log('red', '❌ Test failed with error:');
    console.error(error);
  }
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runAllTests() {
  log('magenta', '\n╔════════════════════════════════════════════════════════════╗');
  log('magenta', '║        AI WEB SCRAPING AGENT - TEST SUITE                 ║');
  log('magenta', '╚════════════════════════════════════════════════════════════╝\n');

  const startTime = Date.now();

  // Run tests
  const setupOk = await testBasicSetup();
  
  if (!setupOk) {
    log('red', '\n❌ Setup verification failed. Please fix the issues above.\n');
    process.exit(1);
  }

  await testProductCategoryDetection();

  // Ask user if they want to run live tests
  log('yellow', '\n⚠️  The following tests will make actual API calls and web requests.');
  log('yellow', 'This may take a few minutes and consume API quota.\n');
  
  // For automated testing, skip interactive prompt
  const shouldRunLiveTests = process.argv.includes('--live') || process.argv.includes('--all');

  if (shouldRunLiveTests) {
    log('green', '▶️  Running live tests...\n');
    
    await testSimpleScraping();
    await testPriceComparison();
    await testAvailabilityCheck();
  } else {
    log('cyan', '💡 To run live tests, use: npm test -- --live\n');
  }

  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  log('magenta', '\n╔════════════════════════════════════════════════════════════╗');
  log('magenta', '║                    TEST COMPLETE                          ║');
  log('magenta', '╚════════════════════════════════════════════════════════════╝\n');
  log('green', `✅ All tests completed in ${duration}s`);
  log('cyan', '\n📚 Next steps:');
  console.log('   1. Test the React component: npm run dev');
  console.log('   2. Try the API endpoint: POST to /api/scrape');
  console.log('   3. Read the full docs in README.md\n');
}

// ============================================================================
// INTERACTIVE MODE
// ============================================================================

async function interactiveMode() {
  log('magenta', '\n╔════════════════════════════════════════════════════════════╗');
  log('magenta', '║          AI WEB SCRAPING AGENT - INTERACTIVE MODE         ║');
  log('magenta', '╚════════════════════════════════════════════════════════════╝\n');

  log('cyan', 'Enter your query (or "exit" to quit):\n');

  // Simple REPL
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('> ', async (query: string) => {
    if (query.toLowerCase() === 'exit') {
      log('yellow', '\nGoodbye! 👋\n');
      rl.close();
      return;
    }

    log('yellow', '\n🤖 Processing your query...\n');

    const result = await runScrapingAgent(query, {
      maxSteps: 10,
      verbose: false,
    });

    if (result.success) {
      log('green', '✅ Results:\n');
      log('dim', '─'.repeat(80));
      console.log(result.response);
      log('dim', '─'.repeat(80) + '\n');
    } else {
      log('red', '❌ Error:\n');
      console.error(result.error);
    }

    rl.close();
  });
}

// ============================================================================
// RUN
// ============================================================================

const args = process.argv.slice(2);

if (args.includes('--interactive') || args.includes('-i')) {
  interactiveMode().catch(console.error);
} else {
  runAllTests().catch(console.error);
}

// Export for use in other scripts
export { 
  testBasicSetup, 
  testProductCategoryDetection, 
  testSimpleScraping, 
  testPriceComparison,
  testAvailabilityCheck 
};