/**
 * Log Viewer Utility
 * Helper script to view and analyze agent logs
 */

import fs from "fs";
import path from "path";

const logsDir = path.join(process.cwd(), "logs");

interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  [key: string]: any;
}

/**
 * Read and parse log file
 */
function readLogFile(filename: string): LogEntry[] {
  const filePath = path.join(logsDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Log file not found: ${filename}`);
    return [];
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.trim().split("\n").filter(line => line.trim());
  
  return lines.map(line => {
    try {
      return JSON.parse(line);
    } catch {
      return { level: "unknown", message: line, timestamp: "" };
    }
  });
}

/**
 * Display sub-agent errors
 */
export function viewSubAgentErrors() {
  console.log("\n" + "=".repeat(70));
  console.log("🔍 Sub-Agent Errors");
  console.log("=".repeat(70) + "\n");

  const logs = readLogFile("sub-agents.log");
  const errors = logs.filter(log => log.level === "error");

  if (errors.length === 0) {
    console.log("✅ No errors found!");
    return;
  }

  errors.forEach((error, index) => {
    console.log(`\n${index + 1}. ${error.message}`);
    console.log(`   Time: ${error.timestamp}`);
    console.log(`   Website: ${error.website || "Unknown"}`);
    
    if (error.error) {
      console.log(`   Error: ${error.error}`);
    }
    
    if (error.context) {
      console.log(`   Context:`, JSON.stringify(error.context, null, 2));
    }
    
    if (error.stack) {
      console.log(`   Stack: ${error.stack.substring(0, 200)}...`);
    }
  });

  console.log("\n" + "=".repeat(70) + "\n");
}

/**
 * Display sub-agent warnings
 */
export function viewSubAgentWarnings() {
  console.log("\n" + "=".repeat(70));
  console.log("⚠️  Sub-Agent Warnings");
  console.log("=".repeat(70) + "\n");

  const logs = readLogFile("sub-agents.log");
  const warnings = logs.filter(log => log.level === "warn");

  if (warnings.length === 0) {
    console.log("✅ No warnings found!");
    return;
  }

  warnings.forEach((warning, index) => {
    console.log(`\n${index + 1}. ${warning.message}`);
    console.log(`   Time: ${warning.timestamp}`);
    console.log(`   Website: ${warning.website || "Unknown"}`);
    
    if (warning.context) {
      console.log(`   Context:`, JSON.stringify(warning.context, null, 2));
    }
  });

  console.log("\n" + "=".repeat(70) + "\n");
}

/**
 * Display success summary
 */
export function viewSuccessSummary() {
  console.log("\n" + "=".repeat(70));
  console.log("📊 Success Summary");
  console.log("=".repeat(70) + "\n");

  const logs = readLogFile("sub-agents.log");
  const completions = logs.filter(log => 
    log.message && log.message.includes("Multi-site search completed")
  );

  if (completions.length === 0) {
    console.log("❌ No completed searches found!");
    return;
  }

  const latest = completions[completions.length - 1];
  
  console.log(`Total Searched: ${latest.totalSearched}`);
  console.log(`✅ Successful: ${latest.successCount}`);
  console.log(`❌ Failed: ${latest.failedCount}`);
  console.log(`Success Rate: ${latest.successRate}`);
  
  console.log(`\n✅ Successful Sites:`);
  latest.successfulSites?.forEach((site: string) => {
    console.log(`   - ${site}`);
  });
  
  console.log(`\n❌ Failed Sites:`);
  latest.failedSites?.forEach((failure: any) => {
    console.log(`   - ${failure.site}: ${failure.error}`);
  });

  console.log("\n" + "=".repeat(70) + "\n");
}

/**
 * Display all logs
 */
export function viewAllLogs(logType: "combined" | "sub-agents" | "error" = "combined") {
  console.log("\n" + "=".repeat(70));
  console.log(`📄 ${logType.toUpperCase()} Logs`);
  console.log("=".repeat(70) + "\n");

  const logs = readLogFile(`${logType}.log`);

  if (logs.length === 0) {
    console.log("❌ No logs found!");
    return;
  }

  logs.forEach((log, index) => {
    const level = log.level.toUpperCase().padEnd(5);
    console.log(`${index + 1}. [${level}] ${log.timestamp} - ${log.message}`);
    
    // Show additional context for errors
    if (log.level === "error" && log.error) {
      console.log(`   Error: ${log.error}`);
    }
  });

  console.log(`\nTotal entries: ${logs.length}`);
  console.log("=".repeat(70) + "\n");
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('view-logs.ts')) {
  const command = process.argv[2] || "summary";

  switch (command) {
    case "errors":
      viewSubAgentErrors();
      break;
    case "warnings":
      viewSubAgentWarnings();
      break;
    case "summary":
      viewSuccessSummary();
      break;
    case "all":
      viewAllLogs("combined");
      break;
    case "sub-agents":
      viewAllLogs("sub-agents");
      break;
    default:
      console.log(`
Usage: bun run src/lib/agents/view-logs.ts [command]

Commands:
  summary    - Show success/failure summary (default)
  errors     - Show all sub-agent errors
  warnings   - Show all sub-agent warnings
  all        - Show all combined logs
  sub-agents - Show all sub-agent logs
      `);
  }
}
