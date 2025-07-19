'use client'

import { Droppable } from '@hello-pangea/dnd'
import { Column, Task } from '@/types/kanban'
import { TaskCard } from './task-card'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  column: Column
  tasks: Task[]
  onAddTask: (columnId: string) => void
}

export function KanbanColumn({ column, tasks, onAddTask }: KanbanColumnProps) {
  return (
    <div className="flex-shrink-0 w-80 h-full animate-slide-in-up">
      <Card className={cn(
        "h-full border-0 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col",
        column.color
      )}>
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle className="flex items-center justify-between text-lg font-semibold">
            <span className="text-slate-700 dark:text-slate-200">
              {column.title}
            </span>
            <Badge 
              variant="secondary" 
              className="bg-white/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300"
            >
              {tasks.length}
            </Badge>
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            className="w-full mt-2 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-white/50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400"
            onClick={() => onAddTask(column.id)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add task
          </Button>
        </CardHeader>
        <CardContent className="pt-0 flex-1 flex flex-col">
          <Droppable droppableId={column.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  "flex-1 space-y-3 p-2 rounded-lg transition-all duration-300 ease-in-out",
                  snapshot.isDraggingOver && "bg-white/30 dark:bg-slate-700/30 scale-[1.02] ring-2 ring-blue-300 dark:ring-blue-600"
                )}
              >
                {tasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={index}
                  />
                ))}
                {provided.placeholder}
                {tasks.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-slate-400 dark:text-slate-500 text-sm">
                    Drop tasks here
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </CardContent>
      </Card>
    </div>
  )
}