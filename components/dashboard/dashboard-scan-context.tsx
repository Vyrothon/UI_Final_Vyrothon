"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { DemoScanScenario } from "@/lib/dashboard-demo-data"
import {
  clearDemoScan,
  DEMO_SCAN_STORAGE_KEY,
  readDemoScan,
  writeDemoScan,
  type DemoScanPayload,
} from "@/lib/dashboard-upload-demo"

const SCAN_EVENT = "clearclaim-scan-updated"

type DashboardScanContextValue = {
  scan: DemoScanPayload | null
  hasAnalysis: boolean
  scenario: DemoScanScenario | null
  setScanPayload: (payload: DemoScanPayload) => void
  clearScanPayload: () => void
  refreshFromStorage: () => void
}

const DashboardScanContext = createContext<DashboardScanContextValue | null>(null)

export function DashboardScanProvider({ children }: { children: ReactNode }) {
  const [scan, setScan] = useState<DemoScanPayload | null>(null)

  const refreshFromStorage = useCallback(() => {
    setScan(readDemoScan())
  }, [])

  useEffect(() => {
    refreshFromStorage()
  }, [refreshFromStorage])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === DEMO_SCAN_STORAGE_KEY) {
        refreshFromStorage()
      }
    }
    const onCustom = () => refreshFromStorage()
    window.addEventListener("storage", onStorage)
    window.addEventListener(SCAN_EVENT, onCustom)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener(SCAN_EVENT, onCustom)
    }
  }, [refreshFromStorage])

  const setScanPayload = useCallback((payload: DemoScanPayload) => {
    writeDemoScan(payload)
    setScan(payload)
    window.dispatchEvent(new Event(SCAN_EVENT))
  }, [])

  const clearScanPayload = useCallback(() => {
    clearDemoScan()
    setScan(null)
    window.dispatchEvent(new Event(SCAN_EVENT))
  }, [])

  const value = useMemo<DashboardScanContextValue>(
    () => ({
      scan,
      hasAnalysis: scan != null,
      scenario: scan?.scenario ?? null,
      setScanPayload,
      clearScanPayload,
      refreshFromStorage,
    }),
    [scan, setScanPayload, clearScanPayload, refreshFromStorage],
  )

  return <DashboardScanContext.Provider value={value}>{children}</DashboardScanContext.Provider>
}

export function useDashboardScan() {
  const ctx = useContext(DashboardScanContext)
  if (!ctx) {
    throw new Error("useDashboardScan must be used within DashboardScanProvider")
  }
  return ctx
}
