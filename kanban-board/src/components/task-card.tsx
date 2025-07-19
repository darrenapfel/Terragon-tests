'use client'

import { Draggable } from '@hello-pangea/dnd'
import { Task, PRIORITY_COLORS, TYPE_COLORS } from '@/types/kanban'
import { Card, CardContent, CardHeader } from './ui/card'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback } from './ui/avatar'
import { 
  Calendar, 
  MoreHorizontal,
  Bug,
  Zap,
  FileText,
  Wrench,
  Book
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { Button } from './ui/button'

interface TaskCardProps {
  task: Task
  index: number
}

const TYPE_ICONS = {
  feature: Zap,
  bug: Bug,
  enhancement: FileText,
  chore: Wrench,
  documentation: Book
}

function getInitials(name?: string): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date)
}

export function TaskCard({ task, index }: TaskCardProps) {
  const TypeIcon = TYPE_ICONS[task.type]
  const isOverdue = task.dueDate && task.dueDate < new Date() && task.status !== 'done'

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "group cursor-pointer bg-white dark:bg-slate-800 border shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200",
            snapshot.isDragging && "rotate-3 shadow-xl ring-2 ring-blue-500 scale-105",
            isOverdue && "ring-1 ring-red-400"
          )}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  PRIORITY_COLORS[task.priority]
                )} />
                <TypeIcon className={cn(
                  "w-4 h-4",
                  TYPE_COLORS[task.type].replace('bg-', 'text-')
                )} />
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs font-medium text-white border-0",
                    TYPE_COLORS[task.type]
                  )}
                >
                  {task.type}
                </Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
                {task.description}
              </p>
            )}
          </CardHeader>
          <CardContent className="pt-0">
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {task.tags.slice(0, 3).map(tag => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    {tag}
                  </Badge>
                ))}
                {task.tags.length > 3 && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    +{task.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                {task.assignee && (
                  <div className="flex items-center gap-1">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                        {getInitials(task.assignee)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
              
              {task.dueDate && (
                <div className={cn(
                  "flex items-center gap-1 text-xs",
                  isOverdue 
                    ? "text-red-600 dark:text-red-400" 
                    : "text-slate-500 dark:text-slate-400"
                )}>
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  )
}