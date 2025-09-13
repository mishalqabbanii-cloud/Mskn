import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface Ticket {
  id?: string
  title: string
  description: string
  priority: 'Low' | 'Medium' | 'High'
  status: 'Open' | 'In Progress' | 'Resolved'
  assignedToUserId?: string
}

interface TicketModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (ticket: Ticket) => void
  ticket?: Ticket | null
  mode: 'create' | 'edit'
  users?: { id: string; name: string }[]
}

export function TicketModal({ isOpen, onClose, onSave, ticket, mode, users = [] }: TicketModalProps) {
  const [formData, setFormData] = useState<Ticket>({
    title: ticket?.title || '',
    description: ticket?.description || '',
    priority: ticket?.priority || 'Medium',
    status: ticket?.status || 'Open',
    assignedToUserId: ticket?.assignedToUserId || ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim() || formData.title.length < 3) {
      newErrors.title = 'Title is required (min 3 characters)'
    }
    
    if (!formData.description.trim() || formData.description.length < 10) {
      newErrors.description = 'Description is required (min 10 characters)'
    }
    
    if (!formData.priority) {
      newErrors.priority = 'Priority is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave({ ...formData, id: ticket?.id })
      onClose()
      // Reset form
      setFormData({ title: '', description: '', priority: 'Medium', status: 'Open', assignedToUserId: '' })
      setErrors({})
    }
  }

  const handleClose = () => {
    onClose()
    setErrors({})
    if (ticket) {
      setFormData({
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status,
        assignedToUserId: ticket.assignedToUserId || ''
      })
    } else {
      setFormData({ title: '', description: '', priority: 'Medium', status: 'Open', assignedToUserId: '' })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-destructive'
      case 'Medium': return 'text-chart-2'
      case 'Low': return 'text-chart-4'
      default: return 'text-muted-foreground'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl" data-testid="modal-ticket">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create Ticket' : 'Edit Ticket'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter ticket title"
              data-testid="input-title"
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the issue in detail..."
              rows={4}
              data-testid="textarea-description"
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger data-testid="select-priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-chart-4">Low</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="Medium">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-chart-2">Medium</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="High">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-destructive">High</Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && <p className="text-sm text-destructive">{errors.priority}</p>}
            </div>
            
            {mode === 'edit' && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger data-testid="select-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assign To</Label>
            <Select value={formData.assignedToUserId} onValueChange={(value) => setFormData(prev => ({ ...prev, assignedToUserId: value }))}>
              <SelectTrigger data-testid="select-assignee">
                <SelectValue placeholder="Select assignee (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} data-testid="button-cancel">
              Cancel
            </Button>
            <Button type="submit" data-testid="button-save">
              {mode === 'create' ? 'Create Ticket' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}