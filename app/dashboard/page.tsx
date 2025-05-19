import type { Metadata } from "next"
import { ChangelogList } from "@/components/changelog-list"
import { WeeklyStats } from "@/components/weekly-stats"
import { MoodDistribution } from "@/components/mood-distribution"
import { RecentTags } from "@/components/recent-tags"

export const metadata: Metadata = {
  title: "GitHappy - Dashboard",
  description: "Track your life like a GitHub project",
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <WeeklyStats />
        <MoodDistribution />
        <RecentTags />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Recent Changelog Entries</h3>
        <ChangelogList limit={5} />
      </div>
    </div>
  )
}
