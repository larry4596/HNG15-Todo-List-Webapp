"use client"

import { useEffect, useState, type ReactNode } from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Todo, FilterState, Priority } from "./types"
import { PRIORITY_ORDER } from "./types"

interface TodoStore {
  todos: Todo[]
  filter: FilterState
  addTodo: (data: { title: string; description?: string; dueDate?: string; priority?: Priority; tags?: string[] }) => Todo
  updateTodo: (id: string, updates: Partial<Omit<Todo, "id" | "createdAt">>) => void
  deleteTodo: (id: string) => void
  toggleTodo: (id: string) => void
  setFilter: (filter: Partial<FilterState>) => void
  resetFilter: () => void
  getFilteredTodos: () => Todo[]
}

const defaultFilter: FilterState = {
  status: "all",
  search: "",
  sortBy: "manual",
  sortOrder: "asc",
  tags: [],
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      filter: defaultFilter,

      addTodo: (data) => {
        const todo: Todo = {
          id: crypto.randomUUID(),
          title: data.title.trim(),
          description: data.description?.trim() || undefined,
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          dueDate: data.dueDate || undefined,
          priority: data.priority || "none",
          tags: data.tags || [],
          order: get().todos.length,
        }
        set((s) => ({ todos: [...s.todos, todo] }))
        return todo
      },

      updateTodo: (id, updates) =>
        set((s) => ({
          todos: s.todos.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        })),

      deleteTodo: (id) =>
        set((s) => ({ todos: s.todos.filter((t) => t.id !== id) })),

      toggleTodo: (id) =>
        set((s) => ({
          todos: s.todos.map((t) =>
            t.id === id ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() } : t
          ),
        })),

      setFilter: (filter) =>
        set((s) => ({ filter: { ...s.filter, ...filter } })),

      resetFilter: () => set({ filter: defaultFilter }),

      getFilteredTodos: () => {
        const { todos, filter } = get()
        let result = [...todos]

        // status filter
        if (filter.status === "active") result = result.filter((t) => !t.completed)
        else if (filter.status === "completed") result = result.filter((t) => t.completed)

        // search
        if (filter.search.trim()) {
          const q = filter.search.toLowerCase()
          result = result.filter(
            (t) =>
              t.title.toLowerCase().includes(q) ||
              (t.description?.toLowerCase().includes(q) ?? false) ||
              t.tags.some((tag) => tag.toLowerCase().includes(q))
          )
        }

        // tag filter
        if (filter.tags.length > 0) {
          result = result.filter((t) => filter.tags.every((tag) => t.tags.includes(tag)))
        }

        // sort
        result.sort((a, b) => {
          let cmp = 0
          switch (filter.sortBy) {
            case "dueDate":
              if (!a.dueDate && !b.dueDate) cmp = 0
              else if (!a.dueDate) cmp = 1
              else if (!b.dueDate) cmp = -1
              else cmp = a.dueDate.localeCompare(b.dueDate)
              break
            case "priority":
              cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
              break
            case "createdAt":
              cmp = a.createdAt.localeCompare(b.createdAt)
              break
            case "manual":
            default:
              cmp = a.order - b.order
              break
          }
          if (cmp === 0) cmp = a.order - b.order
          return filter.sortOrder === "desc" ? -cmp : cmp
        })

        return result
      },
    }),
    {
      name: "hng15-todo-store",
      version: 1,
    }
  )
)

/**
 * Gates rendering until after the first client mount so that todos
 * persisted in localStorage never mismatch the server-rendered HTML.
 */
export function TodoProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <>{children}</>
}
