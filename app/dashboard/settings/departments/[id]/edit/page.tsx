"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DepartmentService } from "@/components/departments/department-service"

export default function DepartmentEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const { id } = use(params) // ✅ unwrap the promise

  return (
    <div>
   
      

      {/* Main content */}
      <DepartmentService initialView="edit" departmentId={id} />
    </div>
  )
}
