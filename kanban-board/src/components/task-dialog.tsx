'use client'

import { useState } from 'react'
import { Task, TaskPriority, TaskType, TaskStatus } from '@/types/kanban'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Calendar, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  initialStatus?: TaskStatus
  task?: Task
}

export function TaskDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  initialStatus = 'todo',
  task
}: TaskDialogProps) {
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium')
  const [type, setType] = useState<TaskType>(task?.type || 'feature')
  const [assignee, setAssignee] = useState(task?.assignee || '')
  const [tags, setTags] = useState<string[]>(task?.tags || [])
  const [newTag, setNewTag] = useState('')
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? task.dueDate.toISOString().split('T')[0] : ''
  )

  const priorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent']
  const types: TaskType[] = ['feature', 'bug', 'enhancement', 'chore', 'documentation']

  const handleSave = () => {
    if (!title.trim()) return

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      type,
      status: task?.status || initialStatus,
      assignee: assignee.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined
    })

    onOpenChange(false)
    handleReset()
  }

  const handleReset = () => {
    if (!task) {
      setTitle('')
      setDescription('')
      setPriority('medium')
      setType('feature')
      setAssignee('')
      setTags([])
      setNewTag('')
      setDueDate('')
    }
  }

  const addTag = () => {
    const tag = newTag.trim()
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (newTag.trim()) {
        addTag()
      } else {
        handleSave()
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {task ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
          <DialogDescription>
            {task ? 'Update task details below.' : 'Add a new task to your kanban board.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title *
            </label>
            <Input
              id="title"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Enter task description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <div className="flex gap-2">
                {priorities.map((p) => (
                  <Button
                    key={p}
                    variant={priority === p ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPriority(p)}
                    className={cn(
                      "capitalize",
                      priority === p && "ring-2 ring-offset-2",
                      p === 'low' && priority === p && "bg-green-600 hover:bg-green-700",
                      p === 'medium' && priority === p && "bg-yellow-600 hover:bg-yellow-700",
                      p === 'high' && priority === p && "bg-orange-600 hover:bg-orange-700",
                      p === 'urgent' && priority === p && "bg-red-600 hover:bg-red-700"
                    )}
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <div className="flex gap-2 flex-wrap">
                {types.map((t) => (
                  <Button
                    key={t}
                    variant={type === t ? "default" : "outline"}
                    size="sm"
                    onClick={() => setType(t)}
                    className="capitalize"
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="assignee" className="text-sm font-medium">
              Assignee
            </label>
            <Input
              id="assignee"
              placeholder="Enter assignee name..."
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
              Due Date
            </label>
            <div className="relative">
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="pl-10"
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium">
              Tags
            </label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-2 py-1 gap-1"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:bg-slate-300 dark:hover:bg-slate-600 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTag()
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                disabled={!newTag.trim()}
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}