import { SimpleChart } from '../SimpleChart'

export default function SimpleChartExample() {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
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
  )
}