import { ServiceService } from "@/components/services/service-service" // Corrected import

export default function CreateServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ServiceService initialView="create" /> {/* Using ServiceService */}
    </div>
  )
}
