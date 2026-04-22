"use client"

import { useMemo } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts"
import { useDashboardStore } from "@/lib/store"

export function ForecastChart() {
  const { kpiData, forecastParams } = useDashboardStore()

  // Calculate projected growth based on forecast params
  const projectedGrowth = useMemo(() => {
    const marketingMultiplier = 1 + (forecastParams.marketingBudget - 50) * 0.004
    const growthMultiplier = 1 + (forecastParams.customerGrowth - 50) * 0.005
    const conversionMultiplier = 1 + (forecastParams.conversionRate - 50) * 0.003
    const pricingMultiplier = 1 + (forecastParams.pricing - 50) * 0.002
    
    return marketingMultiplier * growthMultiplier * conversionMultiplier * pricingMultiplier - 1
  }, [forecastParams])

  const forecastData = useMemo(() => {
    const baseValue = 72000
    return [
      { month: "Jan", actual: 42000, forecast: null },
      { month: "Feb", actual: 48000, forecast: null },
      { month: "Mar", actual: 52000, forecast: null },
      { month: "Apr", actual: 58000, forecast: null },
      { month: "May", actual: 64000, forecast: null },
      { month: "Jun", actual: baseValue, forecast: baseValue },
      { month: "Jul", actual: null, forecast: Math.round(baseValue * (1 + projectedGrowth * 0.17)) },
      { month: "Aug", actual: null, forecast: Math.round(baseValue * (1 + projectedGrowth * 0.33)) },
      { month: "Sep", actual: null, forecast: Math.round(baseValue * (1 + projectedGrowth * 0.5)) },
      { month: "Oct", actual: null, forecast: Math.round(baseValue * (1 + projectedGrowth * 0.67)) },
      { month: "Nov", actual: null, forecast: Math.round(baseValue * (1 + projectedGrowth * 0.83)) },
      { month: "Dec", actual: null, forecast: Math.round(baseValue * (1 + projectedGrowth)) },
    ]
  }, [projectedGrowth])

  const projectedValue = forecastData[forecastData.length - 1]?.forecast || 0
  const projectedPercent = ((projectedValue - 72000) / 72000 * 100).toFixed(0)

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="font-semibold">Revenue Forecast</h3>
          <p className="text-sm text-muted-foreground">AI-powered prediction for 2026</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span className="text-muted-foreground">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full border-2 border-dashed border-primary bg-transparent" />
            <span className="text-muted-foreground">Forecast</span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-3xl font-semibold">${Math.round(projectedValue / 1000)}K</span>
          <span className={`text-sm ${Number(projectedPercent) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {Number(projectedPercent) >= 0 ? "+" : ""}{projectedPercent}% projected growth
          </span>
        </div>

        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#666", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#666", fontSize: 12 }}
                tickFormatter={(value) => `$${value / 1000}k`}
                dx={-10}
              />
              <ReferenceLine
                x="Jun"
                stroke="rgba(99, 145, 255, 0.3)"
                strokeDasharray="3 3"
                label={{
                  value: "Today",
                  position: "top",
                  fill: "#666",
                  fontSize: 11,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(18, 18, 24, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}
                labelStyle={{ color: "#fff", fontWeight: 600 }}
                formatter={(value: number | null, name: string) => [
                  value ? `$${value.toLocaleString()}` : "—",
                  name === "actual" ? "Actual" : "Forecast",
                ]}
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#6391FF"
                strokeWidth={2.5}
                dot={{ fill: "#6391FF", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: "#6391FF", stroke: "#fff", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#6391FF"
                strokeWidth={2.5}
                strokeDasharray="8 4"
                dot={{ fill: "transparent", stroke: "#6391FF", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "#6391FF", stroke: "#fff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
