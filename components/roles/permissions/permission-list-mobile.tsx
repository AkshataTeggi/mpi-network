"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { useToast } from "@/hooks/use-toast"
import { deletePermission } from "../role-api"
import type { Permission } from "../types"

interface PermissionListMobileProps {
  permissions: Permission[]
  onRefresh: () => void
}

export function PermissionListMobile({ permissions, onRefresh }: PermissionListMobileProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await deletePermission(id)
      toast({
        title: "Success",
        description: "Permission deleted successfully",
      })
      onRefresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete permission",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (permissions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground text-lg mb-4">No permissions found</p>
          <Button asChild>
            <Link href="/dashboard/permissions/create">
              <Plus className="h-4 w-4 mr-2" />
              Create your first permission
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {permissions.length} permission{permissions.length !== 1 ? "s" : ""} found
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/permissions/create">
            <Plus className="h-4 w-4 mr-2" />
            Create
          </Link>
        </Button>
      </div>

      {permissions.map((permission) => (
        <Card key={permission.id}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{permission.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{permission.description || "No description"}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2 mt-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/permissions/${permission.id}/edit`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={deletingId === permission.id}
                    className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Permission</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{permission.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(permission.id)}
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
