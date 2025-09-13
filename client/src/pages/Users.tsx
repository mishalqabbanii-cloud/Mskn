import { useState } from "react"
import { DataTable } from "@/components/DataTable"
import { UserModal } from "@/components/UserModal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: 'Manager' | 'Supervisor' | 'Viewer'
  status: 'Active' | 'Disabled'
  createdAt: string
}

export default function Users() {
  //todo: remove mock functionality
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: "Ahmed Al-Rashid", email: "ahmed@example.com", role: "Manager", status: "Active", createdAt: "2024-01-15" },
    { id: '2', name: "Fatima Al-Zahra", email: "fatima@example.com", role: "Supervisor", status: "Active", createdAt: "2024-01-20" },
    { id: '3', name: "Omar Hassan", email: "omar@example.com", role: "Viewer", status: "Disabled", createdAt: "2024-01-25" },
    { id: '4', name: "Aisha Mohammed", email: "aisha@example.com", role: "Manager", status: "Active", createdAt: "2024-02-01" },
    { id: '5', name: "Khalid Ibrahim", email: "khalid@example.com", role: "Supervisor", status: "Active", createdAt: "2024-02-05" },
    { id: '6', name: "Sara Al-Otaibi", email: "sara@example.com", role: "Viewer", status: "Active", createdAt: "2024-02-10" },
    { id: '7', name: "Yousef Ahmad", email: "yousef@example.com", role: "Manager", status: "Active", createdAt: "2024-02-15" }
  ])
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const columns = [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    {
      key: 'role',
      title: 'Role',
      sortable: true,
      render: (value: string) => (
        <Badge variant="secondary">{value}</Badge>
      )
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === 'Active' ? 'default' : 'destructive'}>
          {value}
        </Badge>
      )
    },
    { key: 'createdAt', title: 'Created', sortable: true }
  ]

  const filterOptions = [
    {
      key: 'role',
      label: 'Role',
      options: [
        { value: 'Manager', label: 'Manager' },
        { value: 'Supervisor', label: 'Supervisor' },
        { value: 'Viewer', label: 'Viewer' }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Disabled', label: 'Disabled' }
      ]
    }
  ]

  const handleCreateUser = (userData: any) => {
    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString().split('T')[0]
    }
    setUsers(prev => [...prev, newUser])
    console.log('Created user:', newUser)
    // todo: Add to activity log
  }

  const handleEditUser = (userData: any) => {
    setUsers(prev => prev.map(user => 
      user.id === userData.id ? { ...user, ...userData } : user
    ))
    console.log('Updated user:', userData)
    // todo: Add to activity log
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleDelete = (user: User) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      setUsers(prev => prev.filter(u => u.id !== user.id))
      console.log('Deleted user:', user)
      // todo: Add to activity log
    }
  }

  const handleExport = () => {
    console.log('Export users to CSV')
    // todo: Implement CSV export
  }

  const handleToggleStatus = (user: User) => {
    const newStatus = user.status === 'Active' ? 'Disabled' : 'Active'
    setUsers(prev => prev.map(u => 
      u.id === user.id ? { ...u, status: newStatus } : u
    ))
    console.log(`${newStatus === 'Active' ? 'Enabled' : 'Disabled'} user:`, user)
    // todo: Add to activity log
  }

  return (
    <div className="space-y-6 p-6" data-testid="page-users">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} data-testid="button-create-user">
          <Plus className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.status === 'Active').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Managers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.role === 'Manager').length}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Users Table */}
      <DataTable
        title="All Users"
        data={users}
        columns={columns}
        searchKeys={['name', 'email']}
        filterOptions={filterOptions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
      />
      
      {/* Modals */}
      <UserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateUser}
        mode="create"
      />
      
      <UserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedUser(null)
        }}
        onSave={handleEditUser}
        user={selectedUser}
        mode="edit"
      />
    </div>
  )
}