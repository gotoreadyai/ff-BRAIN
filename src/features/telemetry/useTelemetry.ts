// path: src/features/telemetry/useTelemetry.ts

import { useState, useEffect } from 'react'
import type { TelemetrySnapshot } from '../../engine/db'

/**
 * Mock telemetry hook - simulates Google Fit API
 * In production, this would fetch real data from Google Fit API
 */
export function useTelemetry() {
  const [telemetry, setTelemetry] = useState<TelemetrySnapshot | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      const mockData: TelemetrySnapshot = {
        avgSleepHours: 7.2,
        avgSteps: 8500,
        avgHeartRate: 68,
        avgCaloriesBurned: 2200,
        weight: 78,
        bodyFat: 18,
        lastUpdated: new Date().toISOString()
      }
      setTelemetry(mockData)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  const updateTelemetry = (updates: Partial<TelemetrySnapshot>) => {
    if (!telemetry) return
    setTelemetry({
      ...telemetry,
      ...updates,
      lastUpdated: new Date().toISOString()
    })
  }

  return {
    telemetry,
    isLoading,
    updateTelemetry
  }
}

/**
 * Simulates daily telemetry variation for realism
 */
export function generateDailyVariation(base: TelemetrySnapshot): TelemetrySnapshot {
  return {
    ...base,
    avgSleepHours: base.avgSleepHours + (Math.random() - 0.5) * 1.5,
    avgSteps: Math.round(base.avgSteps + (Math.random() - 0.5) * 2000),
    avgHeartRate: Math.round(base.avgHeartRate + (Math.random() - 0.5) * 5),
    avgCaloriesBurned: Math.round(base.avgCaloriesBurned + (Math.random() - 0.5) * 300),
    lastUpdated: new Date().toISOString()
  }
}
