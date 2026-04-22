"use client"

import { useEffect, useState, useCallback } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { useDashboardStore } from "@/lib/store"

export function SalesChart() {
  const { salesData, addSalesDataPoint, selectedRegion } = useDashboardStore()
  const [isLive, setIsLive] = useState(true)

  const generateDataPoint = useCallback(() => {
    const now = new Date()
    const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
    
    const lastPoint = salesData[salesData.length - 1]
    const variation = 0.15
    
    const baseSales = lastPoint?.sales || 4000
    const baseOrders = lastPoint?.orders || 300
    
    // Add some randomness with trend
    const salesChange = baseSales * (Math.random() * variation * 2 - variation)
    const ordersChange = baseOrders * (Math.random() * variation * 2 - variation)
    
    return {
      time,
      sales: Math.max(1000, Math.round(baseSales + salesChange)),
      orders: Math.max(100, Math.round(baseOrders + ordersChange)),
    }
  }, [salesData])

  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      addSalesDataPoint(generateDataPoint())
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive, addSalesDataPoint, generateDataPoint])

  // Apply region filter
  const filteredData = selectedRegion
    ? salesData.map((point) => ({
        ...point,
        sales: Math.round(point.sales * (selectedRegion === "North America" ? 0.35 : 
               selectedRegion === "Europe" ? 0.28 : 
               selectedRegion === "Asia Pacific" ? 0.22 : 0.15)),
        orders: Math.round(point.orders * (selectedRegion === "North America" ? 0.35 : 
               selectedRegion === "Europe" ? 0.28 : 
               selectedRegion === "Asia Pacific" ? 0.22 : 0.15)),
      }))
    : salesData

  const totalSales = filteredData.reduce((sum, d) => sum + d.sales, 0)
  const totalOrders = filteredData.reduce((sum, d) => sum + d.orders, 0)

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="font-semibold">Live Sales</h3>
          <p className="text-sm text-muted-foreground">
            {selectedRegion ? `${selectedRegion} region` : "Real-time sales activity"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsLive(!isLive)}
            className="flex items-center gap-2 text-sm"
          >
            <span className={`flex h-2 w-2 rounded-full ${isLive ? "animate-pulse bg-emerald-400" : "bg-muted-foreground"}`} />
            <span className="text-muted-foreground">{isLive ? "Live" : "Paused"}</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 border-b border-border px-5 py-3">
        <div>
          <p className="text-xs text-muted-foreground">Total Sales</p>
          <p className="text-lg font-semibold text-primary">${(totalSales / 1000).toFixed(1)}K</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total Orders</p>
          <p className="text-lg font-semibold">{totalOrders.toLocaleString()}</p>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span className="text-muted-foreground">Sales</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-chart-2" />
            <span className="text-muted-foreground">Orders</span>
          </div>
        </div>

        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6391FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6391FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CD6A5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4CD6A5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#666", fontSize: 11 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#666", fontSize: 11 }}
                tickFormatter={(value) => `$${value / 1000}k`}
                dx={-10}
                width={45}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(18, 18, 24, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}
                labelStyle={{ color: "#fff", fontWeight: 600 }}
                itemStyle={{ color: "#aaa" }}
                formatter={(value: number, name: string) => [
                  name === "sales" ? `$${value.toLocaleString()}` : value,
                  name === "sales" ? "Sales" : "Orders",
                ]}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#6391FF"
                strokeWidth={2}
                fill="url(#salesGradient)"
                isAnimationActive={true}
                animationDuration={300}
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#4CD6A5"
                strokeWidth={2}
                fill="url(#ordersGradient)"
                isAnimationActive={true}
                animationDuration={300}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
