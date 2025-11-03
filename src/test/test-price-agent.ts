import { priceAgent } from "../agents/price-agent";

async function testAgent() {
  console.log("\n🧪 Testing AI Web Scraping Agent\n");
  console.log("= ".repeat(70));
  console.log("Test Query");
  console.log("= ".repeat(70));

  try {
    const result = await priceAgent(
      `Price and  Specification  of  AMD Ryzen 7 7700 Processor in startech?`
    );
    console.log("\nResult:\n");
    console.log(result);
  } catch (error) {
    console.error("\nError: ", error);
  }
}

testAgent();
