type LogLevel = "info" | "warn" | "error" | "debug"

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, unknown>
}

function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  }

  if (process.env.NODE_ENV === "development") {
    const colors = { info: "\x1b[36m", warn: "\x1b[33m", error: "\x1b[31m", debug: "\x1b[90m" }
    console.log(`${colors[level]}[${entry.level.toUpperCase()}]\x1b[0m ${entry.message}`, context ?? "")
  } else {
    console.log(JSON.stringify(entry))
  }
}

export const logger = {
  info: (msg: string, ctx?: Record<string, unknown>) => log("info", msg, ctx),
  warn: (msg: string, ctx?: Record<string, unknown>) => log("warn", msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>) => log("error", msg, ctx),
  debug: (msg: string, ctx?: Record<string, unknown>) => log("debug", msg, ctx),
}
