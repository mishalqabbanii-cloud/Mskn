import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActivityItem {
  id: string
  message: string
  timestamp: string
  type: 'user' | 'subscription' | 'ticket' | 'system'
}

interface ActivityFeedProps {
  activities: ActivityItem[]
  className?: string
}

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return '👤'
      case 'subscription':
        return '💳'
      case 'ticket':
        return '🎫'
      case 'system':
        return '⚙️'
      default:
        return '📄'
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user':
        return 'bg-chart-3/10 text-chart-3'
      case 'subscription':
        return 'bg-chart-1/10 text-chart-1'
      case 'ticket':
        return 'bg-chart-2/10 text-chart-2'
      case 'system':
        return 'bg-muted text-muted-foreground'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <Card className={cn("w-full", className)} data-testid="card-activity-feed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-3">
            {activities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No recent activity
              </p>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-md hover:bg-muted/50" data-testid={`activity-${activity.id}`}>
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium",
                    getActivityColor(activity.type)
                  )}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}