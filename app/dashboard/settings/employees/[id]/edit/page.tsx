"use client"

import { use } from "react"
import { EmployeeService } from "@/components/employees/employee-service"
import { useRouter } from "next/navigation"

export default function EmployeeEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)

  return (
    <div className=" space-y-8">
      {/* Employee Service Component Only */}
      <EmployeeService initialView="edit" employeeId={id} />
    </div>
  )
}
