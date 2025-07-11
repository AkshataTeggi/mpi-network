// app/dashboard/settings/departments/[id]/page.tsx

import { DepartmentService } from "@/components/departments/department-service"

interface DepartmentDetailPageProps {
  params: { id: string }
}

export default function DepartmentDetailPage({ params }: DepartmentDetailPageProps) {
  return <DepartmentService initialView="details" departmentId={params.id} />
}
