import { useState } from "react"
import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"

interface Plan {
  id: string
  name: string
  priceSAR: number
  period: 'Monthly' | 'Yearly'
  features: string[]
  isActive: boolean
}

interface UserSubscription {
  id: string
  userId: string
  userName: string
  planId: string
  planName: string
  startDate: string
  endDate: string
  status: 'Active' | 'Expired' | 'Cancelled'
}

export default function Subscriptions() {
  //todo: remove mock functionality
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: '1',
      name: 'Basic Plan',
      priceSAR: 99,
      period: 'Monthly',
      features: ['5 Users', 'Basic Support', '10GB Storage'],
      isActive: true
    },
    {
      id: '2',
      name: 'Pro Plan',
      priceSAR: 299,
      period: 'Monthly',
      features: ['25 Users', 'Priority Support', '100GB Storage', 'Advanced Analytics'],
      isActive: true
    },
    {
      id: '3',
      name: 'Enterprise',
      priceSAR: 999,
      period: 'Monthly',
      features: ['Unlimited Users', '24/7 Support', '1TB Storage', 'Custom Integrations'],
      isActive: true
    },
    {
      id: '4',
      name: 'Annual Basic',
      priceSAR: 999,
      period: 'Yearly',
      features: ['5 Users', 'Basic Support', '10GB Storage', '2 Months Free'],
      isActive: false
    }
  ])

  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Ahmed Al-Rashid',
      planId: '2',
      planName: 'Pro Plan',
      startDate: '2024-01-01',
      endDate: '2024-02-01',
      status: 'Active'
    },
    {
      id: '2',
      userId: '2',
      userName: 'Fatima Al-Zahra',
      planId: '1',
      planName: 'Basic Plan',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      status: 'Active'
    },
    {
      id: '3',
      userId: '3',
      userName: 'Omar Hassan',
      planId: '2',
      planName: 'Pro Plan',
      startDate: '2023-12-01',
      endDate: '2024-01-01',
      status: 'Expired'
    }
  ])

  const planColumns = [
    { key: 'name', title: 'Plan Name', sortable: true },
    {
      key: 'priceSAR',
      title: 'Price (SAR)',
      sortable: true,
      render: (value: number) => `${value} SAR`
    },
    {
      key: 'period',
      title: 'Period',
      sortable: true,
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      )
    },
    {
      key: 'features',
      title: 'Features',
      render: (value: string[]) => (
        <div className="max-w-xs">
          <p className="text-sm text-muted-foreground truncate">
            {value.join(', ')}
          </p>
        </div>
      )
    },
    {
      key: 'isActive',
      title: 'Status',
      sortable: true,
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    }
  ]

  const subscriptionColumns = [
    { key: 'userName', title: 'User', sortable: true },
    { key: 'planName', title: 'Plan', sortable: true },
    { key: 'startDate', title: 'Start Date', sortable: true },
    { key: 'endDate', title: 'End Date', sortable: true },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value: string) => {
        const variant = value === 'Active' ? 'default' : 
                       value === 'Expired' ? 'destructive' : 'secondary'
        return <Badge variant={variant}>{value}</Badge>
      }
    }
  ]

  const subscriptionFilterOptions = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Expired', label: 'Expired' },
        { value: 'Cancelled', label: 'Cancelled' }
      ]
    }
  ]

  const handleEditPlan = (plan: Plan) => {
    console.log('Edit plan:', plan)
    // todo: Open plan modal
  }

  const handleDeletePlan = (plan: Plan) => {
    if (confirm(`Are you sure you want to delete ${plan.name}?`)) {
      setPlans(prev => prev.filter(p => p.id !== plan.id))
      console.log('Deleted plan:', plan)
    }
  }

  const handleEditSubscription = (subscription: UserSubscription) => {
    console.log('Edit subscription:', subscription)
    // todo: Open subscription modal
  }

  const handleCancelSubscription = (subscription: UserSubscription) => {
    if (confirm(`Cancel subscription for ${subscription.userName}?`)) {
      setSubscriptions(prev => prev.map(s => 
        s.id === subscription.id ? { ...s, status: 'Cancelled' as const } : s
      ))
      console.log('Cancelled subscription:', subscription)
    }
  }

  const handleExportPlans = () => {
    console.log('Export plans to CSV')
  }

  const handleExportSubscriptions = () => {
    console.log('Export subscriptions to CSV')
  }

  const activeSubscriptions = subscriptions.filter(s => s.status === 'Active').length
  const totalRevenue = subscriptions
    .filter(s => s.status === 'Active')
    .reduce((sum, s) => {
      const plan = plans.find(p => p.id === s.planId)
      return sum + (plan?.priceSAR || 0)
    }, 0)

  return (
    <div className="space-y-6 p-6" data-testid="page-subscriptions">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
        <p className="text-muted-foreground">
          Manage subscription plans and user subscriptions
        </p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans.filter(p => p.isActive).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue} SAR</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList>
          <TabsTrigger value="plans" data-testid="tab-plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="subscriptions" data-testid="tab-subscriptions">User Subscriptions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="plans" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Subscription Plans</h2>
            <Button data-testid="button-create-plan">
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          </div>
          
          <DataTable
            title="All Plans"
            data={plans}
            columns={planColumns}
            searchKeys={['name']}
            onEdit={handleEditPlan}
            onDelete={handleDeletePlan}
            onExport={handleExportPlans}
          />
        </TabsContent>
        
        <TabsContent value="subscriptions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">User Subscriptions</h2>
            <Button data-testid="button-assign-subscription">
              <Plus className="h-4 w-4 mr-2" />
              Assign Subscription
            </Button>
          </div>
          
          <DataTable
            title="All User Subscriptions"
            data={subscriptions}
            columns={subscriptionColumns}
            searchKeys={['userName', 'planName']}
            filterOptions={subscriptionFilterOptions}
            onEdit={handleEditSubscription}
            onDelete={handleCancelSubscription}
            onExport={handleExportSubscriptions}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}