"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Department } from "./types"

interface DepartmentListMobileProps {
  departments: Department[]
  onViewRoles: (departmentId: string) => void
  onEdit: (departmentId: string) => void
  onDelete: (department: Department) => void
}

export function DepartmentListMobile({ departments, onViewRoles, onEdit, onDelete }: DepartmentListMobileProps) {
  const router = useRouter()

  if (departments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No departments found. Create your first department!</p>
      </div>
    )
  }

  const handleViewClick = (departmentId: string) => {
    router.push(`/dashboard/departments/${departmentId}`)
  }

  const handleEditClick = (departmentId: string) => {
    router.push(`/dashboard/departments/${departmentId}/edit`)
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      {departments.map((department) => (
        <div
          key={department.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900">{department.name}</h3>
            <Badge className={getStatusColor(department.isActive)}>{department.isActive ? "Active" : "Inactive"}</Badge>
          </div>

          <p className="text-sm text-gray-600 mb-3">{department.description}</p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="mr-1 h-3 w-3" />
              <span>Created: {formatDate(department.createdAt)}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <RefreshCw className="mr-1 h-3 w-3" />
              <span>Updated: {formatDate(department.updatedAt)}</span>
            </div>
            <div className="flex items-center text-xs">
              <Users className="mr-1 h-3 w-3" />
              <span>
                {department.roles.length} Role{department.roles.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => handleViewClick(department.id)}>
              View
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleEditClick(department.id)}>
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-green-600 hover:text-green-700 hover:bg-green-50 bg-transparent"
              onClick={() => onDelete(department)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
