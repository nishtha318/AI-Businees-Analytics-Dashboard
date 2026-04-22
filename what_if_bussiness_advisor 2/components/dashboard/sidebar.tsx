"use client"

import { cn } from "@/lib/utils"
import { useDashboardStore, type Page } from "@/lib/store"
import {
  LayoutDashboard,
  BarChart3,
  Globe,
  TrendingUp,
  MessageSquareText,
  Settings,
  Bell,
  Users,
  ChevronLeft,
  ChevronRight,
  Search,
  LogOut,
  Edit3,
} from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const navItems: { icon: typeof LayoutDashboard; label: string; id: Page }[] = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: Globe, label: "Markets", id: "markets" },
  { icon: TrendingUp, label: "Forecasts", id: "forecasts" },
]

const bottomNavItems: { icon: typeof Bell; label: string; id: Page }[] = [
  { icon: Bell, label: "Notifications", id: "notifications" },
  { icon: Users, label: "Team", id: "team" },
  { icon: Settings, label: "Settings", id: "settings" },
]

export function DashboardSidebar() {
  const {
    currentPage,
    setCurrentPage,
    sidebarCollapsed,
    toggleSidebar,
    companyName,
    setCompanyName,
    userName,
    userRole,
    userAvatar,
    setUserProfile,
    notifications,
  } = useDashboardStore()

  const [companyModalOpen, setCompanyModalOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [editCompanyName, setEditCompanyName] = useState(companyName)
  const [editUserName, setEditUserName] = useState(userName)
  const [editUserRole, setEditUserRole] = useState(userRole)
  const [editUserAvatar, setEditUserAvatar] = useState(userAvatar)

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleSaveCompany = () => {
    setCompanyName(editCompanyName)
    setCompanyModalOpen(false)
  }

  const handleSaveProfile = () => {
    setUserProfile(editUserName, editUserRole, editUserAvatar)
    setProfileModalOpen(false)
  }

  return (
    <>
      <aside
        className={cn(
          "flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-[0_0_20px_var(--glow)]">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            {!sidebarCollapsed && (
              <button
                onClick={() => {
                  setEditCompanyName(companyName)
                  setCompanyModalOpen(true)
                }}
                className="group flex items-center gap-1.5 text-lg font-semibold tracking-tight transition-colors hover:text-primary"
              >
                {companyName}
                <Edit3 className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleSidebar}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Search Bar */}
        {!sidebarCollapsed && (
          <div className="border-b border-border p-3">
            <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Search...</span>
              <kbd className="ml-auto hidden rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground md:inline-block">
                Ctrl+K
              </kbd>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 overflow-auto p-3">
          {!sidebarCollapsed && (
            <p className="mb-2 px-1 text-xs font-medium text-muted-foreground">
              Navigation
            </p>
          )}
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    currentPage === item.id
                      ? "bg-sidebar-accent text-primary shadow-[0_0_10px_var(--glow)]"
                      : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                  )}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-border p-3">
          <ul className="space-y-1">
            {bottomNavItems.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    currentPage === item.id
                      ? "bg-sidebar-accent text-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                  )}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <div className="relative">
                    <item.icon className="h-5 w-5 shrink-0" />
                    {item.id === "notifications" && unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -right-2 -top-2 h-4 min-w-4 justify-center px-1 text-[10px]"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* User Profile */}
        <div className="border-t border-border p-3">
          <button
            onClick={() => {
              setEditUserName(userName)
              setEditUserRole(userRole)
              setEditUserAvatar(userAvatar)
              setProfileModalOpen(true)
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg p-2 transition-all hover:bg-sidebar-accent/50",
              sidebarCollapsed && "justify-center"
            )}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
              {userAvatar}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 text-left">
                <p className="truncate text-sm font-medium">{userName}</p>
                <p className="truncate text-xs text-muted-foreground">{userRole}</p>
              </div>
            )}
          </button>
          {!sidebarCollapsed && (
            <Button
              variant="ghost"
              className="mt-2 w-full justify-start gap-2 text-muted-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          )}
        </div>
      </aside>

      {/* Company Name Modal */}
      <Dialog open={companyModalOpen} onOpenChange={setCompanyModalOpen}>
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle>Edit Company Name</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              value={editCompanyName}
              onChange={(e) => setEditCompanyName(e.target.value)}
              className="mt-2"
              placeholder="Enter company name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompanyModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCompany}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Modal */}
      <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="user-name">Name</Label>
              <Input
                id="user-name"
                value={editUserName}
                onChange={(e) => setEditUserName(e.target.value)}
                className="mt-2"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <Label htmlFor="user-role">Role</Label>
              <Input
                id="user-role"
                value={editUserRole}
                onChange={(e) => setEditUserRole(e.target.value)}
                className="mt-2"
                placeholder="Enter your role"
              />
            </div>
            <div>
              <Label htmlFor="user-avatar">Avatar Initials</Label>
              <Input
                id="user-avatar"
                value={editUserAvatar}
                onChange={(e) => setEditUserAvatar(e.target.value.toUpperCase().slice(0, 2))}
                className="mt-2"
                placeholder="e.g. JD"
                maxLength={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProfileModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
