"use client"

import { useState } from "react"
import { useTodoStore } from "@/lib/store"
import { TodoForm } from "./todo-form"
import { TodoList } from "./todo-list"
import { FilterBar } from "./filter-bar"
import { SearchBar } from "./search-bar"
import { StatsBar } from "./stats-bar"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function TodoApp() {
  const { todos, getFilteredTodos } = useTodoStore()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<{ id: string } | null>(null)
  const filteredTodos = getFilteredTodos()

  const activeCount = todos.filter((t) => !t.completed).length
  const completedCount = todos.filter((t) => t.completed).length

  const handleEdit = (id: string) => {
    setEditingTodo({ id })
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingTodo(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-foreground">Todo List</h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setIsFormOpen(true)}
                className="btn btn-primary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Todo
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <SearchBar />
        <FilterBar />
        <StatsBar total={todos.length} active={activeCount} completed={completedCount} />
        <TodoList onEdit={handleEdit} />
      </main>

      {isFormOpen && (
        <TodoForm
          onClose={handleCloseForm}
          initialData={editingTodo ? { id: editingTodo.id } : undefined}
        />
      )}
    </div>
  )
}