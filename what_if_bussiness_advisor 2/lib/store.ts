"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export type Page = "dashboard" | "analytics" | "markets" | "forecasts" | "notifications" | "team" | "settings"

export interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  status: "online" | "away" | "offline"
  email: string
}

export interface Notification {
  id: string
  type: "success" | "warning" | "info" | "error"
  title: string
  message: string
  time: string
  timestamp: number
  read: boolean
}

export interface KPIData {
  revenue: number
  revenueChange: number
  users: number
  usersChange: number
  conversions: number
  conversionsChange: number
  engagement: number
  engagementChange: number
}

export interface RegionData {
  name: string
  value: number
  x: number
  y: number
  growth: number
}

export interface SalesDataPoint {
  time: string
  sales: number
  orders: number
}

export interface ForecastParams {
  marketingBudget: number
  customerGrowth: number
  conversionRate: number
  pricing: number
}

interface DashboardStore {
  // Auth
  isAuthenticated: boolean
  userPhone: string | null
  setAuthenticated: (authenticated: boolean, phone?: string) => void
  logout: () => void

  // Navigation
  currentPage: Page
  sidebarCollapsed: boolean
  setCurrentPage: (page: Page) => void
  toggleSidebar: () => void

  // Company & Profile
  companyName: string
  userName: string
  userRole: string
  userAvatar: string
  setCompanyName: (name: string) => void
  setUserProfile: (name: string, role: string, avatar: string) => void

  // Settings
  darkMode: boolean
  soundEnabled: boolean
  emailNotifications: boolean
  twoFactorAuth: boolean
  dataSync: boolean
  setDarkMode: (value: boolean) => void
  setSoundEnabled: (value: boolean) => void
  setEmailNotifications: (value: boolean) => void
  setTwoFactorAuth: (value: boolean) => void
  setDataSync: (value: boolean) => void

  // Team
  teamMembers: TeamMember[]
  addTeamMember: (member: Omit<TeamMember, "id">) => void
  removeTeamMember: (id: string) => void
  updateTeamMember: (id: string, data: Partial<TeamMember>) => void

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void

  // KPI Data
  kpiData: KPIData
  updateKPIData: (data: Partial<KPIData>) => void

  // Region Data
  regionData: RegionData[]
  selectedRegion: string | null
  setSelectedRegion: (region: string | null) => void
  updateRegionData: (name: string, data: Partial<RegionData>) => void

  // Sales Data
  salesData: SalesDataPoint[]
  addSalesDataPoint: (point: SalesDataPoint) => void

  // Forecast Parameters
  forecastParams: ForecastParams
  setForecastParams: (params: Partial<ForecastParams>) => void
}

const initialTeamMembers: TeamMember[] = [
  { id: "1", name: "Sarah Chen", role: "CTO", status: "online", avatar: "SC", email: "sarah@company.com" },
  { id: "2", name: "Mike Ross", role: "CFO", status: "online", avatar: "MR", email: "mike@company.com" },
  { id: "3", name: "Emily Davis", role: "VP Sales", status: "away", avatar: "ED", email: "emily@company.com" },
  { id: "4", name: "James Wilson", role: "Head of Ops", status: "offline", avatar: "JW", email: "james@company.com" },
  { id: "5", name: "Lisa Park", role: "Data Lead", status: "online", avatar: "LP", email: "lisa@company.com" },
]

const initialNotifications: Notification[] = [
  { id: "1", type: "success", title: "Revenue Target Hit", message: "Q1 target of $2.4M achieved", time: "2 min ago", timestamp: Date.now() - 120000, read: false },
  { id: "2", type: "warning", title: "Unusual Activity", message: "Spike in API requests from APAC region", time: "15 min ago", timestamp: Date.now() - 900000, read: false },
  { id: "3", type: "info", title: "Report Ready", message: "Monthly analytics report is ready to download", time: "1 hour ago", timestamp: Date.now() - 3600000, read: true },
  { id: "4", type: "success", title: "New Enterprise Client", message: "Acme Corp signed a $450K deal", time: "3 hours ago", timestamp: Date.now() - 10800000, read: true },
]

const initialKPIData: KPIData = {
  revenue: 2400000,
  revenueChange: 12.5,
  users: 48200,
  usersChange: 8.1,
  conversions: 3842,
  conversionsChange: -2.4,
  engagement: 64.7,
  engagementChange: 5.2,
}

const initialRegionData: RegionData[] = [
  { name: "North America", value: 842000, x: 22, y: 35, growth: 15 },
  { name: "Europe", value: 624000, x: 52, y: 28, growth: 12 },
  { name: "Asia Pacific", value: 512000, x: 75, y: 40, growth: 28 },
  { name: "South America", value: 186000, x: 30, y: 68, growth: 8 },
  { name: "Africa", value: 94000, x: 52, y: 55, growth: 18 },
]

const initialSalesData: SalesDataPoint[] = [
  { time: "00:00", sales: 2400, orders: 180 },
  { time: "02:00", sales: 1398, orders: 120 },
  { time: "04:00", sales: 1800, orders: 140 },
  { time: "06:00", sales: 2200, orders: 160 },
  { time: "08:00", sales: 3908, orders: 280 },
  { time: "10:00", sales: 4800, orders: 350 },
  { time: "12:00", sales: 5200, orders: 420 },
  { time: "14:00", sales: 4300, orders: 380 },
  { time: "16:00", sales: 4100, orders: 340 },
  { time: "18:00", sales: 5100, orders: 390 },
  { time: "20:00", sales: 4500, orders: 320 },
  { time: "22:00", sales: 3200, orders: 260 },
]

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      // Auth
      isAuthenticated: false,
      userPhone: null,
      setAuthenticated: (authenticated, phone) =>
        set({ isAuthenticated: authenticated, userPhone: phone || null }),
      logout: () => set({ isAuthenticated: false, userPhone: null }),

      // Navigation
      currentPage: "dashboard",
      sidebarCollapsed: false,
      setCurrentPage: (page) => set({ currentPage: page }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      // Company & Profile
      companyName: "Nexus",
      userName: "John Doe",
      userRole: "CEO",
      userAvatar: "JD",
      setCompanyName: (name) => set({ companyName: name }),
      setUserProfile: (name, role, avatar) => set({ userName: name, userRole: role, userAvatar: avatar }),

      // Settings
      darkMode: true,
      soundEnabled: true,
      emailNotifications: true,
      twoFactorAuth: false,
      dataSync: true,
      setDarkMode: (value) => set({ darkMode: value }),
      setSoundEnabled: (value) => set({ soundEnabled: value }),
      setEmailNotifications: (value) => set({ emailNotifications: value }),
      setTwoFactorAuth: (value) => set({ twoFactorAuth: value }),
      setDataSync: (value) => set({ dataSync: value }),

      // Team
      teamMembers: initialTeamMembers,
      addTeamMember: (member) =>
        set((state) => ({
          teamMembers: [...state.teamMembers, { ...member, id: crypto.randomUUID() }],
        })),
      removeTeamMember: (id) =>
        set((state) => ({
          teamMembers: state.teamMembers.filter((m) => m.id !== id),
        })),
      updateTeamMember: (id, data) =>
        set((state) => ({
          teamMembers: state.teamMembers.map((m) => (m.id === id ? { ...m, ...data } : m)),
        })),

      // Notifications
      notifications: initialNotifications,
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            { ...notification, id: crypto.randomUUID(), timestamp: Date.now() },
            ...state.notifications,
          ],
        })),
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      deleteNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      // KPI Data
      kpiData: initialKPIData,
      updateKPIData: (data) =>
        set((state) => ({
          kpiData: { ...state.kpiData, ...data },
        })),

      // Region Data
      regionData: initialRegionData,
      selectedRegion: null,
      setSelectedRegion: (region) => set({ selectedRegion: region }),
      updateRegionData: (name, data) =>
        set((state) => ({
          regionData: state.regionData.map((r) => (r.name === name ? { ...r, ...data } : r)),
        })),

      // Sales Data
      salesData: initialSalesData,
      addSalesDataPoint: (point) =>
        set((state) => ({
          salesData: [...state.salesData.slice(-11), point],
        })),

      // Forecast Parameters
      forecastParams: {
        marketingBudget: 50,
        customerGrowth: 50,
        conversionRate: 50,
        pricing: 50,
      },
      setForecastParams: (params) =>
        set((state) => ({
          forecastParams: { ...state.forecastParams, ...params },
        })),
    }),
    {
      name: "dashboard-storage",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          }
        }
        return localStorage
      }),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userPhone: state.userPhone,
        companyName: state.companyName,
        userName: state.userName,
        userRole: state.userRole,
        userAvatar: state.userAvatar,
        darkMode: state.darkMode,
        soundEnabled: state.soundEnabled,
        emailNotifications: state.emailNotifications,
        twoFactorAuth: state.twoFactorAuth,
        dataSync: state.dataSync,
        teamMembers: state.teamMembers,
        notifications: state.notifications,
        forecastParams: state.forecastParams,
      }),
    }
  )
)
