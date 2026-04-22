"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDashboardStore } from "@/lib/store"
import { useAnimatedCounter, formatNumber } from "@/hooks/use-animated-counter"
import { Area, AreaChart, ResponsiveContainer } from "recharts"

function SparklineChart({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((value, index) => ({ value, index }))
  
  return (
    <div className="h-8 w-16">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#spark-${color})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function AnimatedKPICard({
  title,
  value,
  change,
  type,
  icon: Icon,
  sparklineData,
}: {
  title: string
  value: number
  change: number
  type: "currency" | "number" | "percent"
  icon: typeof DollarSign
  sparklineData: number[]
}) {
  const { value: animatedValue } = useAnimatedCounter(value, 1200)
  const trend = change >= 0 ? "up" : "down"
  const sparkColor = trend === "up" ? "#4CD6A5" : "#FF6B6B"

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-[0_0_30px_var(--glow)]">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <SparklineChart data={sparklineData} color={sparkColor} />
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-2xl font-semibold tracking-tight tabular-nums">
              {formatNumber(animatedValue, type)}
            </p>
            <div
              className={cn(
                "flex items-center gap-0.5 text-sm font-medium",
                trend === "up" ? "text-emerald-400" : "text-red-400"
              )}
            >
              {trend === "up" ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              {Math.abs(change).toFixed(1)}%
            </div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">vs last month</p>
        </div>
      </div>
    </div>
  )
}

export function KPICards() {
  const { kpiData, updateKPIData } = useDashboardStore()
  const [sparklines, setSparklines] = useState({
    revenue: [40, 55, 45, 60, 70, 65, 75, 80, 72, 85, 90, 100],
    users: [30, 35, 42, 38, 45, 50, 55, 48, 58, 62, 68, 72],
    conversions: [50, 55, 52, 48, 45, 50, 48, 42, 45, 40, 38, 42],
    engagement: [40, 45, 50, 55, 52, 58, 62, 60, 65, 68, 72, 75],
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const variation = () => (Math.random() - 0.5) * 0.02

      updateKPIData({
        revenue: kpiData.revenue * (1 + variation()),
        users: Math.round(kpiData.users * (1 + variation())),
        conversions: Math.round(kpiData.conversions * (1 + variation())),
        engagement: Math.max(0, Math.min(100, kpiData.engagement + (Math.random() - 0.5) * 0.5)),
      })

      // Update sparklines
      setSparklines((prev) => ({
        revenue: [...prev.revenue.slice(1), prev.revenue[prev.revenue.length - 1] + (Math.random() - 0.4) * 5],
        users: [...prev.users.slice(1), prev.users[prev.users.length - 1] + (Math.random() - 0.4) * 3],
        conversions: [...prev.conversions.slice(1), prev.conversions[prev.conversions.length - 1] + (Math.random() - 0.5) * 4],
        engagement: [...prev.engagement.slice(1), prev.engagement[prev.engagement.length - 1] + (Math.random() - 0.4) * 2],
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [kpiData, updateKPIData])

  const kpis = [
    {
      title: "Total Revenue",
      value: kpiData.revenue,
      change: kpiData.revenueChange,
      type: "currency" as const,
      icon: DollarSign,
      sparklineData: sparklines.revenue,
    },
    {
      title: "Active Users",
      value: kpiData.users,
      change: kpiData.usersChange,
      type: "number" as const,
      icon: Users,
      sparklineData: sparklines.users,
    },
    {
      title: "Conversions",
      value: kpiData.conversions,
      change: kpiData.conversionsChange,
      type: "number" as const,
      icon: ShoppingCart,
      sparklineData: sparklines.conversions,
    },
    {
      title: "Engagement Rate",
      value: kpiData.engagement,
      change: kpiData.engagementChange,
      type: "percent" as const,
      icon: Activity,
      sparklineData: sparklines.engagement,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <AnimatedKPICard key={kpi.title} {...kpi} />
      ))}
    </div>
  )
}
