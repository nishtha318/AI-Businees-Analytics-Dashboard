"use client"

import { useMemo } from "react"
import { useDashboardStore } from "@/lib/store"
import { TrendingUp, DollarSign, Target, AlertTriangle } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts"

export function ForecastsView() {
  const { kpiData, forecastParams, setForecastParams } = useDashboardStore()

  // Calculate projected revenue based on sliders
  const baseRevenue = kpiData.revenue
  
  const projectedRevenue = useMemo(() => {
    const marketingMultiplier = 1 + (forecastParams.marketingBudget - 50) * 0.004
    const growthMultiplier = 1 + (forecastParams.customerGrowth - 50) * 0.005
    const conversionMultiplier = 1 + (forecastParams.conversionRate - 50) * 0.003
    const pricingMultiplier = 1 + (forecastParams.pricing - 50) * 0.002
    
    return baseRevenue * marketingMultiplier * growthMultiplier * conversionMultiplier * pricingMultiplier
  }, [baseRevenue, forecastParams])

  const growthPercent = ((projectedRevenue - baseRevenue) / baseRevenue) * 100

  // Generate Monte Carlo-style projection data
  const forecastData = useMemo(() => {
    const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const baseGrowth = growthPercent / 100
    
    return months.map((month, i) => {
      const progress = (i + 1) / months.length
      const variance = 0.1 * (1 - progress * 0.5)
      
      const projected = baseRevenue * (1 + baseGrowth * progress)
      const optimistic = projected * (1 + variance)
      const conservative = projected * (1 - variance)
      
      return {
        month,
        projected: Math.round(projected / 1000),
        optimistic: Math.round(optimistic / 1000),
        conservative: Math.round(conservative / 1000),
      }
    })
  }, [baseRevenue, growthPercent])

  // Historical + forecast combined data
  const combinedData = useMemo(() => {
    const historical = [
      { month: "Jan", actual: 42, projected: null, optimistic: null, conservative: null },
      { month: "Feb", actual: 48, projected: null, optimistic: null, conservative: null },
      { month: "Mar", actual: 52, projected: null, optimistic: null, conservative: null },
      { month: "Apr", actual: 58, projected: null, optimistic: null, conservative: null },
      { month: "May", actual: 64, projected: null, optimistic: null, conservative: null },
      { month: "Jun", actual: 72, projected: 72, optimistic: null, conservative: null },
    ]
    
    const forecast = forecastData.map((d) => ({
      month: d.month,
      actual: null,
      projected: d.projected,
      optimistic: d.optimistic,
      conservative: d.conservative,
    }))
    
    return [...historical, ...forecast]
  }, [forecastData])

  const scenarios = [
    {
      title: "Best Case",
      value: forecastData[forecastData.length - 1]?.optimistic || 0,
      change: ((forecastData[forecastData.length - 1]?.optimistic || 0) / 72 - 1) * 100,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      title: "Projected",
      value: forecastData[forecastData.length - 1]?.projected || 0,
      change: growthPercent,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Conservative",
      value: forecastData[forecastData.length - 1]?.conservative || 0,
      change: ((forecastData[forecastData.length - 1]?.conservative || 0) / 72 - 1) * 100,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
  ]

  const sliders = [
    {
      label: "Marketing Budget",
      key: "marketingBudget" as const,
      value: forecastParams.marketingBudget,
      description: "Investment in marketing campaigns",
    },
    {
      label: "Customer Growth",
      key: "customerGrowth" as const,
      value: forecastParams.customerGrowth,
      description: "Expected new customer acquisition",
    },
    {
      label: "Conversion Rate",
      key: "conversionRate" as const,
      value: forecastParams.conversionRate,
      description: "Trial to paid conversion",
    },
    {
      label: "Pricing Strategy",
      key: "pricing" as const,
      value: forecastParams.pricing,
      description: "Price point adjustments",
    },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Scenario Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {scenarios.map((scenario) => (
          <div
            key={scenario.title}
            className="overflow-hidden rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{scenario.title}</p>
              <div className={cn("rounded-full px-2 py-1 text-xs font-medium", scenario.bg, scenario.color)}>
                {scenario.change > 0 ? "+" : ""}{scenario.change.toFixed(1)}%
              </div>
            </div>
            <p className={cn("mt-2 text-3xl font-semibold", scenario.color)}>
              ${scenario.value}K
            </p>
            <p className="mt-1 text-xs text-muted-foreground">End of year projection</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart */}
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Revenue Forecast</h3>
              <p className="text-sm text-muted-foreground">Monte Carlo simulation with confidence bands</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">Projected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-muted-foreground">Range</span>
              </div>
            </div>
          </div>

          <div className="mt-4 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={combinedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="rangeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4CD6A5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4CD6A5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#666", fontSize: 12 }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 12 }}
                  tickFormatter={(v) => `$${v}K`}
                />
                <ReferenceLine
                  x="Jun"
                  stroke="rgba(99, 145, 255, 0.3)"
                  strokeDasharray="3 3"
                  label={{ value: "Today", position: "top", fill: "#666", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(18, 18, 24, 0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                  formatter={(v: number | null, name: string) => [
                    v ? `$${v}K` : "—",
                    name === "actual" ? "Actual" : name === "projected" ? "Projected" : name === "optimistic" ? "Best Case" : "Conservative",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="optimistic"
                  stroke="transparent"
                  fill="url(#rangeGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="conservative"
                  stroke="transparent"
                  fill="transparent"
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#6391FF"
                  strokeWidth={2.5}
                  dot={{ fill: "#6391FF", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="projected"
                  stroke="#6391FF"
                  strokeWidth={2.5}
                  strokeDasharray="8 4"
                  dot={{ fill: "transparent", stroke: "#6391FF", strokeWidth: 2, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Simulation Controls */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold">Simulation Parameters</h3>
          <p className="text-sm text-muted-foreground">Adjust to see projected impact</p>

          <div className="mt-6 space-y-6">
            {sliders.map((slider) => (
              <div key={slider.key}>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">{slider.label}</label>
                  <span className="text-sm text-primary">{slider.value}%</span>
                </div>
                <p className="text-xs text-muted-foreground">{slider.description}</p>
                <Slider
                  className="mt-3"
                  value={[slider.value]}
                  onValueChange={([value]) => setForecastParams({ [slider.key]: value })}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
            ))}
          </div>

          {/* Impact Summary */}
          <div className="mt-6 rounded-lg border border-border bg-secondary/30 p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Projected Impact</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Revenue Change</p>
                <p className={cn(
                  "text-lg font-semibold",
                  growthPercent >= 0 ? "text-emerald-400" : "text-red-400"
                )}>
                  {growthPercent >= 0 ? "+" : ""}{growthPercent.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">New Revenue</p>
                <p className="text-lg font-semibold text-primary">
                  ${(projectedRevenue / 1000000).toFixed(2)}M
                </p>
              </div>
            </div>
          </div>

          {growthPercent < 0 && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-400/30 bg-amber-400/5 p-3">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
              <p className="text-xs text-amber-400">
                Current parameters project negative growth. Consider increasing marketing or pricing.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
