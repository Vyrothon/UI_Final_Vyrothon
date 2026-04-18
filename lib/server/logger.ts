type LogContext = Record<string, unknown>

function sanitize(context?: LogContext) {
  if (!context) return undefined
  const scrubbed: LogContext = {}
  for (const [key, value] of Object.entries(context)) {
    if (/key|secret|token|password|authorization/i.test(key)) {
      scrubbed[key] = "[REDACTED]"
      continue
    }
    scrubbed[key] = value
  }
  return scrubbed
}

export function logInfo(message: string, context?: LogContext) {
  console.info(message, sanitize(context))
}

export function logError(message: string, context?: LogContext) {
  console.error(message, sanitize(context))
}
