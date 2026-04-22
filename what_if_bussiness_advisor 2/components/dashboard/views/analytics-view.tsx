"use client"

import { useDashboardStore } from "@/lib/store"
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts"
import { cn } from "@/lib/utils"

const monthlyData = [
  { month: "Jan", revenue: 42000, users: 1200, conversions: 280 },
  { month: "Feb", revenue: 48000, users: 1400, conversions: 320 },
  { month: "Mar", revenue: 52000, users: 1650, conversions: 380 },
  { month: "Apr", revenue: 58000, users: 1800, conversions: 420 },
  { month: "May", revenue: 64000, users: 2100, conversions: 480 },
  { month: "Jun", revenue: 72000, users: 2400, conversions: 520 },
]

const channelData = [
  { name: "Organic", value: 35, color: "#6391FF" },
  { name: "Paid Ads", value: 28, color: "#4CD6A5" },
  { name: "Referral", value: 22, color: "#FFB86C" },
  { name: "Direct", value: 15, color: "#FF6B9D" },
]

const topProducts = [
  { name: "Analytics Pro", revenue: 84200, growth: 23 },
  { name: "Enterprise Suite", revenue: 62400, growth: 18 },
  { name: "API Access", revenue: 41200, growth: 31 },
  { name: "Data Pipeline", revenue: 28600, growth: 12 },
  { name: "Insights Dashboard", revenue: 19800, growth: 8 },
]

export function AnalyticsView() {
  const { kpiData, regionData } = useDashboardStore()

  const metrics = [
    {
      title: "Revenue Growth",
      value: `${kpiData.revenueChange > 0 ? "+" : ""}${kpiData.revenueChange.toFixed(1)}%`,
      trend: kpiData.revenueChange >= 0 ? "up" : "down",
      icon: DollarSign,
      description: "Month over month",
    },
    {
      title: "User Acquisition",
      value: `${kpiData.usersChange > 0 ? "+" : ""}${kpiData.usersChange.toFixed(1)}%`,
      trend: kpiData.usersChange >= 0 ? "up" : "down",
      icon: Users,
      description: "New users this month",
    },
    {
      title: "Conversion Rate",
      value: `${kpiData.conversionsChange > 0 ? "+" : ""}${kpiData.conversionsChange.toFixed(1)}%`,
      trend: kpiData.conversionsChange >= 0 ? "up" : "down",
      icon: ShoppingCart,
      description: "vs last month",
    },
    {
      title: "Engagement Score",
      value: `${kpiData.engagement.toFixed(1)}%`,
      trend: kpiData.engagementChange >= 0 ? "up" : "down",
      icon: Activity,
      description: "Active user rate",
    },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="group overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-[0_0_30px_var(--glow)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <metric.icon className="h-5 w-5 text-primary" />
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                  metric.trend === "up"
                    ? "bg-emerald-400/10 text-emerald-400"
                    : "bg-red-400/10 text-red-400"
                )}
              >
                {metric.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {metric.trend === "up" ? "Up" : "Down"}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-semibold">{metric.value}</p>
              <p className="text-sm text-muted-foreground">{metric.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{metric.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold">Revenue Trend</h3>
          <p className="text-sm text-muted-foreground">Monthly revenue over time</p>
          <div className="mt-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6391FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6391FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#666", fontSize: 12 }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 12 }}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(18, 18, 24, 0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6391FF" strokeWidth={2} fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold">User Growth</h3>
          <p className="text-sm text-muted-foreground">New users and conversions</p>
          <div className="mt-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#666", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#666", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(18, 18, 24, 0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="users" fill="#6391FF" radius={[4, 4, 0, 0]} name="Users" />
                <Bar dataKey="conversions" fill="#4CD6A5" radius={[4, 4, 0, 0]} name="Conversions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Traffic Sources */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold">Traffic Sources</h3>
          <p className="text-sm text-muted-foreground">Where users come from</p>
          <div className="mt-4 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(18, 18, 24, 0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                  formatter={(v: number) => [`${v}%`, "Share"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {channelData.map((channel) => (
              <div key={channel.name} className="flex items-center gap-2 text-sm">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: channel.color }} />
                <span className="text-muted-foreground">{channel.name}</span>
                <span className="ml-auto font-medium">{channel.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <h3 className="font-semibold">Top Products</h3>
          <p className="text-sm text-muted-foreground">Revenue by product</p>
          <div className="mt-4 space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-medium text-primary">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ${(product.revenue / 1000).toFixed(1)}K
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(product.revenue / topProducts[0].revenue) * 100}%` }}
                      />
                    </div>
                    <span className="flex items-center gap-0.5 text-xs text-emerald-400">
                      <TrendingUp className="h-3 w-3" />
                      {product.growth}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
