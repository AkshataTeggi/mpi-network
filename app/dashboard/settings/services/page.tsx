import { ServiceService } from "@/components/services/service-service" // Corrected import

export default function ServicesDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ServiceService initialView="list" /> {/* Using ServiceService */}
    </div>
  )
}
