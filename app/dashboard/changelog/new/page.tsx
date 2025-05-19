"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { TagSelector } from "@/components/tag-selector"
import { useAuth } from "@/hooks/use-auth"

export default function NewChangelogPage() {
  const [content, setContent] = useState("")
  const [entryType, setEntryType] = useState("HIGHLIGHT")
  const [mood, setMood] = useState("HAPPY")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { token } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:8000/api/changelog/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          entry_type: entryType,
          mood,
          tags: selectedTags,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to create entry")
      }

      router.push("/dashboard/changelog")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Changelog Entry</CardTitle>
          <CardDescription>Record what's happening in your life, just like a GitHub commit</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="content">What's on your mind?</Label>
              <Textarea
                id="content"
                placeholder="I had a great day today..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-32"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entryType">Entry Type</Label>
                <Select value={entryType} onValueChange={setEntryType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select entry type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HIGHLIGHT">Highlight</SelectItem>
                    <SelectItem value="BUG">Bug</SelectItem>
                    <SelectItem value="REFLECTION">Reflection</SelectItem>
                    <SelectItem value="INSIGHT">Insight</SelectItem>
                    <SelectItem value="CHALLENGE">Challenge</SelectItem>
                    <SelectItem value="PROGRESS">Progress</SelectItem>
                    <SelectItem value="QUESTION">Question</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mood">Mood</Label>
                <Select value={mood} onValueChange={setMood}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HAPPY">Happy</SelectItem>
                    <SelectItem value="NEUTRAL">Neutral</SelectItem>
                    <SelectItem value="SAD">Sad</SelectItem>
                    <SelectItem value="EXCITED">Excited</SelectItem>
                    <SelectItem value="STRESSED">Stressed</SelectItem>
                    <SelectItem value="TIRED">Tired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <TagSelector selectedTags={selectedTags} onTagsChange={setSelectedTags} />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating entry..." : "Create Entry"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
