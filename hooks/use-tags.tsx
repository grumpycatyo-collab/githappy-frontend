"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { useAuth } from "./use-auth"

interface Tag {
  id: string
  name: string
  user_id: string
}

interface TagsContextType {
  tags: Tag[]
  loading: boolean
  error: string | null
  createTag: (name: string) => Promise<Tag | null>
  deleteTag: (id: string) => Promise<boolean>
  refreshTags: () => Promise<void>
}

const TagsContext = createContext<TagsContextType>({
  tags: [],
  loading: false,
  error: null,
  createTag: async () => null,
  deleteTag: async () => false,
  refreshTags: async () => {},
})

export function TagsProvider({ children }: { children: ReactNode }) {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuth()

  const fetchTags = async () => {
    if (!token) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch("http://localhost:8000/api/tags/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch tags")
      }

      const data = await response.json()
      setTags(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [token])

  const createTag = async (name: string): Promise<Tag | null> => {
    if (!token) return null

    try {
      const response = await fetch("http://localhost:8000/api/tags/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error("Failed to create tag")
      }

      const newTag = await response.json()
      setTags((prev) => [...prev, newTag])
      return newTag
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      return null
    }
  }

  const deleteTag = async (id: string): Promise<boolean> => {
    if (!token) return false

    try {
      const response = await fetch(`http://localhost:8000/api/tags/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete tag")
      }

      setTags((prev) => prev.filter((tag) => tag.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      return false
    }
  }

  const refreshTags = async () => {
    await fetchTags()
  }

  return (
    <TagsContext.Provider value={{ tags, loading, error, createTag, deleteTag, refreshTags }}>
      {children}
    </TagsContext.Provider>
  )
}

export function useTags() {
  return useContext(TagsContext)
}
