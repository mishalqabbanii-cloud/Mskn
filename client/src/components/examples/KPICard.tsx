import { KPICard } from '../KPICard'
import { Users, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react'

export default function KPICardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 p-6">
      <KPICard
        title="Total Users"
        value={1234}
        change="+12% from last month"
        changeType="positive"
        icon={<Users className="h-4 w-4" />}
      />
      <KPICard
        title="Active Subscriptions"
        value={856}
        change="+5.2% from last month"
        changeType="positive"
        icon={<CreditCard className="h-4 w-4" />}
      />
      <KPICard
        title="Open Tickets"
        value={23}
        change="-8% from last month"
        changeType="positive"
        icon={<AlertTriangle className="h-4 w-4" />}
      />
      <KPICard
        title="Resolved (30d)"
        value={189}
        change="+15% from last month"
        changeType="positive"
        icon={<CheckCircle className="h-4 w-4" />}
      />
    </div>
  )
}