"use client"

import { useParams } from "next/navigation"
import { EmployeeService } from "@/components/employees/employee-service"

export default function EmployeeViewPage() {
  const params = useParams()

  if (!params?.id || typeof params.id !== "string") return null

  return <EmployeeService initialView="details" employeeId={params.id} />
}
