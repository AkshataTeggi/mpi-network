
"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ServiceAPI } from "../services/service-api"
import { Service } from "../services/types"

interface OrderDetailsTabProps {
  formData: {
    jobId: string
    assemblyId: string
    customer: string
  }
  orderFormData: {
    OrderType?: string[]
    distributionDate?: string
    requiredBy?: string
    internalOrderNumber?: string
    revision?: string
    otherAttachments?: string
    fileAction?: string[]
    markComplete?: boolean
    documentControlId?: string
    selectedServiceId?: string
  }
  enums: any
  loadingEnums: boolean
  checkingIds: boolean
  onFormDataChange: (field: string, value: string) => void
  onOrderFormChange: (field: string, value: any) => void
  validateJobId: (jobId: string) => string | null
  validateAssemblyId: (assemblyId: string) => string | null
  validateDocumentControlId: (documentControlId: string) => string | null
}

const formatDateForInput = (dateString: string | undefined | null) => {
  if (!dateString) return ""
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ""
    return date.toISOString().split("T")[0]
  } catch {
    return ""
  }
}

export function OrderDetailsTab({
  formData,
  orderFormData,
  enums,
  loadingEnums,
  checkingIds,
  onFormDataChange,
  onOrderFormChange,
  validateJobId,
  validateAssemblyId,
  validateDocumentControlId,
}: OrderDetailsTabProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loadingServices, setLoadingServices] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true)
        const fetchedServices = await ServiceAPI.getAll()
        setServices(fetchedServices)
      } catch (error) {
        toast({
          title: "Warning",
          description: "Failed to load services. Please try again.",
          variant: "destructive",
        })
        setServices([])
      } finally {
        setLoadingServices(false)
      }
    }

    fetchServices()
  }, [toast])

  useEffect(() => {
    if (orderFormData.selectedServiceId && services.length > 0) {
      const service = services.find((s) => s.id === orderFormData.selectedServiceId)
      setSelectedService(service || null)
    } else {
      setSelectedService(null)
    }
  }, [orderFormData.selectedServiceId, services])

  const handleServiceChange = (serviceId: string) => {
    if (serviceId === "none") {
      setSelectedService(null)
      onOrderFormChange("selectedServiceId", "")
    } else {
      const service = services.find((s) => s.id === serviceId)
      setSelectedService(service || null)
      onOrderFormChange("selectedServiceId", serviceId)
    }
  }

  return (
    <div className="space-y-6 mt-6">
      <Card>
        <CardContent className="mt-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Job ID */}
            <div className="space-y-2">
              <Label htmlFor="jobId">MPI ID *</Label>
              <div className="relative">
                <Input
                  id="jobId"
                  value={formData.jobId}
                  onChange={(e) => onFormDataChange("jobId", e.target.value)}
                  placeholder="Enter job ID (e.g., JOB-2025-0010)"
                  required
                  className={`h-11 ${
                    formData.jobId && validateJobId(formData.jobId)
                      ? "border-green-500"
                      : formData.jobId && !validateJobId(formData.jobId)
                        ? "border-green-500"
                        : ""
                  }`}
                />
                {checkingIds && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  </div>
                )}
              </div>
              {formData.jobId && validateJobId(formData.jobId) && (
                <p className="text-sm text-green-500">{validateJobId(formData.jobId)}</p>
              )}
            </div>

            {/* Assembly ID */}
            <div className="space-y-2">
              <Label htmlFor="assemblyId">Assembly ID *</Label>
              <div className="relative">
                <Input
                  id="assemblyId"
                  value={formData.assemblyId}
                  onChange={(e) => onFormDataChange("assemblyId", e.target.value)}
                  placeholder="Enter assembly ID (e.g., ASM-2025-1010)"
                  required
                  className={`h-11 ${
                    formData.assemblyId && validateAssemblyId(formData.assemblyId)
                      ? "border-green-500"
                      : formData.assemblyId && !validateAssemblyId(formData.assemblyId)
                        ? "border-green-500"
                        : ""
                  }`}
                />
                {checkingIds && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  </div>
                )}
              </div>
              {formData.assemblyId && validateAssemblyId(formData.assemblyId) && (
                <p className="text-sm text-green-500">{validateAssemblyId(formData.assemblyId)}</p>
              )}
            </div>

            {/* Customer */}
            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <Input
                id="customer"
                value={formData.customer}
                onChange={(e) => onFormDataChange("customer", e.target.value)}
                placeholder="Enter customer name (optional)"
                className="h-11"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Form Section */}
      <Card>
        <CardContent className="mt-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="internalOrderNumber">Internal Order Number</Label>
              <Input
                id="internalOrderNumber"
                value={orderFormData.internalOrderNumber || ""}
                onChange={(e) => onOrderFormChange("internalOrderNumber", e.target.value)}
                placeholder="Enter internal order number"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="revision">Revision</Label>
              <Input
                id="revision"
                value={orderFormData.revision || ""}
                onChange={(e) => onOrderFormChange("revision", e.target.value)}
                placeholder="Enter revision number"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentControlId">Document Control ID</Label>
              <Input
                id="documentControlId"
                value={orderFormData.documentControlId || ""}
                onChange={(e) => onOrderFormChange("documentControlId", e.target.value)}
                placeholder="Enter document control ID"
                className={`h-11 ${
                  orderFormData.documentControlId && validateDocumentControlId(orderFormData.documentControlId)
                    ? "border-green-500"
                    : orderFormData.documentControlId && !validateDocumentControlId(orderFormData.documentControlId)
                      ? "border-green-500"
                      : ""
                }`}
              />
              {orderFormData.documentControlId && validateDocumentControlId(orderFormData.documentControlId) && (
                <p className="text-sm text-green-500">{validateDocumentControlId(orderFormData.documentControlId)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="distributionDate">Distribution Date</Label>
              <Input
                id="distributionDate"
                type="date"
                value={formatDateForInput(orderFormData.distributionDate)}
                onChange={(e) => onOrderFormChange("distributionDate", e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requiredBy">Required By</Label>
              <Input
                id="requiredBy"
                type="date"
                value={formatDateForInput(orderFormData.requiredBy)}
                onChange={(e) => onOrderFormChange("requiredBy", e.target.value)}
                className="h-11"
              />
            </div>

            {/* Service Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="serviceSelect">Select Service</Label>
              <div className="relative">
                <Select
                  value={orderFormData.selectedServiceId || "none"}
                  onValueChange={handleServiceChange}
                  disabled={loadingServices}
                >
                  <SelectTrigger id="serviceSelect" className="h-11">
                    <SelectValue
                      placeholder={
                        loadingServices
                          ? "Loading services..."
                          : services.length === 0
                            ? "No services available"
                            : "Select a service"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No service</SelectItem>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{service.name}</span>
                          {service.description && (
                            <span className="text-xs text-gray-500 truncate max-w-[200px]">
                              {service.description}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {loadingServices && (
                  <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
