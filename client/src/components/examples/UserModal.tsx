import { useState } from 'react'
import { UserModal } from '../UserModal'
import { Button } from '@/components/ui/button'

export default function UserModalExample() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  
  //todo: remove mock functionality
  const mockUser = {
    id: '1',
    name: 'Ahmed Al-Rashid',
    email: 'ahmed@example.com',
    role: 'Manager' as const,
    status: 'Active' as const
  }

  const handleSave = (user: any) => {
    console.log('Save user:', user)
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex gap-4">
        <Button onClick={() => setIsCreateOpen(true)} data-testid="button-open-create">
          Create User
        </Button>
        <Button variant="outline" onClick={() => setIsEditOpen(true)} data-testid="button-open-edit">
          Edit User
        </Button>
      </div>
      
      <UserModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleSave}
        mode="create"
      />
      
      <UserModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSave}
        user={mockUser}
        mode="edit"
      />
    </div>
  )
}