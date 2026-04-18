/**
 * Client-only persisted scan state (sessionStorage) for the bill flow and cross-page sync.
 */
import type { DemoScanScenario } from "@/lib/dashboard-demo-data"

export const DEMO_SCAN_STORAGE_KEY = "clearclaim_demo_scan_v2"

export type DemoScanPayload = {
  fileNames: string[]
  analyzedAt: number
  scenario: DemoScanScenario
}

export function pickDemoScenario(fileNames: string[]): DemoScanScenario {
  const blob = fileNames.join(" ").toLowerCase()
  if (blob.includes("clean") || blob.includes("aku") || blob.includes("minor")) {
    return "clean"
  }
  return "fraud"
}

export function readDemoScan(): DemoScanPayload | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(DEMO_SCAN_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as DemoScanPayload
    if (!Array.isArray(parsed.fileNames) || typeof parsed.analyzedAt !== "number") return null
    if (parsed.scenario !== "fraud" && parsed.scenario !== "clean") {
      parsed.scenario = "fraud"
    }
    return parsed
  } catch {
    return null
  }
}

export function writeDemoScan(payload: DemoScanPayload) {
  if (typeof window === "undefined") return
  sessionStorage.setItem(DEMO_SCAN_STORAGE_KEY, JSON.stringify(payload))
}

export function clearDemoScan() {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(DEMO_SCAN_STORAGE_KEY)
}
