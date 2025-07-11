"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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
import { deleteRole } from "./role-api"
import type { Role } from "./types"

interface RoleListProps {
  roles?: Role[]
  onRefresh: () => void
}

export function RoleList({ roles = [], onRefresh }: RoleListProps) {
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
      <div className="flex items-center justify-center h-32 bg-muted rounded-lg dark:bg-slate-800">
        <p className="text-muted-foreground">No roles found</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="">
        <table className=" w-full caption-bottom text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Name</th>
              <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Department</th>
              <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Description</th>
              <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Permissions</th>
              <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Status</th>
              <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Created At</th>
              <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {roles.map((role) => (
              <tr
                key={role.id}
                className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="p-4 font-medium">{role.name}</td>
                <td className="p-4">{role.departmentName || "-"}</td>
                <td className="p-4">{role.description || "-"}</td>
              <td className="p-4">
  {role.permissions?.length
    ? role.permissions.map((perm) => perm.name).join(", ")
    : "N/A"}
</td>


                <td className="p-4">{role.isActive ? "Active" : "Inactive"}</td>
                <td className="p-4">{role.createdAt ? new Date(role.createdAt).toLocaleDateString() : "—"}</td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 bg-transparent"
                    >
                      <Link href={`/dashboard/settings/roles/${role.id}`}>View</Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 bg-transparent"
                    >
                      <Link href={`/dashboard/settings/roles/${role.id}/edit`}>Edit</Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-300 text-green-600 hover:bg-green-50 hover:text-green-700 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20 dark:hover:text-green-300 bg-transparent"
                          disabled={deletingId === role.id}
                        >
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
