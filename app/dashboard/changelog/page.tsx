"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChangelogList } from "@/components/changelog-list"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ChangelogPage() {
  const [limit, setLimit] = useState(10)
  const router = useRouter()

  const loadMore = () => {
    setLimit((prev) => prev + 10)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Changelog</h2>
        <Button onClick={() => router.push("/dashboard/changelog/new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Entry
        </Button>
      </div>
      <ChangelogList limit={limit} />
      <div className="flex justify-center">
        <Button variant="outline" onClick={loadMore}>
          Load More
        </Button>
      </div>
    </div>
  )
}
