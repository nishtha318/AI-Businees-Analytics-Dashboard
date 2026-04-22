"use client"

import { useState } from "react"
import { useDashboardStore } from "@/lib/store"
import {
  Settings,
  User,
  Building2,
  Bell,
  Shield,
  Palette,
  Save,
  Moon,
  Sun,
  Volume2,
  Mail,
  Database,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

type SettingsTab = "profile" | "company" | "notifications" | "security" | "appearance"

export function SettingsView() {
  const {
    companyName,
    setCompanyName,
    userName,
    userRole,
    userAvatar,
    setUserProfile,
    darkMode,
    setDarkMode,
    soundEnabled,
    setSoundEnabled,
    emailNotifications,
    setEmailNotifications,
    twoFactorAuth,
    setTwoFactorAuth,
    dataSync,
    setDataSync,
  } = useDashboardStore()

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile")
  const [editedCompanyName, setEditedCompanyName] = useState(companyName)
  const [editedUserName, setEditedUserName] = useState(userName)
  const [editedUserRole, setEditedUserRole] = useState(userRole)
  const [editedUserAvatar, setEditedUserAvatar] = useState(userAvatar)
  const [saved, setSaved] = useState(false)

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "company" as const, label: "Company", icon: Building2 },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "security" as const, label: "Security", icon: Shield },
    { id: "appearance" as const, label: "Appearance", icon: Palette },
  ]

  const handleSaveProfile = () => {
    setUserProfile(editedUserName, editedUserRole, editedUserAvatar)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSaveCompany = () => {
    setCompanyName(editedCompanyName)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Settings</h2>
            <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="rounded-xl border border-border bg-card p-6 lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold">Profile Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Update your personal information
                  </p>
                </div>

                <Separator />

                <div className="flex items-center gap-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-2xl font-semibold text-primary">
                    {editedUserAvatar}
                  </div>
                  <div>
                    <p className="font-medium">{editedUserName}</p>
                    <p className="text-sm text-muted-foreground">{editedUserRole}</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="userName">Name</Label>
                    <Input
                      id="userName"
                      value={editedUserName}
                      onChange={(e) => setEditedUserName(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userRole">Role</Label>
                    <Input
                      id="userRole"
                      value={editedUserRole}
                      onChange={(e) => setEditedUserRole(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userAvatar">Avatar Initials</Label>
                    <Input
                      id="userAvatar"
                      value={editedUserAvatar}
                      onChange={(e) => setEditedUserAvatar(e.target.value.toUpperCase().slice(0, 2))}
                      className="mt-2"
                      maxLength={2}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveProfile} className="gap-2">
                  <Save className="h-4 w-4" />
                  {saved ? "Saved!" : "Save Changes"}
                </Button>
              </div>
            )}

            {/* Company Tab */}
            {activeTab === "company" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold">Company Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your organization details
                  </p>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={editedCompanyName}
                    onChange={(e) => setEditedCompanyName(e.target.value)}
                    className="mt-2 max-w-md"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    This name will be displayed across the dashboard
                  </p>
                </div>

                <Button onClick={handleSaveCompany} className="gap-2">
                  <Save className="h-4 w-4" />
                  {saved ? "Saved!" : "Save Changes"}
                </Button>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold">Notification Preferences</h3>
                  <p className="text-sm text-muted-foreground">
                    Control how you receive notifications
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-secondary/30 p-4">
                    <div className="flex items-center gap-3">
                      <Volume2 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Sound Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Play sound for new alerts
                        </p>
                      </div>
                    </div>
                    <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-secondary/30 p-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive important updates via email
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-secondary/30 p-4">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Auto Sync</p>
                        <p className="text-sm text-muted-foreground">
                          Automatically sync data in background
                        </p>
                      </div>
                    </div>
                    <Switch checked={dataSync} onCheckedChange={setDataSync} />
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold">Security Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your security preferences
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-secondary/30 p-4">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security
                        </p>
                      </div>
                    </div>
                    <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <h4 className="font-medium">Password</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Last changed 30 days ago
                    </p>
                    <Button variant="outline" size="sm" className="mt-3">
                      Change Password
                    </Button>
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <h4 className="font-medium">Active Sessions</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      You are logged in on 2 devices
                    </p>
                    <Button variant="outline" size="sm" className="mt-3">
                      Manage Sessions
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === "appearance" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold">Appearance</h3>
                  <p className="text-sm text-muted-foreground">
                    Customize the look and feel
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-secondary/30 p-4">
                    <div className="flex items-center gap-3">
                      {darkMode ? (
                        <Moon className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Sun className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-muted-foreground">
                          {darkMode ? "Dark theme is active" : "Light theme is active"}
                        </p>
                      </div>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <h4 className="font-medium">Theme Preview</h4>
                    <div className="mt-3 grid grid-cols-5 gap-2">
                      {["primary", "secondary", "muted", "accent", "card"].map((color) => (
                        <div
                          key={color}
                          className={cn(
                            "aspect-square rounded-lg",
                            color === "primary" && "bg-primary",
                            color === "secondary" && "bg-secondary",
                            color === "muted" && "bg-muted",
                            color === "accent" && "bg-accent",
                            color === "card" && "bg-card border border-border"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
