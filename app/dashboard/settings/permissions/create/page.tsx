import { RoleService } from "@/components/roles/role-service";

export default function CreatePermissionPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <RoleService initialView="create-permission" />
    </div>
  )
}
