"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useTodoStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { Priority } from "@/lib/types"
import { Calendar } from "lucide-react"

type TodoFormProps = {
  onClose: () => void
  initialData?: { id: string }
}

export function TodoForm({ onClose, initialData }: TodoFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState<Priority>("none")
  const [tagsInput, setTagsInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { updateTodo, addTodo } = useTodoStore()
  const todoRef = useRef<HTMLInputElement>(null)

  // Load initial data for editing
  useEffect(() => {
    if (initialData) {
      const todo = useTodoStore.getState().todos.find((t) => t.id === initialData.id)
      if (todo) {
        setTitle(todo.title)
        setDescription(todo.description || "")
        setDueDate(todo.dueDate || "")
        setPriority(todo.priority)
        setTags([...todo.tags])
      }
    }
  }, [initialData])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSubmitting(true)
      try {
        if (initialData) {
          await updateTodo(initialData.id, {
            title,
            description: description || undefined,
            dueDate: dueDate || undefined,
            priority,
            tags,
          })
        } else {
          await addTodo({ title, description: description || undefined, dueDate: dueDate || undefined, priority, tags })
        }
        // Reset form
        setTitle("")
        setDescription("")
        setDueDate("")
        setPriority("none")
        setTagsInput("")
        setTags([])
        onClose()
      } finally {
        setIsSubmitting(false)
      }
    },
    [addTodo, initialData, description, dueDate, priority, tags, title, updateTodo, onClose]
  )

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const tag = tagsInput.trim()
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag])
        setTagsInput("")
      }
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/50">
      <div
        className="relative w-full max-w-md rounded-lg bg-card p-6 shadow-lg border border-border"
        style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            {initialData ? "Edit Todo" : "Add Todo"}
          </h2>
          <Button variant="outline" size="icon" onClick={onClose} className="p-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="font-medium">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
              ref={todoRef}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="description" className="font-medium">
              Description (optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dueDate" className="font-medium">
                Due Date & Time
              </Label>
              <input
                id="dueDate"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isSubmitting}
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <Label htmlFor="priority" className="font-medium">
                Priority
              </Label>
              <Select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                disabled={isSubmitting}
              >
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="tags" className="font-medium">
              Tags (press Enter to add)
            </Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => setTags(tags.filter((_, i) => i !== idx))}
                  className="badge bg-muted/60 text-muted-foreground hover:bg-muted/80"
                >
                  {tag}
                  <svg
                    className="ml-1 h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ))}
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                onKeyDown={handleTagAdd}
                placeholder="e.g., work, personal, shopping"
                disabled={isSubmitting}
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="btn btn-primary"
            >
              {isSubmitting ? "Saving..." : initialData ? "Update" : "Add Todo"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}