"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useDashboardStore } from "@/lib/store"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated } = useDashboardStore()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return

    // Allow login page to be accessible
    if (pathname === "/login") {
      return
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [hydrated, isAuthenticated, pathname, router])

  if (!hydrated) {
    return <div className="h-screen w-screen bg-background" />
  }

  return children
}
