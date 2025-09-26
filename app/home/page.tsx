import { AppLayout } from "@/components/layout/app-layout"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"

export default function HomePage() {
  return (
    <AppLayout>
      <DashboardOverview />
    </AppLayout>
  )
}
