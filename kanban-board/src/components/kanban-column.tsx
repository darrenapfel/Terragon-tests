'use client'

import { Droppable } from '@hello-pangea/dnd'
import { Column, Task } from '@/types/kanban'
import { TaskCard } from './task-card'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  column: Column
  tasks: Task[]
}

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  return (
    <div className="flex-shrink-0 w-80 animate-slide-in-up">
      <Card className={cn(
        "h-full border-0 shadow-sm hover:shadow-md transition-all duration-300",
        column.color
      )}>
        <CardHeader className="pb-3">
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
        </CardHeader>
        <CardContent className="pt-0">
          <Droppable droppableId={column.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  "min-h-[200px] space-y-3 p-2 rounded-lg transition-all duration-300 ease-in-out",
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