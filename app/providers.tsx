"use client"

import type { ReactNode } from "react"
import { AuthProvider } from "@/hooks/use-auth"
import { TagsProvider } from "@/hooks/use-tags"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <TagsProvider>{children}</TagsProvider>
    </AuthProvider>
  )
}
