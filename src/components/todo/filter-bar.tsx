"use client"

import { useTodoStore } from "@/lib/store"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export function FilterBar() {
  const { filter, setFilter, todos } = useTodoStore()
  const allTags = Array.from(new Set(todos.flatMap((t) => t.tags))).sort()

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <Select
        value={filter.status}
        onChange={(e) => setFilter({ status: e.target.value as "all" | "active" | "completed" })}
        className="w-auto min-w-[140px]"
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </Select>

      <Select
        value={filter.sortBy}
        onChange={(e) => setFilter({ sortBy: e.target.value as any })}
        className="w-auto min-w-[160px]"
      >
        <option value="manual">Manual</option>
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
        <option value="createdAt">Created Date</option>
      </Select>

      <Select
        value={filter.sortOrder}
        onChange={(e) => setFilter({ sortOrder: e.target.value as "asc" | "desc" })}
        className="w-auto min-w-[120px]"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </Select>

      {allTags.length > 0 && (
        <Select
          value={filter.tags.join(",")}
          onChange={(e) => setFilter({ tags: e.target.value.split(",").filter(Boolean) })}
          className="w-auto min-w-[140px]"
        >
          <option value="">Filter by tag</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </Select>
      )}

      <Button variant="outline" size="sm" onClick={() => useTodoStore.getState().resetFilter()}>
        Reset
      </Button>
    </div>
  )
}