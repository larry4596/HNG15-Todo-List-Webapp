"use client"

import { useState } from "react"
import { useTodoStore } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const { setFilter } = useTodoStore()

  return (
    <div className="mb-4">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="Search todos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              setFilter({ search: query })
            }
          }}
          className="pl-9"
        />
      </div>
    </div>
  )
}