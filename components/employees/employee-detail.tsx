



"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import { Employee } from "./types"

interface EmployeeDetailProps {
  employee: Employee
  onBack: () => void
  onEdit: () => void
   onDelete: () => void
}

export function EmployeeDetail({ employee, onBack, onEdit, onDelete }: EmployeeDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-green-600">Employee Details</h1>
        <div className="flex space-x-2">
          <Button  onClick={onBack}>
            <ArrowLeft className="mr-1 h-4 w-4"/>
            Back 
          </Button>
          <Button onClick={onEdit}>
            <Edit className="mr-1 h-4 w-4" /> Edit 
          </Button>
            <Button  onClick={onDelete}>
            <Trash2 className="mr-1 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="mt-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <Field label="Employee ID" value={employee.id} />
            <Field label="First Name" value={employee.firstName} />
            <Field label="Last Name" value={employee.lastName} />
             {employee.user && (
          
              <Field label="Username" value={employee.user.username} />
            
          )}
            <Field label="Email" value={employee.email} />
            <Field label="Phone" value={employee.phone} />
            <Field label="Status" value={employee.isActive ? "Active" : "Inactive"} />
          </div>

          <Separator className="dark:bg-slate-700" />

          {employee.role && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              <Field label="Role Name" value={employee.role.name} />
              <Field label="Role Description" value={employee.role.description ?? "-"} />
            </div>
          )}

          <Separator className="dark:bg-slate-700" />

          {employee.designation ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              <Field label="Designation" value={employee.designation.title} />
              <Field
                label="Designation Active"
                value={employee.designation.isActive ? "Yes" : "No"}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              <Field label="Designation" value="Not assigned" />
            </div>
          )}

         

         
        </CardContent>
      </Card>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="space-y-1">
      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</Label>
      <div className="text-sm bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 rounded-md px-3 py-2 min-h-[40px] break-words font-normal">
        {value ?? "-"}
      </div>
    </div>
  )
}
