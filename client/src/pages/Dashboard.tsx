import { KPICard } from "@/components/KPICard"
import { SimpleChart } from "@/components/SimpleChart"
import { ActivityFeed } from "@/components/ActivityFeed"
import { Users, CreditCard, AlertTriangle, CheckCircle } from "lucide-react"

export default function Dashboard() {
  
  const kpiData = {
    totalUsers: 1234,
    activeSubscriptions: 856,
    openTickets: 23,
    resolvedTickets: 189
  }

  const subscriptionData = [
    { label: "Basic Plan", value: 45, color: "chart-1" },
    { label: "Pro Plan", value: 32, color: "chart-2" },
    { label: "Enterprise", value: 18, color: "chart-3" },
    { label: "Free Trial", value: 12, color: "chart-4" }
  ]

  const ticketData = [
    { label: "Open", value: 23, color: "chart-2" },
    { label: "In Progress", value: 15, color: "chart-3" },
    { label: "Resolved", value: 189, color: "chart-1" }
  ]

  const recentActivities = [
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
    }
  ]

  return (
    <div className="space-y-6 p-6" data-testid="page-dashboard">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your admin system metrics and recent activity
        </p>
      </div>
      
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard
          title="Total Users"
          value={kpiData.totalUsers}
          change="+12% from last month"
          changeType="positive"
          icon={<Users className="h-4 w-4" />}
        />
        <KPICard
          title="Active Subscriptions"
          value={kpiData.activeSubscriptions}
          change="+5.2% from last month"
          changeType="positive"
          icon={<CreditCard className="h-4 w-4" />}
        />
        <KPICard
          title="Open Tickets"
          value={kpiData.openTickets}
          change="-8% from last month"
          changeType="positive"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <KPICard
          title="Resolved (30d)"
          value={kpiData.resolvedTickets}
          change="+15% from last month"
          changeType="positive"
          icon={<CheckCircle className="h-4 w-4" />}
        />
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart
          title="Subscriptions by Plan"
          data={subscriptionData}
          type="bar"
        />
        <SimpleChart
          title="Tickets by Status"
          data={ticketData}
          type="status"
        />
      </div>
      
      {/* Activity Feed */}
      <ActivityFeed activities={recentActivities} />
    </div>
  )
}