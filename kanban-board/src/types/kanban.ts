export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TaskType = 'feature' | 'bug' | 'enhancement' | 'chore' | 'documentation'
export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done'

export interface Task {
  id: string
  title: string
  description?: string
  priority: TaskPriority
  type: TaskType
  status: TaskStatus
  assignee?: string
  tags?: string[]
  createdAt: Date
  updatedAt: Date
  dueDate?: Date
}

export interface Column {
  id: TaskStatus
  title: string
  taskIds: string[]
  color: string
}

export interface KanbanBoard {
  id: string
  title: string
  columns: Column[]
  tasks: Record<string, Task>
}

export const DEFAULT_COLUMNS: Column[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    taskIds: [],
    color: 'bg-slate-100 dark:bg-slate-800'
  },
  {
    id: 'todo',
    title: 'To Do',
    taskIds: [],
    color: 'bg-blue-100 dark:bg-blue-900/30'
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    taskIds: [],
    color: 'bg-yellow-100 dark:bg-yellow-900/30'
  },
  {
    id: 'review',
    title: 'Review',
    taskIds: [],
    color: 'bg-purple-100 dark:bg-purple-900/30'
  },
  {
    id: 'done',
    title: 'Done',
    taskIds: [],
    color: 'bg-green-100 dark:bg-green-900/30'
  }
]

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500'
}

export const TYPE_COLORS: Record<TaskType, string> = {
  feature: 'bg-blue-500',
  bug: 'bg-red-500',
  enhancement: 'bg-purple-500',
  chore: 'bg-gray-500',
  documentation: 'bg-indigo-500'
}