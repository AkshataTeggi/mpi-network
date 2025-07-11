"use client"

import { Button } from "@/components/ui/button"
import { Department } from "./types"
import { DepartmentRoles } from "./department-roles"

interface DepartmentRolesViewProps {
  department: Department
  onBack: () => void
}

export function DepartmentRolesView({ department, onBack }: DepartmentRolesViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Roles for {department.name}</h1>
        <Button variant="outline" onClick={onBack}>
          Back to Departments
        </Button>
      </div>
      <DepartmentRoles department={department} />
    </div>
  )
}
