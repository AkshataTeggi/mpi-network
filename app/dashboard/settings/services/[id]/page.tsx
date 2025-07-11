import { ServiceService } from "@/components/services/service-service";

export default async function ServiceDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ServiceService initialView="details" serviceId={params.id} />
    </div>
  );
}
