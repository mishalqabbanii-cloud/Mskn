import { useState } from 'react'
import { TicketModal } from '../TicketModal'
import { Button } from '@/components/ui/button'

export default function TicketModalExample() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  
  //todo: remove mock functionality
  const mockTicket = {
    id: '1',
    title: 'Network connectivity issues in Building A',
    description: 'Users in Building A are experiencing intermittent network connectivity issues. The problem seems to affect the entire floor and has been ongoing since morning.',
    priority: 'High' as const,
    status: 'In Progress' as const,
    assignedToUserId: '1'
  }
  
  const mockUsers = [
    { id: '1', name: 'Ahmed Al-Rashid' },
    { id: '2', name: 'Fatima Al-Zahra' },
    { id: '3', name: 'Omar Hassan' }
  ]

  const handleSave = (ticket: any) => {
    console.log('Save ticket:', ticket)
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex gap-4">
        <Button onClick={() => setIsCreateOpen(true)} data-testid="button-open-create">
          Create Ticket
        </Button>
        <Button variant="outline" onClick={() => setIsEditOpen(true)} data-testid="button-open-edit">
          Edit Ticket
        </Button>
      </div>
      
      <TicketModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleSave}
        mode="create"
        users={mockUsers}
      />
      
      <TicketModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSave}
        ticket={mockTicket}
        mode="edit"
        users={mockUsers}
      />
    </div>
  )
}