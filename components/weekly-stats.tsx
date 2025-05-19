"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"

export function WeeklyStats() {
  const [weeklyCount, setWeeklyCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    const fetchWeeklyStats = async () => {
      if (!token) return

      try {
        setLoading(true)
        const currentWeek = new Date().getWeek()
        const response = await fetch(`http://localhost:8000/api/changelog/week/${currentWeek}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch weekly stats")
        }

        const data = await response.json()
        setWeeklyCount(data.length)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchWeeklyStats()
  }, [token])

  // Helper function to get week number
  Date.prototype.getWeek = function () {
    const date = new Date(this.getTime())
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7))
    const week1 = new Date(date.getFullYear(), 0, 4)
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">This Week&apos;s Entries</CardTitle>
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
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{loading ? "..." : weeklyCount}</div>
        <p className="text-xs text-muted-foreground">
          {weeklyCount === 0
            ? "No entries this week"
            : weeklyCount === 1
              ? "1 entry this week"
              : `${weeklyCount} entries this week`}
        </p>
      </CardContent>
    </Card>
  )
}
