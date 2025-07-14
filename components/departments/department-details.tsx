

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import type { Department } from "./types"

interface DepartmentDetailProps {
  department: Department
  onBack: () => void
  onEdit: () => void
  onDelete: () => void // ✅ Added delete handler prop
}

export function DepartmentDetail({ department, onBack, onEdit, onDelete }: DepartmentDetailProps) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const getStatus = (status: boolean) => (status ? "Active" : "Inactive")

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-green-700">Department Details</h1>
        <div className="flex gap-2 self-end md:self-auto">
          <Button onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button onClick={onEdit} className="gap-2">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
           
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Department Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Department Info</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground">Department ID</label>
            <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">{department.id}</div>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground">Name</label>
            <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">{department.name}</div>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground">Description</label>
            <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">{department.description || "—"}</div>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground">Status</label>
            <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">{getStatus(department.isActive)}</div>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground">Created At</label>
            <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">
              {formatDate(department.createdAt)}
            </div>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground">Updated At</label>
            <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">
              {formatDate(department.updatedAt)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Designation Table Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Designations</CardTitle>
        </CardHeader>
        <CardContent>
          {department.designations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-300 rounded">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-2 border-b">Name</th>
                    <th className="text-left p-2 border-b">Permissions</th>
                  </tr>
                </thead>
                <tbody>
                  {department.designations.map((designation) => (
                    <tr key={designation.id} className="border-b">
                      <td className="p-2">{designation.title}</td>
                      <td className="p-2">
                        {designation.permissions?.length > 0
                          ? designation.permissions
                              .map((perm: { permission: { name: any } }) => perm.permission?.name || "—")
                              .join(", ")
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No designations available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
