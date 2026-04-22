"use client"

import { useEffect, useState } from "react"

export function useAnimatedCounter(
  targetValue: number,
  duration: number = 1000,
  startOnMount: boolean = true
) {
  const [value, setValue] = useState(startOnMount ? 0 : targetValue)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!startOnMount && !isAnimating) return

    setIsAnimating(true)
    const startTime = Date.now()
    const startValue = value

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (targetValue - startValue) * eased

      setValue(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }

    requestAnimationFrame(animate)
  }, [targetValue, duration, startOnMount])

  return { value, isAnimating }
}

export function formatNumber(value: number, type: "currency" | "number" | "percent" = "number") {
  if (type === "currency") {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    }
    return `$${value.toFixed(0)}`
  }
  
  if (type === "percent") {
    return `${value.toFixed(1)}%`
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  
  return value.toFixed(0)
}
