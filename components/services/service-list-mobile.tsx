"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { ServiceAPI } from "./service-api" // Corrected import
import { useToast } from "@/hooks/use-toast"
import type { Service } from "./types"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "@/components/ui/button";  

interface ServiceListMobileProps {
  services: Service[]
  onRefresh: () => void
}

export function ServiceListMobile({ services, onRefresh }: ServiceListMobileProps) {
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
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground text-lg mb-4">No services found</p>
          <Button asChild>
            <Link href="/dashboard/settings/services/create">
              <Plus className="h-4 w-4 mr-2" />
              Create your first service
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
          {services.length} service{services.length !== 1 ? "s" : ""} found
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/settings/services/create">
            <Plus className="h-4 w-4 mr-2" />
            Create
          </Link>
        </Button>
      </div>

      {services.map((service) => (
        <Card key={service.id}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{service.description || "No description"}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Created At</p>
                <p>{service.createdAt ? new Date(service.createdAt).toLocaleDateString() : "-"}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              <Button variant="outline" size="sm" asChild>
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
                    disabled={deletingId === service.id}
                    className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
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
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
