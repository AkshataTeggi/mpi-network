import { RoleService } from "@/components/roles/role-service";

export default async function EditPermissionPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <RoleService initialView="edit-permission" permissionId={params.id} />
    </div>
  );
}
