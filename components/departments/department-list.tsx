

"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import type { Department } from "./types"
import { ArrowLeft, Plus } from "lucide-react"

interface DepartmentListProps {
  departments: Department[]
  onViewRoles: (departmentId: string) => void
  onEdit: (departmentId: string) => void
  onDelete: (department: Department) => void
}

export function DepartmentList({
  departments,
  onViewRoles,
  onEdit,
  onDelete,
}: DepartmentListProps) {
  const router = useRouter()

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

  const handleCreate = () => {
    router.push("/dashboard/settings/departments/create")
  }

  return (
    <div className="space-y-6">
      {/* ✅ Always visible header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
  <h1 className="text-2xl font-bold text-green-600">Department Management</h1>
  <div className="flex gap-2">
    <Button
    
      onClick={() => router.push("/dashboard/settings")}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
    >
       <ArrowLeft className="w-4 h-4 " />
      Back
    </Button>
    <Button
      onClick={handleCreate}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
    >
      <Plus className="w-4 h-4" />
      Create
    </Button>
  </div>
</div>


      {/* ✅ Conditional table or empty state */}
      {departments.length === 0 ? (
        <div className="flex items-center justify-center h-32 bg-muted rounded-lg dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <p className="text-muted-foreground">No departments found</p>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Name</th>
                  <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Description</th>
                  <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Roles</th>
                  <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Designations</th>
                  <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Created At</th>
                  <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Status</th>
                  <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {departments.map((department) => (
                  <tr
                    key={department.id}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-4 align-middle font-medium">{department.name}</td>
                    <td className="p-4 align-middle">{department.description || "—"}</td>

                    <td className="p-4 align-middle">
                      {department.roles.length > 0
                        ? department.roles
                            .slice(0, 2)
                            .map((role) => role.name)
                            .join(", ") + (department.roles.length > 2 ? ", ..." : "")
                        : "—"}
                    </td>

                    <td className="p-4 align-middle">
                      {department.designations && department.designations.length > 0
                        ? department.designations
                            .slice(0, 2)
                            .map((d) => d.title)
                            .join(", ") + (department.designations.length > 2 ? ", ..." : "")
                        : "—"}
                    </td>

                    <td className="p-4 align-middle">{formatDate(department.createdAt)}</td>

                    <td className="p-4 align-middle">
                      {department.isActive ? (
                        <span className="text-green-600 dark:text-green-400">Active</span>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">Inactive</span>
                      )}
                    </td>

                    <td className="p-4 align-middle">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewRoles(department.id)}
                          className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(department.id)}
                          className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-300 text-green-600 hover:bg-green-50 hover:text-green-700 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20 dark:hover:text-green-300 bg-transparent"
                          onClick={() => onDelete(department)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
