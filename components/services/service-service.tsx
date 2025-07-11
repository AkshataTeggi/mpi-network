"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"

import type { Service } from "./types"
import { ServiceAPI } from "./service-api"

import { ServiceCreateForm } from "./service-create-form"
import { ServiceEditForm } from "./service-edit-form"
import { ServiceDetail } from "./service-details"
import { ServiceList } from "./service-list"
import { ServiceListMobile } from "./service-list-mobile"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation";

type ViewType = "list" | "details" | "edit" | "create"

interface ServiceServiceProps {
  initialView?: ViewType
  serviceId?: string
}

export function ServiceService({ initialView = "list", serviceId }: ServiceServiceProps) {
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [currentView, setCurrentView] = useState<ViewType>(initialView)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const router = useRouter();


  useEffect(() => {
    loadAllServices()
  }, [])

  useEffect(() => {
    if (serviceId && (currentView === "details" || currentView === "edit")) {
      loadServiceById(serviceId)
    }
  }, [serviceId, currentView])

  const loadAllServices = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const servicesData = await ServiceAPI.getAll()
      setServices(servicesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load services")
    } finally {
      setIsLoading(false)
    }
  }

  const loadServiceById = async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const service = await ServiceAPI.getById(id)
      setSelectedService(service)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load service")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
      router.push("/dashboard/settings/services"); 
    setCurrentView("list")
    setSelectedService(null)
    setError(null)
    loadAllServices()
  }

  const ServiceLoading = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
      <Card>
        <div className="space-y-4 p-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between items-center p-4 border rounded">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  const ServiceError = ({ error, onRetry }: { error: Error; onRetry: () => void }) => (
    <div className="flex flex-col items-center justify-center h-48 bg-red-100 rounded-md p-4">
      <h2 className="text-red-600 font-semibold text-lg">Error</h2>
      <p className="text-red-500 text-sm">{error.message}</p>
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        Retry
      </button>
    </div>
  )

  if (isLoading && currentView === "list") return <ServiceLoading />
  if (error && currentView === "list") return <ServiceError error={new Error(error)} onRetry={loadAllServices} />

  switch (currentView) {
    case "details":
      if (!selectedService) return <ServiceLoading />
      return <ServiceDetail service={selectedService} onBack={handleBack} />

    case "edit":
      if (!selectedService) return <ServiceLoading />
      return <ServiceEditForm service={selectedService} onSuccess={handleBack} onCancel={handleBack} />

   case "create":
  return (
    <div className="space-y-6">
      {/* header row */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Create Service</h1>

        {/* Back button */}
        <Button
          size="sm"
                           
          onClick={handleBack}
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </Button>
      </div>

      {/* form */}
      <ServiceCreateForm
        onSuccess={handleBack}
        onCancel={handleBack}
        showCard
      />
    </div>
  );

    default: // "list" view
      return (
        <div className="space-y-6">
        <div className="flex items-center justify-between">
  <h1 className="text-3xl font-bold tracking-tight text-green-700">
    Services
  </h1>

  <div className="flex gap-2">
    {/* Back button */}
    <Button asChild size="sm" variant="outline">
      <Link href="/dashboard/settings" className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>
    </Button>

    {/* Create Service button */}
    <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 text-white">
      <Link href="/dashboard/settings/services/create" className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Create 
      </Link>
    </Button>
  </div>
</div>


          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            {isDesktop ? (
              <ServiceList services={services} onRefresh={loadAllServices} />
            ) : (
              <ServiceListMobile services={services} onRefresh={loadAllServices} />
            )}
          </div>
        </div>
      )
  }
}
