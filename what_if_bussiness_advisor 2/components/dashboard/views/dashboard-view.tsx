"use client"

import { KPICards } from "@/components/dashboard/kpi-cards"
import { WorldMap } from "@/components/dashboard/world-map"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { ForecastChart } from "@/components/dashboard/forecast-chart"
import { AIAdvisor } from "@/components/dashboard/ai-advisor"

export function DashboardView() {
  return (
    <div className="p-6">
      {/* KPI Cards */}
      <section>
        <KPICards />
      </section>

      {/* Charts Grid */}
      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Main Charts Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* World Map */}
          <WorldMap />

          {/* Charts Row */}
          <div className="grid gap-6 md:grid-cols-2">
            <SalesChart />
            <ForecastChart />
          </div>
        </div>

        {/* AI Advisor Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 h-[calc(100vh-12rem)]">
            <AIAdvisor />
          </div>
        </div>
      </section>
    </div>
  )
}
