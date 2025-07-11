"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Role } from "./types"

// Update the CreateRoleDto interface to include createdBy
interface CreateRoleDto {
  name: string
  description: string
  isActive: boolean
  departmentId: string
  createdBy?: string | null
}

// Update the UpdateRoleDto interface to include createdBy
interface UpdateRoleDto {
  name?: string
  description?: string
  isActive?: boolean
  createdBy?: string | null
}

interface RoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (role: CreateRoleDto | UpdateRoleDto) => void
  title: string
  departmentId: string
  role?: Role | null
}

export function RoleDialog({ open, onOpenChange, onSubmit, title, departmentId, role }: RoleDialogProps) {
  // Add a state for createdBy in the component
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [createdBy, setCreatedBy] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update the useEffect to handle createdBy
  useEffect(() => {
    if (role) {
      setName(role.name)
      setDescription(role.description)
      setIsActive(role.isActive)
      setCreatedBy(role.createdBy)
    } else {
      setName("")
      setDescription("")
      setIsActive(true)
      setCreatedBy(null)
    }
  }, [role, open])

  // Update the handleSubmit function to include createdBy
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (role) {
        await onSubmit({
          name,
          description,
          isActive,
          createdBy,
        })
      } else {
        await onSubmit({
          name,
          description,
          isActive,
          departmentId,
          createdBy,
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {role ? "Edit role details below." : "Create a new role by filling out the form below."}
            </DialogDescription>
          </DialogHeader>
          {/* Add the createdBy field to the form */}
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Role name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Role description"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="createdBy">Created By (optional)</Label>
              <Input
                id="createdBy"
                value={createdBy || ""}
                onChange={(e) => setCreatedBy(e.target.value || null)}
                placeholder="User who created this role"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
