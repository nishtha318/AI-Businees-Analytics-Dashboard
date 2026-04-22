"use client"

import { useDashboardStore } from "@/lib/store"
import { TrendingUp, TrendingDown, Globe, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { WorldMap } from "@/components/dashboard/world-map"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const marketDetails = {
  "North America": {
    countries: ["United States", "Canada", "Mexico"],
    customers: 12400,
    avgOrderValue: 245,
    topProduct: "Enterprise Suite",
  },
  "Europe": {
    countries: ["UK", "Germany", "France", "Netherlands"],
    customers: 8600,
    avgOrderValue: 198,
    topProduct: "Analytics Pro",
  },
  "Asia Pacific": {
    countries: ["Japan", "Singapore", "Australia", "South Korea"],
    customers: 6200,
    avgOrderValue: 312,
    topProduct: "API Access",
  },
  "South America": {
    countries: ["Brazil", "Argentina", "Chile"],
    customers: 2800,
    avgOrderValue: 156,
    topProduct: "Data Pipeline",
  },
  "Africa": {
    countries: ["South Africa", "Nigeria", "Kenya"],
    customers: 1200,
    avgOrderValue: 142,
    topProduct: "Insights Dashboard",
  },
}

export function MarketsView() {
  const { regionData, selectedRegion, setSelectedRegion } = useDashboardStore()

  const chartData = regionData.map((r) => ({
    name: r.name.split(" ")[0],
    revenue: r.value / 1000,
    growth: r.growth,
  }))

  const selectedDetails = selectedRegion
    ? marketDetails[selectedRegion as keyof typeof marketDetails]
    : null

  return (
    <div className="space-y-6 p-6">
      {/* Region Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {regionData.map((region) => (
          <button
            key={region.name}
            onClick={() => setSelectedRegion(selectedRegion === region.name ? null : region.name)}
            className={cn(
              "group overflow-hidden rounded-xl border bg-card p-4 text-left transition-all",
              selectedRegion === region.name
                ? "border-primary shadow-[0_0_20px_var(--glow)]"
                : "border-border hover:border-primary/50"
            )}
          >
            <div className="flex items-center justify-between">
              <Globe className={cn(
                "h-5 w-5",
                selectedRegion === region.name ? "text-primary" : "text-muted-foreground"
              )} />
              <div
                className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  region.growth >= 15 ? "text-emerald-400" : "text-amber-400"
                )}
              >
                {region.growth >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {region.growth}%
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs text-muted-foreground">{region.name}</p>
              <p className="mt-1 text-lg font-semibold">
                ${(region.value / 1000).toFixed(0)}K
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map */}
        <div className="lg:col-span-2">
          <WorldMap />
        </div>

        {/* Region Details */}
        <div className="rounded-xl border border-border bg-card p-5">
          {selectedRegion && selectedDetails ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{selectedRegion}</h3>
                <button
                  onClick={() => setSelectedRegion(null)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              </div>
              <p className="text-sm text-muted-foreground">Regional breakdown</p>

              <div className="mt-6 space-y-4">
                <div className="rounded-lg bg-secondary/50 p-4">
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                  <p className="mt-1 text-2xl font-semibold text-primary">
                    ${(regionData.find((r) => r.name === selectedRegion)?.value || 0 / 1000).toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <p className="text-xs text-muted-foreground">Customers</p>
                    <p className="mt-1 text-lg font-semibold">
                      {selectedDetails.customers.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <p className="text-xs text-muted-foreground">Avg. Order</p>
                    <p className="mt-1 text-lg font-semibold">
                      ${selectedDetails.avgOrderValue}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground">Top Markets</p>
                  <div className="mt-2 space-y-2">
                    {selectedDetails.countries.map((country) => (
                      <div
                        key={country}
                        className="flex items-center justify-between rounded-lg bg-secondary/30 px-3 py-2"
                      >
                        <span className="text-sm">{country}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                  <p className="text-xs text-muted-foreground">Top Product</p>
                  <p className="mt-1 font-medium text-primary">
                    {selectedDetails.topProduct}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <Globe className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-semibold">Select a Region</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Click on a region card or map marker to view detailed analytics
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Revenue by Region Chart */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold">Revenue by Region</h3>
        <p className="text-sm text-muted-foreground">Comparative performance</p>
        <div className="mt-4 h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#666", fontSize: 12 }}
                tickFormatter={(v) => `$${v}K`}
              />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#666", fontSize: 12 }}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(18, 18, 24, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
                formatter={(v: number) => [`$${v}K`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="#6391FF" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
