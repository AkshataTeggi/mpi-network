import { ServiceService } from "@/components/services/service-service"; // ✅ correct path

// 👇 add "async"
export default async function EditServicePage({
  params,
}: {
  params: { id: string };
}) {
  const serviceId = params.id; // can now be used safely

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ServiceService initialView="edit" serviceId={serviceId} />
    </div>
  );
}
