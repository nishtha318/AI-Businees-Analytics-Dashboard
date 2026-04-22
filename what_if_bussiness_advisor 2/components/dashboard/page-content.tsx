"use client"

import { useDashboardStore } from "@/lib/store"
import { DashboardView } from "./views/dashboard-view"
import { AnalyticsView } from "./views/analytics-view"
import { MarketsView } from "./views/markets-view"
import { ForecastsView } from "./views/forecasts-view"
import { NotificationsView } from "./views/notifications-view"
import { TeamView } from "./views/team-view"
import { SettingsView } from "./views/settings-view"

export function PageContent() {
  const { currentPage } = useDashboardStore()

  return (
    <div className="animate-in fade-in duration-300">
      {currentPage === "dashboard" && <DashboardView />}
      {currentPage === "analytics" && <AnalyticsView />}
      {currentPage === "markets" && <MarketsView />}
      {currentPage === "forecasts" && <ForecastsView />}
      {currentPage === "notifications" && <NotificationsView />}
      {currentPage === "team" && <TeamView />}
      {currentPage === "settings" && <SettingsView />}
    </div>
  )
}
