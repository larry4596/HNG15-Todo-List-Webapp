"use client"

import { useMemo } from "react"
import { useTodoStore } from "@/lib/store"
import { TodoItem } from "./todo-item"
import { EmptyState } from "./empty-state"
import { Skeleton } from "./skeleton"

export function TodoList({ onEdit }: { onEdit?: (id: string) => void }) {
  const todos = useTodoStore((s) => s.todos)
  const filter = useTodoStore((s) => s.filter)
  // Compute in a memo instead of via a selector: the selector would return a
  // fresh array on every store notification and loop forever under React 18+.
  const filteredTodos = useMemo(
    () => useTodoStore.getState().getFilteredTodos(),
    [todos, filter]
  )

  if (todos.length === 0) {
    return <EmptyState />
  }

  if (filteredTodos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-sm">No todos match your filters.</p>
        <button
          onClick={() => useTodoStore.getState().resetFilter()}
          className="mt-2 text-sm text-primary hover:underline"
        >
          Reset filters
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onEdit={onEdit} />
      ))}
    </div>
  )
}