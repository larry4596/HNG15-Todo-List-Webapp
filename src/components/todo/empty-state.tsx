import { CheckSquare } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <CheckSquare className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground">No todos yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by adding your first todo.
      </p>
    </div>
  )
}