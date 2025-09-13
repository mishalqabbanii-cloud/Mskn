import { useState } from "react"
import { DataTable } from "@/components/DataTable"
import { TicketModal } from "@/components/TicketModal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"

interface Ticket {
  id: string
  title: string
  description: string
  priority: 'Low' | 'Medium' | 'High'
  status: 'Open' | 'In Progress' | 'Resolved'
  assignedToUserId?: string
  assignedToUserName?: string
  createdAt: string
  updatedAt: string
}

export default function Maintenance() {
  //todo: remove mock functionality
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: '1',
      title: 'Network connectivity issues in Building A',
      description: 'Users in Building A are experiencing intermittent network connectivity issues.',
      priority: 'High',
      status: 'In Progress',
      assignedToUserId: '1',
      assignedToUserName: 'Ahmed Al-Rashid',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-16'
    },
    {
      id: '2',
      title: 'Printer not working in HR department',
      description: 'The main printer in HR department is not responding to print jobs.',
      priority: 'Medium',
      status: 'Open',
      assignedToUserId: '2',
      assignedToUserName: 'Fatima Al-Zahra',
      createdAt: '2024-01-16',
      updatedAt: '2024-01-16'
    },
    {
      id: '3',
      title: 'Software license renewal needed',
      description: 'Microsoft Office license expires next month. Need to renew for 50 users.',
      priority: 'Low',
      status: 'Open',
      createdAt: '2024-01-17',
      updatedAt: '2024-01-17'
    },
    {
      id: '4',
      title: 'Database backup failed',
      description: 'Last night\'s automated database backup failed. Need to investigate and run manual backup.',
      priority: 'High',
      status: 'Resolved',
      assignedToUserId: '1',
      assignedToUserName: 'Ahmed Al-Rashid',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-12'
    },
    {
      id: '5',
      title: 'Email server maintenance',
      description: 'Schedule monthly maintenance for email server to clear logs and update security patches.',
      priority: 'Medium',
      status: 'Resolved',
      assignedToUserId: '3',
      assignedToUserName: 'Omar Hassan',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-10'
    }
  ])
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  
  const mockUsers = [
    { id: '1', name: 'Ahmed Al-Rashid' },
    { id: '2', name: 'Fatima Al-Zahra' },
    { id: '3', name: 'Omar Hassan' },
    { id: '4', name: 'Aisha Mohammed' }
  ]

  const columns = [
    { key: 'title', title: 'Title', sortable: true },
    {
      key: 'priority',
      title: 'Priority',
      sortable: true,
      render: (value: string) => {
        const variant = value === 'High' ? 'destructive' : 
                       value === 'Medium' ? 'default' : 'secondary'
        return <Badge variant={variant}>{value}</Badge>
      }
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value: string) => {
        const variant = value === 'Resolved' ? 'default' : 
                       value === 'In Progress' ? 'secondary' : 'outline'
        return <Badge variant={variant}>{value}</Badge>
      }
    },
    {
      key: 'assignedToUserName',
      title: 'Assigned To',
      sortable: true,
      render: (value: string) => value || 'Unassigned'
    },
    { key: 'createdAt', title: 'Created', sortable: true },
    { key: 'updatedAt', title: 'Updated', sortable: true }
  ]

  const filterOptions = [
    {
      key: 'priority',
      label: 'Priority',
      options: [
        { value: 'High', label: 'High' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Low', label: 'Low' }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'Open', label: 'Open' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Resolved', label: 'Resolved' }
      ]
    }
  ]

  const handleCreateTicket = (ticketData: any) => {
    const newTicket: Ticket = {
      id: Date.now().toString(),
      ...ticketData,
      assignedToUserName: ticketData.assignedToUserId ? 
        mockUsers.find(u => u.id === ticketData.assignedToUserId)?.name : undefined,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }
    setTickets(prev => [...prev, newTicket])
    console.log('Created ticket:', newTicket)
    // todo: Add to activity log
  }

  const handleEditTicket = (ticketData: any) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketData.id ? {
        ...ticket,
        ...ticketData,
        assignedToUserName: ticketData.assignedToUserId ? 
          mockUsers.find(u => u.id === ticketData.assignedToUserId)?.name : undefined,
        updatedAt: new Date().toISOString().split('T')[0]
      } : ticket
    ))
    console.log('Updated ticket:', ticketData)
    // todo: Add to activity log
  }

  const handleEdit = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setIsEditModalOpen(true)
  }

  const handleDelete = (ticket: Ticket) => {
    if (confirm(`Are you sure you want to delete ticket "${ticket.title}"?`)) {
      setTickets(prev => prev.filter(t => t.id !== ticket.id))
      console.log('Deleted ticket:', ticket)
      // todo: Add to activity log
    }
  }

  const handleExport = () => {
    console.log('Export tickets to CSV')
    // todo: Implement CSV export
  }

  const openTickets = tickets.filter(t => t.status === 'Open').length
  const inProgressTickets = tickets.filter(t => t.status === 'In Progress').length
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved').length
  const highPriorityTickets = tickets.filter(t => t.priority === 'High' && t.status !== 'Resolved').length

  return (
    <div className="space-y-6 p-6" data-testid="page-maintenance">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Tickets</h1>
          <p className="text-muted-foreground">
            Track and manage maintenance requests and system issues
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} data-testid="button-create-ticket">
          <Plus className="h-4 w-4 mr-2" />
          Create Ticket
        </Button>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{openTickets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-3">{inProgressTickets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-1">{resolvedTickets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{highPriorityTickets}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tickets Table */}
      <DataTable
        title="All Tickets"
        data={tickets}
        columns={columns}
        searchKeys={['title', 'description', 'assignedToUserName']}
        filterOptions={filterOptions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
      />
      
      {/* Modals */}
      <TicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateTicket}
        mode="create"
        users={mockUsers}
      />
      
      <TicketModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedTicket(null)
        }}
        onSave={handleEditTicket}
        ticket={selectedTicket}
        mode="edit"
        users={mockUsers}
      />
    </div>
  )
}