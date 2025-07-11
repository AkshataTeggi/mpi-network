"use client"

import { Button } from "@/components/ui/button"
import { Mail, UserCog, Calendar, User, AtSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { Employee } from "./types"

interface EmployeeListMobileProps {
  employees: Employee[]
  onView: (employeeId: string) => void
  onEdit: (employeeId: string) => void
  onDelete: (employee: Employee) => void
}

export function EmployeeListMobile({ employees, onView, onEdit, onDelete }: EmployeeListMobileProps) {
  const router = useRouter()

  if (employees.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 bg-muted rounded-lg dark:bg-slate-800">
        <p className="text-muted-foreground">No employees found</p>
      </div>
    )
  }

  const handleViewClick = (employeeId: string) => {
    router.push(`/dashboard/settings/employees/${employeeId}`)
  }

  const handleEditClick = (employeeId: string) => {
    router.push(`/dashboard/settings/employees/${employeeId}/edit`)
  }

  return (
    <div className="space-y-4">
      {employees.map((employee) => (
        <div
          key={employee.id}
          className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">
                {employee.firstName} {employee.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">{employee.email}</p>
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                employee.isActive
                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
              }`}
            >
              {employee.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="mr-2 h-4 w-4" />
              <span>{employee.email}</span>
            </div>
            {employee.user?.username && (
              <div className="flex items-center text-sm text-muted-foreground">
                <AtSign className="mr-2 h-4 w-4" />
                <span>{employee.user.username}</span>
              </div>
            )}
            <div className="flex items-center text-sm text-muted-foreground">
              <UserCog className="mr-2 h-4 w-4" />
              <span>{employee.role?.name || "No Role"}</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <Calendar className="mr-1 h-3 w-3" />
              <span>Created: {new Date(employee.createdAt).toLocaleString()}</span>
            </div>
            {employee.createdBy && (
              <div className="flex items-center text-xs text-muted-foreground">
                <User className="mr-1 h-3 w-3" />
                <span>Created by: {employee.createdBy}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewClick(employee.id)}
              className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditClick(employee.id)}
              className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-green-300 text-green-600 hover:bg-green-50 hover:text-green-700 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20 dark:hover:text-green-300 bg-transparent"
              onClick={() => onDelete(employee)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
