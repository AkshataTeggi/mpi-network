"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "../ui/use-toast"
import { deleteRole } from "./role-api"
import type { Role } from "./types"

interface RoleListMobileProps {
  roles: Role[]
  onRefresh: () => void
}

export function RoleListMobile({ roles, onRefresh }: RoleListMobileProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await deleteRole(id)
      toast({
        title: "Success",
        description: "Role deleted successfully",
      })
      onRefresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (roles.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground text-lg mb-4">No roles found</p>
          <Button asChild>
            <Link href="/dashboard/roles/create">Create your first role</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {roles.length} role{roles.length !== 1 ? "s" : ""} found
      </div>
      {roles.map((role) => (
        <Card key={role.id}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{role.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{role.description || "-"}</p>
              </div>
              <Badge variant={role.isActive ? "default" : "secondary"} className="text-white">
                {role.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Department</p>
                <p>{role.departmentName || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created At</p>
                <p>{role.createdAt ? new Date(role.createdAt).toLocaleDateString() : "-"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created By</p>
                <p>{role.createdBy || "-"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">Permissions</p>
                <p>
                
  {role.permissions?.length
    ? role.permissions.map((perm) => perm.name).join(", ")
    : "N/A"}


                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/roles/${role.id}`}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/roles/${role.id}/edit`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" disabled={deletingId === role.id}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Role</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{role.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(role.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
