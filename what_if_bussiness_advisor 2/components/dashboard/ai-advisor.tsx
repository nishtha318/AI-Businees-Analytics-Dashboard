"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Sparkles, Bot, User, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDashboardStore } from "@/lib/store"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

const suggestions = [
  "Why is revenue growing?",
  "What markets are underperforming?",
  "Predict next quarter revenue",
  "Identify at-risk segments",
]

export function AIAdvisor() {
  const { kpiData, regionData, selectedRegion, companyName } = useDashboardStore()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hello! I'm your AI business advisor for ${companyName}. I've analyzed your data and found some interesting insights.\n\nYour Q2 revenue is trending **${kpiData.revenueChange > 0 ? "+" : ""}${kpiData.revenueChange.toFixed(1)}%** above projections. Would you like me to break down the contributing factors?`,
      timestamp: Date.now() - 60000,
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()
    const topRegion = regionData.reduce((a, b) => (a.value > b.value ? a : b))
    const lowRegion = regionData.reduce((a, b) => (a.growth < b.growth ? a : b))
    
    if (lowerInput.includes("revenue") && (lowerInput.includes("grow") || lowerInput.includes("increase"))) {
      return `Based on my analysis, three factors are driving the **${kpiData.revenueChange.toFixed(1)}%** revenue increase:\n\n1. **${topRegion.name} Expansion**: ${topRegion.growth}% growth in this region\n2. **Active Users**: ${kpiData.usersChange > 0 ? "+" : ""}${kpiData.usersChange.toFixed(1)}% increase in user base\n3. **Engagement**: ${kpiData.engagement.toFixed(1)}% engagement rate, up ${kpiData.engagementChange.toFixed(1)}%\n\nShall I provide detailed breakdowns for any of these areas?`
    }
    
    if (lowerInput.includes("underperform") || lowerInput.includes("weak") || lowerInput.includes("low")) {
      return `Here are the areas that need attention:\n\n1. **${lowRegion.name}**: Only ${lowRegion.growth}% growth vs company average of ${(regionData.reduce((a, b) => a + b.growth, 0) / regionData.length).toFixed(1)}%\n2. **Conversions**: ${kpiData.conversionsChange < 0 ? "" : "+"}${kpiData.conversionsChange.toFixed(1)}% - ${kpiData.conversionsChange < 0 ? "declining" : "stable"}\n\nRecommend focusing on market-specific campaigns in ${lowRegion.name}. Would you like a strategic action plan?`
    }
    
    if (lowerInput.includes("predict") || lowerInput.includes("forecast") || lowerInput.includes("next quarter")) {
      const projectedRevenue = kpiData.revenue * (1 + (kpiData.revenueChange / 100))
      return `Based on current trends and seasonal patterns, I predict:\n\n**Q3 2026 Projection: $${(projectedRevenue / 1000000).toFixed(1)}M**\n\n• Confidence Level: 87%\n• Best Case: $${((projectedRevenue * 1.15) / 1000000).toFixed(1)}M\n• Conservative: $${((projectedRevenue * 0.92) / 1000000).toFixed(1)}M\n\nKey assumptions:\n- Continued ${topRegion.name} growth\n- Stable conversion rates\n- No major market disruptions\n\nWould you like me to run different scenarios?`
    }
    
    if (lowerInput.includes("risk") || lowerInput.includes("at-risk") || lowerInput.includes("churn")) {
      return `I've identified potential risk areas:\n\n**High Risk Segments:**\n1. **Small Business Tier**: Usage down 23% this quarter\n2. **Trial Conversions**: Only 12% converting vs 18% target\n3. **${lowRegion.name} Enterprise**: 3 accounts showing disengagement\n\n**Recommended Actions:**\n- Targeted re-engagement campaign for small business\n- Optimize trial onboarding flow\n- Executive outreach to at-risk enterprise accounts\n\nShall I prioritize these by potential revenue impact?`
    }
    
    if (selectedRegion) {
      const region = regionData.find((r) => r.name === selectedRegion)
      if (region) {
        return `**${selectedRegion} Analysis:**\n\nRevenue: **$${(region.value / 1000).toFixed(0)}K** (${region.growth}% growth)\n\nKey Insights:\n- Contributing ${((region.value / regionData.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}% of global revenue\n- Growth rate ${region.growth > 15 ? "above" : "below"} company average\n- ${region.growth > 20 ? "High potential for continued expansion" : "Consider targeted marketing investment"}\n\nWant me to generate a detailed regional strategy?`
      }
    }
    
    return `I've analyzed your request regarding "${userInput}".\n\nBased on current data:\n- **Revenue**: $${(kpiData.revenue / 1000000).toFixed(1)}M (${kpiData.revenueChange > 0 ? "+" : ""}${kpiData.revenueChange.toFixed(1)}%)\n- **Users**: ${(kpiData.users / 1000).toFixed(1)}K active\n- **Top Region**: ${topRegion.name} at $${(topRegion.value / 1000).toFixed(0)}K\n\nWould you like me to dive deeper into any specific area?`
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate streaming response
    setTimeout(() => {
      const response = generateResponse(input)
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1200 + Math.random() * 800)
  }

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion)
  }

  const clearChat = () => {
    setMessages([{
      id: crypto.randomUUID(),
      role: "assistant",
      content: `Chat cleared. How can I help you analyze ${companyName}'s performance today?`,
      timestamp: Date.now(),
    }])
  }

  // Render markdown-like formatting
  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      // Bold
      let formattedLine = line.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-foreground">$1</strong>')
      
      // Bullet points
      if (line.startsWith("- ")) {
        formattedLine = `<span class="text-primary mr-2">•</span>${formattedLine.slice(2)}`
        return (
          <p key={i} className="flex items-start pl-2" dangerouslySetInnerHTML={{ __html: formattedLine }} />
        )
      }
      
      // Numbered lists
      const numberedMatch = line.match(/^(\d+)\.\s/)
      if (numberedMatch) {
        formattedLine = `<span class="text-primary mr-2">${numberedMatch[1]}.</span>${formattedLine.slice(numberedMatch[0].length)}`
        return (
          <p key={i} className="flex items-start pl-2" dangerouslySetInnerHTML={{ __html: formattedLine }} />
        )
      }
      
      return <p key={i} dangerouslySetInnerHTML={{ __html: formattedLine }} />
    })
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">AI Business Advisor</h3>
            <p className="text-xs text-muted-foreground">Powered by advanced analytics</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          title="Clear chat"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-5">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex gap-3", message.role === "user" ? "flex-row-reverse" : "")}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  message.role === "user" ? "bg-primary/20" : "bg-secondary"
                )}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4 text-primary" />
                ) : (
                  <Bot className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[85%] space-y-1 rounded-xl px-4 py-3 text-sm leading-relaxed",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {renderContent(message.content)}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <Bot className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-1.5 rounded-xl bg-secondary px-4 py-3">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:0.2s]" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 border-t border-border px-5 py-3">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => handleSuggestion(suggestion)}
            className="rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-lg bg-secondary/50 px-4 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask about your business data..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:shadow-[0_0_20px_var(--glow)] disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
