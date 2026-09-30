"use client"

import { useState } from "react"
import { useTodoStore } from "@/lib/store"
import { cn, getRelativeTime, isOverdue } from "@/lib/utils"
import { PRIORITY_COLORS, PRIORITY_LABELS } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Todo } from "@/lib/types"
import { Edit2, Trash2, Calendar, Tag } from "lucide-react"

type TodoItemProps = {
  todo: Todo
  onEdit?: (id: string) => void
}

export function TodoItem({ todo, onEdit }: TodoItemProps) {
  const { deleteTodo, toggleTodo } = useTodoStore()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const relativeTime = getRelativeTime(todo.dueDate)
  const overdue = isOverdue(todo.dueDate) && !todo.completed

  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:shadow-md",
        todo.completed && "opacity-60",
      )}
    >
      <div className="pt-0.5">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={(checked) => toggleTodo(todo.id)}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p
              className={cn(
                "font-medium text-foreground",
                todo.completed && "line-through text-muted-foreground"
              )}
            >
              {todo.title}
            </p>
            {todo.description && (
              <p
                className={cn(
                  "mt-1 text-sm text-muted-foreground",
                  todo.completed && "line-through"
                )}
              >
                {todo.description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {todo.dueDate && (
            <div
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md bg-muted/50 px-2.5 py-1 text-xs",
                overdue && "bg-red-100/50 text-red-700 dark:bg-red-900/20"
              )}
            >
              <Calendar className="h-3 w-3" />
              <span>{relativeTime}</span>
            </div>
          )}

          {todo.priority !== "none" && (
            <Badge
              className={cn(
                "text-xs font-medium",
                PRIORITY_COLORS[todo.priority]
              )}
            >
              {PRIORITY_LABELS[todo.priority]}
            </Badge>
          )}

          {todo.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        {confirmDelete ? (
          <div className="flex items-center gap-1">
            <Button
              variant="destructive"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => {
                deleteTodo(todo.id)
                setConfirmDelete(false)
              }}
            >
              Confirm
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              aria-label="Edit todo"
              onClick={() => onEdit?.(todo.id)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
              aria-label="Delete todo"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}