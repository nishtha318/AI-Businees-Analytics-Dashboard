"use client"

import { useEffect, useRef, useState } from "react"
import { useDashboardStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { TrendingUp } from "lucide-react"

export function WorldMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { regionData, selectedRegion, setSelectedRegion } = useDashboardStore()
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    let animationFrame: number
    let time = 0

    const draw = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      // Draw grid
      ctx.strokeStyle = "rgba(99, 145, 255, 0.06)"
      ctx.lineWidth = 1

      for (let y = 0; y < rect.height; y += 25) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(rect.width, y)
        ctx.stroke()
      }

      for (let x = 0; x < rect.width; x += 25) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, rect.height)
        ctx.stroke()
      }

      // Draw animated flow lines between regions
      const flowPairs = [
        [0, 1], [0, 2], [1, 2], [1, 4], [2, 3], [3, 4]
      ]

      flowPairs.forEach(([i, j]) => {
        const r1 = regionData[i]
        const r2 = regionData[j]
        const x1 = (r1.x / 100) * rect.width
        const y1 = (r1.y / 100) * rect.height
        const x2 = (r2.x / 100) * rect.width
        const y2 = (r2.y / 100) * rect.height

        // Draw curved connection
        const isActive = selectedRegion === r1.name || selectedRegion === r2.name || 
                        hoveredRegion === r1.name || hoveredRegion === r2.name
        
        ctx.strokeStyle = isActive ? "rgba(99, 145, 255, 0.4)" : "rgba(99, 145, 255, 0.15)"
        ctx.lineWidth = isActive ? 2 : 1
        ctx.beginPath()
        ctx.moveTo(x1, y1)

        const midX = (x1 + x2) / 2
        const midY = Math.min(y1, y2) - 30
        ctx.quadraticCurveTo(midX, midY, x2, y2)
        ctx.stroke()

        // Animated dot along path
        if (isActive) {
          const t = (Math.sin(time * 0.03 + i) + 1) / 2
          const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2
          const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * midY + t * t * y2
          
          ctx.fillStyle = "#6391FF"
          ctx.beginPath()
          ctx.arc(px, py, 3, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // Draw regions
      regionData.forEach((region) => {
        const x = (region.x / 100) * rect.width
        const y = (region.y / 100) * rect.height
        const isActive = selectedRegion === region.name || hoveredRegion === region.name

        // Pulse effect
        const pulseRadius = 20 + Math.sin(time * 0.05) * 8
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, pulseRadius)
        gradient.addColorStop(0, isActive ? "rgba(99, 145, 255, 0.4)" : "rgba(99, 145, 255, 0.2)")
        gradient.addColorStop(1, "rgba(99, 145, 255, 0)")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, pulseRadius, 0, Math.PI * 2)
        ctx.fill()

        // Main dot
        ctx.fillStyle = isActive ? "#6391FF" : "#4a7aff"
        ctx.shadowBlur = isActive ? 20 : 10
        ctx.shadowColor = "#6391FF"
        ctx.beginPath()
        ctx.arc(x, y, isActive ? 8 : 6, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      time++
      animationFrame = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrame)
    }
  }, [regionData, selectedRegion, hoveredRegion])

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value}`
  }

  const totalRevenue = regionData.reduce((sum, r) => sum + r.value, 0)

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="font-semibold">Global Revenue</h3>
          <p className="text-sm text-muted-foreground">
            {selectedRegion 
              ? `Viewing ${selectedRegion}` 
              : "Click a region to filter dashboard"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {selectedRegion && (
            <button
              onClick={() => setSelectedRegion(null)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear filter
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 animate-pulse rounded-full bg-primary shadow-[0_0_10px_var(--glow)]" />
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
        </div>
      </div>

      <div className="relative aspect-[2/1] w-full">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* Region Labels */}
        {regionData.map((region) => (
          <button
            key={region.name}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-full transition-all duration-200",
              (selectedRegion === region.name || hoveredRegion === region.name) && "scale-110 z-10"
            )}
            style={{ left: `${region.x}%`, top: `${region.y - 5}%` }}
            onClick={() => setSelectedRegion(selectedRegion === region.name ? null : region.name)}
            onMouseEnter={() => setHoveredRegion(region.name)}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <div className={cn(
              "rounded-lg border bg-card/95 px-3 py-2 text-center backdrop-blur-sm transition-all",
              selectedRegion === region.name 
                ? "border-primary shadow-[0_0_20px_var(--glow)]" 
                : "border-border/50 hover:border-primary/50"
            )}>
              <p className="text-xs font-medium">{region.name}</p>
              <p className="text-sm font-semibold text-primary">{formatValue(region.value)}</p>
              <div className="mt-1 flex items-center justify-center gap-1 text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                <span className="text-[10px] font-medium">+{region.growth}%</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Summary Bar */}
      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        <div className="text-sm">
          <span className="text-muted-foreground">Total Revenue: </span>
          <span className="font-semibold text-primary">{formatValue(totalRevenue)}</span>
        </div>
        <div className="flex gap-4">
          {regionData.slice(0, 3).map((region) => (
            <div key={region.name} className="flex items-center gap-2 text-xs">
              <div className={cn(
                "h-2 w-2 rounded-full",
                selectedRegion === region.name ? "bg-primary" : "bg-muted-foreground"
              )} />
              <span className="text-muted-foreground">{region.name.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
