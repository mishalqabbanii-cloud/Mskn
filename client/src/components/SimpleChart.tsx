import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ChartData {
  label: string
  value: number
  color?: string
}

interface SimpleChartProps {
  title: string
  data: ChartData[]
  type?: 'bar' | 'status'
  className?: string
}

export function SimpleChart({ title, data, type = 'bar', className }: SimpleChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))

  if (type === 'status') {
    return (
      <Card className={cn("hover-elevate", className)} data-testid={`chart-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        <CardHeader>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.map((item, index) => (
              <Badge
                key={index}
                variant="secondary"
                className={cn(
                  "text-xs",
                  item.color && `bg-${item.color} hover:bg-${item.color}/80`
                )}
                data-testid={`badge-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.label}: {item.value}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("hover-elevate", className)} data-testid={`chart-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="truncate">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={cn(
                      "h-2 rounded-full transition-all",
                      item.color ? `bg-${item.color}` : "bg-primary"
                    )}
                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                    data-testid={`bar-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}