"use client"

import type React from "react"
import Link from "next/link"
import { ArrowLeft, Edit, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Service } from "./types"

interface ServiceDetailProps {
  service: Service
  onBack: () => void
}

export const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, onBack }) => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green-700">Service Details</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/dashboard/settings/services/${service.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Service Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service ID */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Service ID</label>
              <p className="font-mono break-all text-xs">{service.id}</p>
            </div>

            {/* Service Name */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Service Name</label>
              <p>{service.name}</p>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p>{service.description || "No description provided"}</p>
            </div>
          </div>

          <Separator />

          {/* System Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Created At</p>
                <p className="text-muted-foreground">
                  {service.createdAt ? new Date(service.createdAt).toLocaleString() : "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Last Updated</p>
                <p className="text-muted-foreground">
                  {service.updatedAt ? new Date(service.updatedAt).toLocaleString() : "—"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
