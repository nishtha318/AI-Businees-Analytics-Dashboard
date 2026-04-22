"use client"

import { useDashboardStore } from "@/lib/store"
import { Check, Trash2, Bell, AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function NotificationsView() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, addNotification } = useDashboardStore()

  const unreadCount = notifications.filter((n) => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-emerald-400" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-400" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-400" />
      default:
        return <Info className="h-5 w-5 text-primary" />
    }
  }

  const getBorderColor = (type: string, read: boolean) => {
    if (read) return "border-border"
    switch (type) {
      case "success":
        return "border-emerald-400/30"
      case "warning":
        return "border-amber-400/30"
      case "error":
        return "border-red-400/30"
      default:
        return "border-primary/30"
    }
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes} min ago`
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    return `${days} day${days > 1 ? "s" : ""} ago`
  }

  const simulateNotification = () => {
    const types = ["success", "warning", "info"] as const
    const titles = [
      { type: "success", title: "New Sale", message: "Enterprise deal closed for $125K" },
      { type: "warning", title: "Usage Alert", message: "API usage at 85% of monthly limit" },
      { type: "info", title: "Report Generated", message: "Weekly performance report is ready" },
      { type: "success", title: "Milestone Reached", message: "1000 new users this month" },
    ]
    const notification = titles[Math.floor(Math.random() * titles.length)]
    
    addNotification({
      type: notification.type,
      title: notification.title,
      message: notification.message,
      time: "Just now",
      read: false,
    })
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Notifications</h2>
              <p className="text-sm text-muted-foreground">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                  : "All caught up!"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={simulateNotification}>
              Simulate Alert
            </Button>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="mt-6 space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-semibold">No notifications</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You're all caught up. Check back later for updates.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "group relative overflow-hidden rounded-xl border bg-card p-4 transition-all hover:shadow-lg",
                  getBorderColor(notification.type, notification.read),
                  !notification.read && "bg-card/80"
                )}
              >
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{notification.title}</h3>
                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatTime(notification.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
