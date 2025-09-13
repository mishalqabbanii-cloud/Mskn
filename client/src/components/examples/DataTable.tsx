import { DataTable } from '../DataTable'
import { Badge } from '@/components/ui/badge'

export default function DataTableExample() {
  //todo: remove mock functionality
  const mockUsers = [
    { id: 1, name: "Ahmed Al-Rashid", email: "ahmed@example.com", role: "Manager", status: "Active", createdAt: "2024-01-15" },
    { id: 2, name: "Fatima Al-Zahra", email: "fatima@example.com", role: "Supervisor", status: "Active", createdAt: "2024-01-20" },
    { id: 3, name: "Omar Hassan", email: "omar@example.com", role: "Viewer", status: "Disabled", createdAt: "2024-01-25" },
    { id: 4, name: "Aisha Mohammed", email: "aisha@example.com", role: "Manager", status: "Active", createdAt: "2024-02-01" },
    { id: 5, name: "Khalid Ibrahim", email: "khalid@example.com", role: "Supervisor", status: "Active", createdAt: "2024-02-05" }
  ]

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

  const handleEdit = (user: any) => {
    console.log('Edit user:', user)
  }

  const handleDelete = (user: any) => {
    console.log('Delete user:', user)
  }

  const handleExport = () => {
    console.log('Export users to CSV')
  }

  return (
    <div className="p-6">
      <DataTable
        title="User Management"
        data={mockUsers}
        columns={columns}
        searchKeys={['name', 'email']}
        filterOptions={filterOptions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
      />
    </div>
  )
}