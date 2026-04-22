"use client"

import { useRouter } from "next/navigation"
import { useDashboardStore, type Page } from "@/lib/store"
import { Bell, Calendar, ChevronDown, LogOut } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

const pageTitles: Record<Page, { title: string; description: string }> = {
  dashboard: { title: "Dashboard", description: "Overview of your business metrics" },
  analytics: { title: "Analytics", description: "Deep dive into your data" },
  markets: { title: "Markets", description: "Regional performance analysis" },
  forecasts: { title: "Forecasts", description: "Revenue predictions and simulations" },
  notifications: { title: "Notifications", description: "Alerts and updates" },
  team: { title: "Team", description: "Manage your team members" },
  settings: { title: "Settings", description: "Configure your preferences" },
}

export function DashboardHeader() {
  const router = useRouter()
  const { currentPage, notifications, setCurrentPage, logout } = useDashboardStore()
  const unreadCount = notifications.filter((n) => !n.read).length
  const pageInfo = pageTitles[currentPage]

  const handleLogout = () => {
    logout()
    router.push("/login")
  }
  
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-sm">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{pageInfo.title}</h1>
        <p className="text-sm text-muted-foreground">{pageInfo.description}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-lg bg-secondary/50 px-3 py-1.5 text-sm text-muted-foreground md:flex">
          <Calendar className="h-4 w-4" />
          {today}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              Menu
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setCurrentPage("analytics")}>
              View Analytics
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCurrentPage("forecasts")}>
              Run Forecast
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCurrentPage("team")}>
              Manage Team
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCurrentPage("settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          onClick={() => setCurrentPage("notifications")}
          className="relative rounded-lg bg-secondary/50 p-2 transition-colors hover:bg-secondary"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 min-w-5 justify-center px-1.5 text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
        </button>
      </div>
    </header>
  )
}
