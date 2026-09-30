export type Priority = "none" | "low" | "medium" | "high" | "urgent";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string; // ISO string
  updatedAt: string;
  dueDate?: string; // ISO string
  priority: Priority;
  tags: string[];
  order: number;
}

export interface FilterState {
  status: "all" | "active" | "completed";
  search: string;
  sortBy: "dueDate" | "priority" | "createdAt" | "manual";
  sortOrder: "asc" | "desc";
  tags: string[];
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  none: "None",
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  none: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

export const PRIORITY_ORDER: Record<Priority, number> = {
  none: 0,
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
};