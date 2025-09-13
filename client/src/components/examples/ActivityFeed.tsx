import { ActivityFeed } from '../ActivityFeed'

export default function ActivityFeedExample() {
  //todo: remove mock functionality
  const mockActivities = [
    {
      id: '1',
      message: 'Created user Mohammed (Manager)',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      type: 'user' as const
    },
    {
      id: '2', 
      message: 'Assigned Pro Plan to Fatima Al-Zahra',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      type: 'subscription' as const
    },
    {
      id: '3',
      message: 'Ticket #123 marked as resolved - Network connectivity issue',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      type: 'ticket' as const
    },
    {
      id: '4',
      message: 'System backup completed successfully',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      type: 'system' as const
    },
    {
      id: '5',
      message: 'Updated user Omar Hassan role to Supervisor',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      type: 'user' as const
    },
    {
      id: '6',
      message: 'Basic Plan subscription expired for user123',
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      type: 'subscription' as const
    }
  ]

  return (
    <div className="p-6">
      <ActivityFeed activities={mockActivities} />
    </div>
  )
}