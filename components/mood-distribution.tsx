"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"

interface MoodCount {
  mood: string
  count: number
}

export function MoodDistribution() {
  const [moodCounts, setMoodCounts] = useState<MoodCount[]>([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    const fetchMoodStats = async () => {
      if (!token) return

      try {
        setLoading(true)
        const response = await fetch(`http://localhost:8000/api/changelog/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch entries")
        }

        const data = await response.json()

        // Count moods
        const moodMap = new Map<string, number>()
        data.forEach((entry) => {
          const mood = entry.mood || "UNKNOWN"
          moodMap.set(mood, (moodMap.get(mood) || 0) + 1)
        })

        // Convert to array
        const moodArray = Array.from(moodMap.entries()).map(([mood, count]) => ({
          mood,
          count,
        }))

        setMoodCounts(moodArray)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMoodStats()
  }, [token])

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "HAPPY":
        return "😊"
      case "SAD":
        return "😢"
      case "NEUTRAL":
        return "😐"
      case "EXCITED":
        return "🎉"
      case "STRESSED":
        return "😰"
      case "TIRED":
        return "😴"
      default:
        return "❓"
    }
  }

  const topMood =
    moodCounts.length > 0 ? moodCounts.reduce((prev, current) => (prev.count > current.count ? prev : current)) : null

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Most Common Mood</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? "..." : topMood ? `${getMoodEmoji(topMood.mood)} ${topMood.mood}` : "No data"}
        </div>
        <p className="text-xs text-muted-foreground">
          {topMood ? `${topMood.count} entries with this mood` : "Log more entries to see stats"}
        </p>
      </CardContent>
    </Card>
  )
}
