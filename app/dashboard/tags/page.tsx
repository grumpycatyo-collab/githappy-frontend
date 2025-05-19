"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Plus, Tag, Trash2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useTags } from "@/hooks/use-tags"

export default function TagsPage() {
  const [newTagName, setNewTagName] = useState("")
  const [error, setError] = useState("")
  const { token } = useAuth()
  const { tags, loading, error: tagsError, createTag, deleteTag, refreshTags } = useTags()

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!newTagName.trim()) {
      setError("Tag name cannot be empty")
      return
    }

    try {
      await createTag(newTagName)
      setNewTagName("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create tag")
    }
  }

  const handleDeleteTag = async (tagId: string) => {
    try {
      await deleteTag(tagId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete tag")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tags</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Tag</CardTitle>
          <CardDescription>Tags help you categorize your changelog entries</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleCreateTag} className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="tagName">Tag Name</Label>
              <Input
                id="tagName"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="e.g., work, family, health"
              />
            </div>
            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" />
              Add Tag
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Tags</CardTitle>
          <CardDescription>Manage your existing tags</CardDescription>
        </CardHeader>
        <CardContent>
          {tagsError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{tagsError}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-4">Loading tags...</div>
          ) : tags.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              You don&apos;t have any tags yet. Create one above.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center gap-2 bg-muted p-2 rounded-md">
                  <Tag className="h-4 w-4" />
                  <span>{tag.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full"
                    onClick={() => handleDeleteTag(tag.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
