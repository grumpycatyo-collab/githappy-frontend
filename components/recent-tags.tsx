"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTags } from "@/hooks/use-tags"

export function RecentTags() {
  const { tags, loading } = useTags()

  const recentTags = tags.slice(0, 5)

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Recent Tags</CardTitle>
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
          <path d="M10.296 6.16l.3-.24A4.5 4.5 0 0 1 13.9 5h2.1A4.5 4.5 0 0 1 20.5 9.5v2.1a4.5 4.5 0 0 1-.92 2.74l-.3.24a4.5 4.5 0 0 0-.92 2.74v2.1a4.5 4.5 0 0 1-4.5 4.5h-2.1a4.5 4.5 0 0 1-2.74-.92l-.24-.3a4.5 4.5 0 0 0-2.74-.92h-2.1a4.5 4.5 0 0 1-4.5-4.5v-2.1a4.5 4.5 0 0 1 .92-2.74l.3-.24a4.5 4.5 0 0 0 .92-2.74v-2.1a4.5 4.5 0 0 1 4.5-4.5h2.1a4.5 4.5 0 0 1 2.74.92l.24.3Z" />
        </svg>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-sm">Loading tags...</div>
        ) : recentTags.length === 0 ? (
          <div className="text-sm text-muted-foreground">No tags created yet</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {recentTags.map((tag) => (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
