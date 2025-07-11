"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, Trash2, Plus } from "lucide-react"
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
import { ServiceAPI } from "./service-api" // Corrected import
import type { Service } from "./types"

interface ServiceListProps {
  services?: Service[]
  onRefresh: () => void
}

export function ServiceList({ services = [], onRefresh }: ServiceListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await ServiceAPI.remove(id) // Corrected call
      toast({
        title: "Success",
        description: "Service deleted successfully",
      })
      onRefresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (services.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 bg-muted rounded-lg dark:bg-slate-800">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No services found</p>
          <Button asChild>
            <Link href="/dashboard/settings/services/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Service
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
    

      <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full w-full caption-bottom text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Name</th>
                <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Description</th>
                <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Created At</th>
                <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {services.map((service) => (
                <tr
                  key={service.id}
                  className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="p-4 font-medium">{service.name}</td>
                  <td className="p-4">{service.description || "-"}</td>
                  <td className="p-4">{service.createdAt ? new Date(service.createdAt).toLocaleDateString() : "—"}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 bg-transparent"
                      >
                        <Link href={`/dashboard/settings/services/${service.id}/edit`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 bg-transparent"
                            disabled={deletingId === service.id}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Service</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{service.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(service.id)}
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
    </div>
  )
}
