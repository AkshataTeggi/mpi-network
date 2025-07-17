


"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Building } from "lucide-react"
import type { CreateDepartmentDto } from "./types"
import { createDepartment } from "./department-api"
import { createDesignation } from "../designation/designation-api"
import { getAllPermissions } from "../permissions/permissions-api"

interface DepartmentCreateFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  showCard?: boolean
}

export function DepartmentCreateForm({
  onSuccess,
  onCancel,
  showCard = true,
}: DepartmentCreateFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [designations, setDesignations] = useState<
    { title: string; permissionIds: string[] }[]
  >([])
  const [permissionsList, setPermissionsList] = useState<{ id: string; name: string }[]>([])
  const [showDesignationForm, setShowDesignationForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const data = await getAllPermissions()
        setPermissionsList(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Failed to load permissions", err)
      }
    }
    fetchPermissions()
  }, [])

  const resetForm = () => {
    setName("")
    setDescription("")
    setIsActive(true)
    setDesignations([])
    setShowDesignationForm(false)
    setError(null)
    setSuccess(false)
  }

  const handleDesignationChange = (
    index: number,
    key: "title" | "permissionIds",
    value: any
  ) => {
    const updated = [...designations]
    updated[index][key] = value
    setDesignations(updated)
  }

  const togglePermission = (designationIndex: number, permissionId: string) => {
    const updated = [...designations]
    const permissionIds = updated[designationIndex].permissionIds
    if (permissionIds.includes(permissionId)) {
      updated[designationIndex].permissionIds = permissionIds.filter((id) => id !== permissionId)
    } else {
      updated[designationIndex].permissionIds = [...permissionIds, permissionId]
    }
    setDesignations(updated)
  }

  const addDesignation = () => {
    setShowDesignationForm(true)
    setDesignations([...designations, { title: "", permissionIds: [] }])
  }

  const removeDesignation = (index: number) => {
    const updated = [...designations]
    updated.splice(index, 1)
    setDesignations(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSubmitting(true)

    try {
      const departmentData: CreateDepartmentDto = {
        name,
        description,
        isActive,
      }

      const createdDept = await createDepartment(departmentData)

      for (const designation of designations) {
        if (designation.title.trim()) {
          await createDesignation({
            title: designation.title,
            permissionIds: designation.permissionIds,
            departmentId: createdDept.id,
          })
        }
      }

      setSuccess(true)
      resetForm()

      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500)
      }
    } catch (err) {
      console.error("Error:", err)
      setError("Failed to create department and designations. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    resetForm()
    if (onCancel) onCancel()
  }

  const formContent = (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="mb-4 bg-green-50 border-green-500 text-green-700">
          <AlertDescription>
            Department & Designations created successfully!
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Department Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Department Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter department name"
              required
              disabled={isSubmitting || success}
            />
          </div>
          <div className="flex items-center space-x-2 pt-6">
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
              disabled={isSubmitting || success}
            />
            <Label htmlFor="isActive">Active Department</Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter department description"
            disabled={isSubmitting || success}
            rows={3}
          />
        </div>

        {/* Designation Fields */}
        {showDesignationForm && (
          <div className="space-y-4">
            {designations.map((designation, index) => (
              <div
                key={index}
                className="border border-slate-200 p-4 rounded-md space-y-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Designation Name</Label>
                    <Input
                      placeholder="e.g. Manager"
                      value={designation.title}
                      onChange={(e) =>
                        handleDesignationChange(index, "title", e.target.value)
                      }
                      disabled={isSubmitting || success}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Permissions</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {permissionsList.map((permission) => (
                        <label key={permission.id} className="flex items-center gap-2">
                          <Checkbox
                            checked={designation.permissionIds.includes(permission.id)}
                            onCheckedChange={() => togglePermission(index, permission.id)}
                            disabled={isSubmitting || success}
                          />
                          {permission.name}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                {index > 0 && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeDesignation(index)}
                      disabled={isSubmitting || success}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Submit/Cancel */}
        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting || success}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create "
            )}
          </Button>
        </div>
      </form>
    </>
  )

  if (showCard) {
    return (
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Department Information
          </CardTitle>
          <Button
            type="button"
            onClick={addDesignation}
            disabled={isSubmitting || success}
          >
            + Add Designation
          </Button>
        </CardHeader>
        <CardContent>{formContent}</CardContent>
      </Card>
    )
  }

  return <div className="space-y-4">{formContent}</div>
}
