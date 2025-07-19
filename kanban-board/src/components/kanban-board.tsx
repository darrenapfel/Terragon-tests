'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { KanbanBoard as KanbanBoardType, Task, TaskStatus, DEFAULT_COLUMNS } from '@/types/kanban'
import { KanbanColumn } from './kanban-column'
import { TaskDialog } from './task-dialog'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'

const SAMPLE_TASKS: Record<string, Task> = {
  'task-1': {
    id: 'task-1',
    title: 'Implement user authentication',
    description: 'Add login and registration functionality with JWT tokens',
    priority: 'high',
    type: 'feature',
    status: 'todo',
    assignee: 'Claude AI',
    tags: ['auth', 'security', 'backend'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    dueDate: new Date('2024-02-01')
  },
  'task-2': {
    id: 'task-2',
    title: 'Fix responsive layout issues',
    description: 'Mobile layout breaks on certain screen sizes',
    priority: 'medium',
    type: 'bug',
    status: 'in-progress',
    assignee: 'Terry AI',
    tags: ['css', 'responsive', 'frontend'],
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-18')
  },
  'task-3': {
    id: 'task-3',
    title: 'Add dark mode support',
    description: 'Implement theme switching with system preference detection',
    priority: 'low',
    type: 'enhancement',
    status: 'backlog',
    tags: ['ui', 'theme', 'accessibility'],
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
  },
  'task-4': {
    id: 'task-4',
    title: 'Update API documentation',
    description: 'Document all endpoints with examples and schemas',
    priority: 'medium',
    type: 'documentation',
    status: 'review',
    assignee: 'Documentation Bot',
    tags: ['docs', 'api'],
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-20')
  },
  'task-5': {
    id: 'task-5',
    title: 'Optimize database queries',
    description: 'Improve performance by adding indexes and optimizing slow queries',
    priority: 'urgent',
    type: 'enhancement',
    status: 'done',
    assignee: 'Database Expert',
    tags: ['performance', 'database', 'backend'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-19')
  }
}

const INITIAL_BOARD: KanbanBoardType = {
  id: 'main-board',
  title: 'Development Board',
  columns: [
    { ...DEFAULT_COLUMNS[0], taskIds: ['task-3'] },
    { ...DEFAULT_COLUMNS[1], taskIds: ['task-1'] },
    { ...DEFAULT_COLUMNS[2], taskIds: ['task-2'] },
    { ...DEFAULT_COLUMNS[3], taskIds: ['task-4'] },
    { ...DEFAULT_COLUMNS[4], taskIds: ['task-5'] }
  ],
  tasks: SAMPLE_TASKS
}

export function KanbanBoard() {
  const [board, setBoard] = useState<KanbanBoardType>(INITIAL_BOARD)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null)

  useEffect(() => {
    const savedBoard = localStorage.getItem('kanban-board')
    if (savedBoard) {
      const parsedBoard = JSON.parse(savedBoard)
      Object.values(parsedBoard.tasks).forEach((task) => {
        const typedTask = task as Task
        typedTask.createdAt = new Date(typedTask.createdAt)
        typedTask.updatedAt = new Date(typedTask.updatedAt)
        if (typedTask.dueDate) typedTask.dueDate = new Date(typedTask.dueDate)
      })
      setBoard(parsedBoard)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('kanban-board', JSON.stringify(board))
  }, [board])

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const start = board.columns.find(col => col.id === source.droppableId)
    const finish = board.columns.find(col => col.id === destination.droppableId)

    if (!start || !finish) {
      return
    }

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      }

      setBoard(prev => ({
        ...prev,
        columns: prev.columns.map(col => 
          col.id === newColumn.id ? newColumn : col
        )
      }))
      return
    }

    const startTaskIds = Array.from(start.taskIds)
    startTaskIds.splice(source.index, 1)
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    }

    const finishTaskIds = Array.from(finish.taskIds)
    finishTaskIds.splice(destination.index, 0, draggableId)
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    }

    const updatedTask = {
      ...board.tasks[draggableId],
      status: finish.id,
      updatedAt: new Date()
    }

    setBoard(prev => ({
      ...prev,
      columns: prev.columns.map(col => {
        if (col.id === newStart.id) return newStart
        if (col.id === newFinish.id) return newFinish
        return col
      }),
      tasks: {
        ...prev.tasks,
        [draggableId]: updatedTask
      }
    }))
  }

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const targetColumn = board.columns.find(col => col.id === taskData.status)
    if (!targetColumn) return

    setBoard(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [newTask.id]: newTask
      },
      columns: prev.columns.map(col =>
        col.id === taskData.status
          ? { ...col, taskIds: [newTask.id, ...col.taskIds] }
          : col
      )
    }))
  }

  const handleAddTaskToColumn = (columnId: string) => {
    setSelectedColumnId(columnId)
    setIsTaskDialogOpen(true)
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      <div className="flex items-center justify-between p-6 flex-shrink-0 animate-slide-in-up">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 animate-float">
            {board.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track features, bugs, and tasks with beautiful Kanban boards
          </p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-200 animate-bounce-subtle"
          onClick={() => setIsTaskDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 flex-1 p-6 pt-0 overflow-hidden">
          {board.columns.map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={column.taskIds.map(taskId => board.tasks[taskId])}
              onAddTask={handleAddTaskToColumn}
            />
          ))}
        </div>
      </DragDropContext>

      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={(open) => {
          setIsTaskDialogOpen(open)
          if (!open) setSelectedColumnId(null)
        }}
        onSave={handleCreateTask}
        initialStatus={selectedColumnId as TaskStatus || 'todo'}
      />
    </div>
  )
}