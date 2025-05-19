"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"
import { useTags } from "@/hooks/use-tags"
import { formatDistanceToNow } from "date-fns"

interface ChangelogEntry {
  _id: string
  content: string
  entry_type: string
  mood: string
  gitmojis: string[]
  sentiment_score: number
  tags: string[]
  created_at: string
  updated_at: string | null
}

interface ChangelogListProps {
  limit?: number
}

export function ChangelogList({ limit = 10 }: ChangelogListProps) {
  const [entries, setEntries] = useState<ChangelogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { token } = useAuth()
  const { tags } = useTags()

  useEffect(() => {
    const fetchEntries = async () => {
      if (!token) return

      try {
        setLoading(true)
        const response = await fetch(`http://localhost:8000/api/changelog/?limit=${limit}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch changelog entries")
        }

        const data = await response.json()
        setEntries(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchEntries()
  }, [token, limit])

  const getTagName = (tagId: string) => {
    const tag = tags.find((t) => t.id === tagId)
    return tag ? tag.name : "unknown"
  }

  const getSentimentColor = (score: number) => {
    if (score > 0.5) return "text-green-500"
    if (score > 0.1) return "text-green-400"
    if (score > -0.1) return "text-gray-500"
    if (score > -0.5) return "text-red-400"
    return "text-red-500"
  }

  const getEntryTypeColor = (type: string) => {
    switch (type) {
      case "HIGHLIGHT":
        return "bg-green-500"
      case "BUG":
        return "bg-red-500"
      case "REFLECTION":
        return "bg-blue-500"
      case "INSIGHT":
        return "bg-purple-500"
      case "CHALLENGE":
        return "bg-orange-500"
      case "PROGRESS":
        return "bg-cyan-500"
      case "QUESTION":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-4 w-1/2" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    )
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No changelog entries found. Create your first entry!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <Card key={entry._id} className="overflow-hidden">
          <div className={`h-1 ${getEntryTypeColor(entry.entry_type)}`} />
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {entry.gitmojis.map((emoji, i) => (
                    <span key={i}>{emoji}</span>
                  ))}
                  <span className={getSentimentColor(entry.sentiment_score)}>
                    {entry.content.length > 60 ? `${entry.content.substring(0, 60)}...` : entry.content}
                  </span>
                </CardTitle>
                <CardDescription>
                  {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                </CardDescription>
              </div>
              <Badge variant="outline">{entry.mood}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {entry.content.length > 60 && (
              <p className={`${getSentimentColor(entry.sentiment_score)} mb-4`}>{entry.content}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {entry.tags.map((tagId) => (
                <Badge key={tagId} variant="secondary">
                  {getTagName(tagId)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
