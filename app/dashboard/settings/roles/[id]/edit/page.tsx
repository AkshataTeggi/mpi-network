// app/dashboard/settings/roles/[id]/edit/page.tsx

import { getRoleById } from "@/components/roles/role-api";
import { RoleEditForm } from "@/components/roles/role-edit"; // or wherever your edit form lives

interface PageProps {
  params: { id: string };
}

export default async function RoleEditPage({ params }: PageProps) {
  const role = await getRoleById(params.id);
  return <RoleEditForm role={role} />;
}
