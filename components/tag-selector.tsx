"use client"

import type React from "react"

import { useState } from "react"
import { Check, Plus, Tag, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAuth } from "@/hooks/use-auth"
import { useTags } from "@/hooks/use-tags"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TagSelectorProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
}

export function TagSelector({ selectedTags, onTagsChange }: TagSelectorProps) {
  const [open, setOpen] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  const { token } = useAuth()
  const { tags, loading, error, createTag } = useTags()

  const handleSelect = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter((id) => id !== tagId))
    } else {
      onTagsChange([...selectedTags, tagId])
    }
  }

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTagName.trim()) return

    try {
      const newTag = await createTag(newTagName)
      if (newTag) {
        onTagsChange([...selectedTags, newTag.id])
        setNewTagName("")
      }
    } catch (error) {
      console.error("Failed to create tag:", error)
    }
  }

  const getTagName = (tagId: string) => {
    const tag = tags.find((t) => t.id === tagId)
    return tag ? tag.name : "unknown"
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tagId) => (
          <Badge key={tagId} variant="secondary" className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {getTagName(tagId)}
            <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => handleSelect(tagId)}>
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        {selectedTags.length === 0 && <div className="text-sm text-muted-foreground">No tags selected</div>}
      </div>

      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center justify-between">
              <div className="flex items-center">
                <Tag className="mr-2 h-4 w-4" />
                <span>Select Tags</span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start" side="bottom">
            <Command>
              <CommandInput placeholder="Search tags..." />
              <CommandList>
                <CommandEmpty>{loading ? "Loading tags..." : "No tags found."}</CommandEmpty>
                <CommandGroup>
                  {tags.map((tag) => (
                    <CommandItem key={tag.id} value={tag.name} onSelect={() => handleSelect(tag.id)}>
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          selectedTags.includes(tag.id) ? "bg-primary text-primary-foreground" : "opacity-50",
                        )}
                      >
                        {selectedTags.includes(tag.id) && <Check className="h-3 w-3" />}
                      </div>
                      <Tag className="mr-2 h-4 w-4" />
                      {tag.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
              <div className="p-2 border-t">
                <form onSubmit={handleCreateTag} className="flex items-center gap-2">
                  <Input
                    placeholder="Create new tag..."
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="h-8"
                  />
                  <Button type="submit" size="sm" disabled={!newTagName.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
