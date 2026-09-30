import { cn } from "@/lib/utils"

export function StatsBar({ total, active, completed }: { total: number; active: number; completed: number }) {
  const items = [
    { label: "All", value: total },
    { label: "Active", value: active },
    { label: "Completed", value: completed },
  ]

  return (
    <div className="flex gap-2 mb-4">
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "rounded-md bg-muted px-3 py-1.5 text-xs text-muted-foreground",
            item.label === "Active" && item.value > 0 && "bg-blue-100/50 dark:bg-blue-900/20"
          )}
        >
          <span className="font-medium text-foreground">{item.value}</span>
          <span className="ml-1">{item.label}</span>
        </div>
      ))}
    </div>
  )
}