




"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, AlertCircle, Plus, Trash2, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { updateDepartment } from "./department-api"
import { updateDesignation, createDesignation, deleteDesignation } from "../designation/designation-api"
import type { Department } from "./types"
import { getAllPermissions } from "../permissions/permissions-api"

interface DepartmentEditFormProps {
  department: Department
  onSuccess?: () => void
  onCancel?: () => void
}

interface DesignationFormData {
  id?: string
  title: string
  isActive: boolean
  permissionIds: string[]
  isNew?: boolean
}

export function DepartmentEditForm({ department, onSuccess, onCancel }: DepartmentEditFormProps) {
  const [name, setName] = useState(department.name)
  const [description, setDescription] = useState(department.description || "")
  const [isActive, setIsActive] = useState(department.isActive)
  const [designations, setDesignations] = useState<DesignationFormData[]>([])
  const [permissionsList, setPermissionsList] = useState<{ id: string; name: string }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    getAllPermissions()
      .then(setPermissionsList)
      .catch((err) => {
        console.error("Error loading permissions:", err)
        setError("Failed to load permissions.")
      })
  }, [])

  useEffect(() => {
    if (permissionsList.length > 0 && department.designations.length > 0) {
      const mappedDesignations = department.designations.map((d) => {
        let permissionIds = []
        if (d.permissions) {
          permissionIds = d.permissions
            .map((p: { permission: { id: any }; permissionId: any; id: any }) => {
              if (typeof p === "string") return p
              if (p.permission?.id) return p.permission.id
              if (p.permissionId) return p.permissionId
              if (p.id) return p.id
              return null
            })
            .filter(Boolean)
        }
        return {
          id: d.id,
          title: d.title,
          isActive: d.isActive ?? true,
          permissionIds,
          isNew: false,
        }
      })
      setDesignations(mappedDesignations)
    }
  }, [permissionsList, department.designations])

  const addNewDesignation = () => {
    const newDesignation: DesignationFormData = {
      title: "",
      isActive: true,
      permissionIds: [],
      isNew: true,
    }
    setDesignations([...designations, newDesignation])
  }

  const removeDesignation = (index: number) => {
    const updated = [...designations]
    updated.splice(index, 1)
    setDesignations(updated)
  }

  const togglePermission = (designationIndex: number, permissionId: string) => {
    const updated = [...designations]
    const perms = updated[designationIndex].permissionIds
    updated[designationIndex].permissionIds = perms.includes(permissionId)
      ? perms.filter((id: string) => id !== permissionId)
      : [...perms, permissionId]
    setDesignations(updated)
  }

  const handleDesignationChange = (index: number, field: "title" | "isActive", value: string | boolean) => {
    const updated = [...designations]
    updated[index][field] = value
    setDesignations(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const newDesignations = designations.filter((d) => d.isNew)
      const hasEmptyTitles = newDesignations.some((d) => !d.title.trim())

      if (hasEmptyTitles) {
        setError("Please provide titles for all new designations.")
        setIsSubmitting(false)
        return
      }

      const validPermissionIds = permissionsList.map((p) => p.id)

      await updateDepartment(department.id, {
        name,
        description,
        isActive,
      })

      for (const designation of department.designations) {
        const updated = designations.find((d) => d.id === designation.id)
        if (!updated) {
          await deleteDesignation(designation.id)
        } else {
          const validatedPermissionIds = updated.permissionIds.filter((id: string) =>
            validPermissionIds.includes(id),
          )
          await updateDesignation(updated.id!, {
            title: updated.title,
            isActive: updated.isActive,
            permissionIds: validatedPermissionIds,
            departmentId: department.id,
          })
        }
      }

      for (const designation of newDesignations) {
        const validatedPermissionIds = designation.permissionIds.filter((id: string) =>
          validPermissionIds.includes(id),
        )
        await createDesignation({
          title: designation.title,
          isActive: designation.isActive,
          permissionIds: validatedPermissionIds,
          departmentId: department.id,
        })
      }

      setSuccess(true)
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500)
      }
    } catch (err) {
      console.error("Update failed:", err)
      setError("Failed to update department and designations. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
  <h1 className="text-2xl font-bold text-green-700">Edit Department</h1>
  <div className="self-end md:self-auto">
    <Button  onClick={onCancel}>
      <ArrowLeft className="mr-2 h-4 w-4"/>
      Back
    </Button>
  </div>
</div>


      <Card className="border shadow-sm">
        <CardContent className="mt-5">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 bg-green-50 border-green-500 text-green-700">
              <AlertDescription>Updated successfully!</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Department Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={isSubmitting} />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} disabled={isSubmitting} />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Designations</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addNewDesignation}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Plus className="h-4 w-4" />
                  Add Designation
                </Button>
              </div>

              <div className="space-y-6">
                {designations.map((des, index) => (
                  <div key={des.id || `new-${index}`} className="border p-4 rounded-md space-y-4 relative">
                    {des.isNew && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">New</span>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Designation Name</Label>
                        <Input
                          value={des.title}
                          onChange={(e) => handleDesignationChange(index, "title", e.target.value)}
                          disabled={isSubmitting}
                          placeholder="Enter designation title"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Permissions</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                          {permissionsList.map((perm) => (
                            <label key={perm.id} className="flex items-center gap-2 text-sm">
                              <Checkbox
                                checked={des.permissionIds.includes(perm.id)}
                                onCheckedChange={() => togglePermission(index, perm.id)}
                                disabled={isSubmitting}
                              />
                              {perm.name}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeDesignation(index)}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 text-green-600 hover:text-green-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting || success}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
