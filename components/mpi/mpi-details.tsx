

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Factory,
  Edit,
  ArrowLeft,
  Trash2,
  ClipboardList,
  CheckCircle,
  XCircle,
  Info,
  FileText,
  Eye,
  Download,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { MPI } from "./types"
import { Label } from "@/components/ui/label"
import { StationAPI } from "../stations/station-api"
import type { Station } from "../stations/types"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { ScrollText } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

interface MPIDetailsProps {
  mpi: MPI
  onEdit: () => void
  onBack: () => void
  onDelete: () => void
}

export function MPIDetails({ mpi, onEdit, onBack, onDelete }: MPIDetailsProps) {
  const [availableStations, setAvailableStations] = useState<Station[]>([])
  const [loadingStations, setLoadingStations] = useState(false)
  const { toast } = useToast()
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null)
  const [enums, setEnums] = useState<{ orderTypes: string[]; fileActions: string[] }>({
    orderTypes: [],
    fileActions: [],
  })
  const [loadingEnums, setLoadingEnums] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadStations()
    loadEnums()
  }, [])

  useEffect(() => {
    // Auto-select first station if available
    if (mpi.stations && mpi.stations.length > 0 && !selectedStationId) {
      setSelectedStationId(mpi.stations[0].id)
    }
  }, [mpi.stations, selectedStationId])

  const loadStations = async () => {
    try {
      setLoadingStations(true)
      const stations = await StationAPI.getAllStations()
      setAvailableStations(stations)
    } catch (error) {
      console.error("Failed to load stations:", error)
      toast({
        title: "Error",
        description: "Failed to load stations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingStations(false)
    }
  }

  const loadEnums = async () => {
    try {
      setLoadingEnums(true)
      const response = await fetch("http://35.166.254.199:5000/mpi/enums")
      if (!response.ok) {
        throw new Error("Failed to fetch enums")
      }
      const data = await response.json()
      setEnums(data)
    } catch (error) {
      console.error("Failed to load enums:", error)
      toast({
        title: "Error",
        description: "Failed to load order types and file actions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingEnums(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDateOnly = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatOrderType = (orderType: any) => {
    if (!orderType) return "N/A"
    if (Array.isArray(orderType)) {
      return orderType.map((type) => String(type).replace(/_/g, " ")).join(", ")
    }
    if (typeof orderType === "string") {
      return orderType.replace(/_/g, " ")
    }
    return String(orderType).replace(/_/g, " ")
  }

  const formatFileAction = (fileAction: any) => {
    if (!fileAction) return null
    if (Array.isArray(fileAction)) {
      return fileAction.map((action) => String(action).replace(/_/g, " ")).join(", ")
    }
    if (typeof fileAction === "string") {
      return fileAction.replace(/_/g, " ")
    }
    return String(fileAction).replace(/_/g, " ")
  }

  const handleDelete = () => {
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    onDelete()
    setShowDeleteDialog(false)
    router.push("/dashboard/mpi")
  }

  // Calculate counts
  const stationsCount = mpi.stations?.length || 0
  const checklistsCount =
    mpi.checklists?.reduce((total, checklist) => {
      const requiredItems = checklist.checklistItems?.filter((item) => item.required === true) || []
      return total + requiredItems.length
    }, 0) || 0

  const orderForm = mpi.orderForms && mpi.orderForms.length > 0 ? mpi.orderForms[0] : null
  const stationMpiDocsCount = mpi.stationMpiDocuments?.length || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-lg font-semibold text-green-600">
              Job ID: {mpi.jobId} • Assembly ID: {mpi.assemblyId}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={onEdit} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 bg-transparent"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Order Details Section */}
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Info className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-blue-800">Order Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1">
                <Label className="text-base font-semibold">Job ID</Label>
                <p className="text-sm text-gray-900">{mpi.jobId || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-base font-semibold">Assembly ID</Label>
                <p className="text-sm text-gray-900">{mpi.assemblyId || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-base font-semibold">Customer</Label>
                <p className="text-sm text-gray-900">{mpi.customer || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-base font-semibold">Internal Order Number</Label>
                <p className="text-sm text-gray-900">{orderForm?.internalOrderNumber || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-base font-semibold">Revision</Label>
                <p className="text-sm text-gray-900">{orderForm?.revision || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-base font-semibold">Document Control ID</Label>
                <p className="text-sm text-gray-900">{orderForm?.documentControlId || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-base font-semibold">Distribution Date</Label>
                <p className="text-sm text-gray-900">
                  {orderForm?.distributionDate ? formatDateOnly(orderForm.distributionDate) : "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-base font-semibold">Required By</Label>
                <p className="text-sm text-gray-900">
                  {orderForm?.requiredBy ? formatDateOnly(orderForm.requiredBy) : "N/A"}
                </p>
              </div>
            </div>
            {/* Services Section */}
            <div className="mt-6 space-y-2">
              <Label className="text-base font-semibold">Services</Label>
              <div>
                {orderForm?.services && orderForm.services.length > 0 ? (
                  <div className="space-y-1">
                    {orderForm.services.map((service) => (
                      <div key={service.id}>
                        <p className="text-sm text-gray-900 font-medium">{service.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No services assigned</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentation Section */}
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-green-800">Files</h2>
            </div>
            {/* MPI Documents Section */}
            <div className="mb-8">
              {mpi.mpiDocs && mpi.mpiDocs.length > 0 ? (
                <div className="space-y-4">
                  {mpi.mpiDocs.map((doc, index) => (
                    <div key={doc.id || index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <FileText className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-base text-gray-900 truncate">
                              {doc.originalFileName || doc.fileName}
                            </h4>
                            {doc.description && <p className="text-sm text-gray-600 truncate">{doc.description}</p>}
                            <div className="mt-1 space-y-1">
                              {(doc.originalFileName || doc.fileName) && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Filename:</span> {doc.originalFileName || doc.fileName}
                                </p>
                              )}
                              {doc.createdAt && (
                                <p className="text-xs text-gray-500">
                                  Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {doc.fileUrl && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={async () => {
                                  try {
                                    const response = await fetch(
                                      `http://35.166.254.199:5000/mpi-document/${doc.id}/download`,
                                    )
                                    if (!response.ok) {
                                      throw new Error("Download failed")
                                    }
                                    const contentDisposition = response.headers.get("content-disposition")
                                    let filename =
                                      doc.fileName || doc.originalFileName || doc.description || "mpi-document"
                                    if (contentDisposition) {
                                      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
                                      if (filenameMatch) {
                                        filename = filenameMatch[1]
                                      }
                                    }
                                    const blob = await response.blob()
                                    const url = window.URL.createObjectURL(blob)
                                    const a = document.createElement("a")
                                    a.href = url
                                    a.download = filename
                                    document.body.appendChild(a)
                                    a.click()
                                    window.URL.revokeObjectURL(url)
                                    document.body.removeChild(a)
                                    toast({
                                      title: "Success",
                                      description: "Document downloaded successfully.",
                                    })
                                  } catch (error) {
                                    console.error("Download failed:", error)
                                    toast({
                                      title: "Error",
                                      description: "Failed to download document. Please try again.",
                                      variant: "destructive",
                                    })
                                  }
                                }}
                                className="h-8 px-3"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  if (doc?.fileUrl) {
                                    const url = doc.fileUrl.startsWith("http")
                                      ? doc.fileUrl
                                      : `http://54.177.111.218:4000${doc.fileUrl}`
                                    window.open(url, "_blank")
                                  } else {
                                    toast({
                                      title: "File not found",
                                      description: "No file URL available for this document.",
                                      variant: "destructive",
                                    })
                                  }
                                }}
                                className="h-8 px-3"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600">No files have been uploaded yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions and Stations Section */}
        <Card className="border shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <ScrollText className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-semibold text-red-600">MPI Instructions</h2>
            </div>
            {/* Stations Section */}
            {loadingStations ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading stations...</p>
                </div>
              </div>
            ) : mpi.stations && mpi.stations.length > 0 ? (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Factory className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-purple-800">Assembly Stations</h3>
                  <Badge variant="secondary">{stationsCount}</Badge>
                </div>
                <div className="flex gap-6 min-h-[600px]">
                  {/* Left Sidebar - Station List */}
                  <div className="w-1/4 border rounded-lg bg-gray-50">
                    <div className="p-2 overflow-y-auto h-[530px]">
                      <div className="space-y-1">
                        {mpi.stations.map((station) => {
                          const specsWithValues =
                            station.specifications?.filter(
                              (spec) =>
                                spec.stationSpecifications &&
                                spec.stationSpecifications.length > 0 &&
                                spec.stationSpecifications.some(
                                  (ss: any) => ss.value && ss.value.toString().trim() !== "",
                                ),
                            ).length || 0
                          const regularDocsCount = station.documentations?.length || 0
                          const mpiDocsCount =
                            mpi.stationMpiDocuments?.filter(
                              (doc: { stationId: string }) => doc.stationId === station.id,
                            ).length || 0
                          const totalDocsCount = regularDocsCount + mpiDocsCount

                          return (
                            <div
                              key={station.id}
                              className={`p-2 rounded text-sm cursor-pointer transition-all ${
                                selectedStationId === station.id
                                  ? "bg-blue-100 text-blue-900 font-medium border border-blue-200"
                                  : "bg-white hover:bg-gray-100"
                              }`}
                              onClick={() => setSelectedStationId(station.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{station.stationName}</div>
                                  <div className="text-xs text-gray-500">{station.stationId}</div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  {/* Right Panel - Selected Station Details */}
                  <div className="flex-1 border rounded-lg bg-white">
                    {!selectedStationId ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Factory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h4 className="font-medium text-gray-600 mb-2">Select a Station</h4>
                          <p className="text-sm text-muted-foreground">
                            Click on a station from the left to view its specifications and documents
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col">
                        {(() => {
                          const selectedStation = mpi.stations?.find((s) => s.id === selectedStationId)
                          if (!selectedStation) {
                            return (
                              <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                  <Factory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                  <h4 className="font-medium text-gray-600 mb-2">Station Not Found</h4>
                                  <p className="text-sm text-muted-foreground">
                                    The selected station could not be loaded
                                  </p>
                                </div>
                              </div>
                            )
                          }

                          const specificationsWithValues =
                            selectedStation.specifications?.filter((spec) => {
                              return (
                                spec.stationSpecifications &&
                                spec.stationSpecifications.length > 0 &&
                                spec.stationSpecifications.some(
                                  (ss: any) => ss.value && ss.value.toString().trim() !== "",
                                )
                              )
                            }) || []

                          const regularStationDocuments = selectedStation.documentations || []
                          const stationMpiDocuments =
                            mpi.stationMpiDocuments?.filter(
                              (doc: { stationId: string }) => doc.stationId === selectedStation.id,
                            ) || []

                          return (
                            <>
                              <div className="p-4 border-b">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-medium text-lg">{selectedStation.stationName}</h4>
                                    <p className="text-sm text-gray-500">{selectedStation.stationId}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-1 overflow-y-auto p-4">
                                {/* Station Specifications */}
                                {specificationsWithValues.length > 0 && (
                                  <div className="mb-6">
                                    <h5 className="font-medium text-base mb-3 text-purple-800">Specifications</h5>
                                    <Table className="w-full border-collapse">
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead className="px-4 py-2">Specification Name</TableHead>
                                          <TableHead className="px-4 py-2">Value</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {specificationsWithValues.map((spec) => (
                                          <TableRow key={spec.id} className="border-t">
                                            <TableCell className="px-4 py-2 font-medium">
                                              {spec.name || "N/A"}
                                            </TableCell>
                                            <TableCell className="px-4 py-2">
                                              <div className="space-y-1">
                                                {spec.stationSpecifications?.map((stationSpec: any, idx: number) => {
                                                  if (
                                                    !stationSpec.value ||
                                                    stationSpec.value.toString().trim() === ""
                                                  ) {
                                                    return null
                                                  }
                                                  return (
                                                    <div key={idx} className="flex items-center gap-2">
                                                      <span className="text-sm font-medium">
                                                        {stationSpec.value === "true"
                                                          ? "✓ Yes"
                                                          : stationSpec.value === "false"
                                                            ? "✗ No"
                                                            : stationSpec.value}
                                                      </span>
                                                      {stationSpec.unit && (
                                                        <span className="text-xs text-gray-600 bg-gray-100 px-1 rounded">
                                                          {stationSpec.unit}
                                                        </span>
                                                      )}
                                                    </div>
                                                  )
                                                })}
                                              </div>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                )}

                                {/* Station Documents */}
                                <div className="mb-6">
                                  <h5 className="font-medium text-base mb-3 text-green-800">Station Documents</h5>
                                  {regularStationDocuments.length > 0 || stationMpiDocuments.length > 0 ? (
                                    <div className="space-y-3">
                                      {/* Regular Station Documents */}
                                      {regularStationDocuments.map((doc, index) => (
                                        <div
                                          key={`regular-${doc.id || index}`}
                                          className="p-3 bg-green-50 border border-green-200 rounded-lg"
                                        >
                                          <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3 flex-1">
                                              <FileText className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                              <div className="flex-1 min-w-0">
                                                <h6 className="font-medium text-sm text-gray-900 truncate">
                                                  {doc.originalName ||
                                                    doc.fileName ||
                                                    doc.description ||
                                                    "Unknown Document"}
                                                </h6>
                                                {doc.description &&
                                                  doc.description !== (doc.originalName || doc.fileName) && (
                                                    <p className="text-xs text-gray-600 mt-1">{doc.description}</p>
                                                  )}
                                                <div className="flex items-center gap-2 mt-1">
                                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                    Station Document
                                                  </span>
                                                  <span className="text-xs text-gray-500">
                                                    Uploaded:{" "}
                                                    {doc.createdAt
                                                      ? new Date(doc.createdAt).toLocaleDateString()
                                                      : "Unknown date"}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                              {doc.fileUrl && (
                                                <>
                                                  <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={async () => {
                                                      try {
                                                        const url = doc.fileUrl.startsWith("http")
                                                          ? doc.fileUrl
                                                          : `http://54.177.111.218:4000/${doc.fileUrl}`
                                                        const response = await fetch(url)
                                                        if (!response.ok) {
                                                          throw new Error("Download failed")
                                                        }
                                                        const blob = await response.blob()
                                                        const downloadUrl = window.URL.createObjectURL(blob)
                                                        const a = document.createElement("a")
                                                        a.href = downloadUrl
                                                        a.download =
                                                          doc.originalName ||
                                                          doc.fileName ||
                                                          doc.description ||
                                                          "station-document"
                                                        document.body.appendChild(a)
                                                        a.click()
                                                        window.URL.revokeObjectURL(downloadUrl)
                                                        document.body.removeChild(a)
                                                        toast({
                                                          title: "Success",
                                                          description: "Document downloaded successfully.",
                                                        })
                                                      } catch (error) {
                                                        console.error("Download failed:", error)
                                                        toast({
                                                          title: "Error",
                                                          description: "Failed to download document. Please try again.",
                                                          variant: "destructive",
                                                        })
                                                      }
                                                    }}
                                                    className="h-7 px-2 text-xs"
                                                  >
                                                    <Download className="w-3 h-3 mr-1" />
                                                    Download
                                                  </Button>
                                                  <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                      if (doc.fileUrl) {
                                                        const url = doc.fileUrl.startsWith("http")
                                                          ? doc.fileUrl
                                                          : `http://54.177.111.218:4000/${doc.fileUrl}`
                                                        window.open(url, "_blank")
                                                      }
                                                    }}
                                                    className="h-7 px-2 text-xs"
                                                  >
                                                    <Eye className="w-3 h-3 mr-1" />
                                                    View
                                                  </Button>
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                      {/* Station MPI Documents */}
                                      {stationMpiDocuments.map((doc, index) => (
                                        <div
                                          key={`mpi-${doc.id || index}`}
                                          className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg"
                                        >
                                          <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3 flex-1">
                                              <FileText className="w-4 h-4 text-indigo-600 mt-1 flex-shrink-0" />
                                              <div className="flex-1 min-w-0">
                                                <h6 className="font-medium text-sm text-gray-900 truncate">
                                                  {doc.originalName ||
                                                    doc.fileName ||
                                                    doc.description ||
                                                    "Unknown Document"}
                                                </h6>
                                                {doc.description &&
                                                  doc.description !== (doc.originalName || doc.fileName) && (
                                                    <p className="text-xs text-gray-600 mt-1">{doc.description}</p>
                                                  )}
                                                <div className="flex items-center gap-2 mt-1">
                                                  <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                                                    MPI Document
                                                  </span>
                                                  <span className="text-xs text-gray-500">
                                                    Uploaded:{" "}
                                                    {doc.createdAt
                                                      ? new Date(doc.createdAt).toLocaleDateString()
                                                      : "Unknown date"}
                                                  </span>
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-2 ml-4">
                                                {doc.fileUrl && (
                                                  <>
                                                    <Button
                                                      size="sm"
                                                      variant="outline"
                                                      onClick={async () => {
                                                        try {
                                                          const response = await fetch(
                                                            `http://35.166.254.199:5000/station-mpi-documents/${doc.id}/download`,
                                                          )
                                                          if (!response.ok) {
                                                            throw new Error("Download failed")
                                                          }
                                                          const contentDisposition =
                                                            response.headers.get("content-disposition")
                                                          let filename =
                                                            doc.originalName ||
                                                            doc.fileName ||
                                                            doc.description ||
                                                            "mpi-document"
                                                          if (contentDisposition) {
                                                            const filenameMatch =
                                                              contentDisposition.match(/filename="?([^"]+)"?/)
                                                            if (filenameMatch) {
                                                              filename = filenameMatch[1]
                                                            }
                                                          }
                                                          const blob = await response.blob()
                                                          const url = window.URL.createObjectURL(blob)
                                                          const a = document.createElement("a")
                                                          a.href = url
                                                          a.download = filename
                                                          document.body.appendChild(a)
                                                          a.click()
                                                          window.URL.revokeObjectURL(url)
                                                          document.body.removeChild(a)
                                                          toast({
                                                            title: "Success",
                                                            description: "Document downloaded successfully.",
                                                          })
                                                        } catch (error) {
                                                          console.error("Download failed:", error)
                                                          toast({
                                                            title: "Error",
                                                            description:
                                                              "Failed to download document. Please try again.",
                                                            variant: "destructive",
                                                          })
                                                        }
                                                      }}
                                                      className="h-7 px-2 text-xs"
                                                    >
                                                      <Download className="w-3 h-3 mr-1" />
                                                      Download
                                                    </Button>
                                                    <Button
                                                      size="sm"
                                                      variant="outline"
                                                      onClick={() => {
                                                        if (doc.fileUrl) {
                                                          const url = doc.fileUrl.startsWith("http")
                                                            ? doc.fileUrl
                                                            : `http://35.166.254.199:5000/${doc.fileUrl}`
                                                          window.open(url, "_blank")
                                                        }
                                                      }}
                                                      className="h-7 px-2 text-xs"
                                                    >
                                                      <Eye className="w-3 h-3 mr-1" />
                                                      View
                                                    </Button>
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                      <p className="text-sm text-gray-600">No documents available for this station.</p>
                                    </div>
                                  )}
                                </div>

                                {/* Station Notes - FIXED SECTION */}
                                {/* Station Notes - Always show heading */}
                                <div className="mb-6">
                                  <h5 className="font-medium text-base mb-3 text-orange-800">Station Notes</h5>
                                  <div className="p-3 space-y-2">
                                    {selectedStation.Note && selectedStation.Note.length > 0 ? (
                                      <ul className="space-y-1">
                                        {selectedStation.Note.map((note: string, index: number) => (
                                          <li key={index} className="text-sm text-orange-900 flex items-start gap-2">
                                            <span className="text-orange-600 font-bold">•</span>
                                            <span>{note}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-sm text-orange-700 italic">No notes found for this station.</p>
                                    )}
                                  </div>
                                </div>

                                {/* Show message if no content */}
                                {/* {specificationsWithValues.length === 0 &&
                                  regularStationDocuments.length === 0 &&
                                  stationMpiDocuments.length === 0 &&
                                  !selectedStation.description &&
                                  (!selectedStation.Note || selectedStation.Note.length === 0) && (
                                    <div className="text-center py-6">
                                      <p className="text-muted-foreground">
                                        No specifications, documents, or notes available for this station.
                                      </p>
                                    </div>
                                  )} */}
                              </div>
                            </>
                          )
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="text-center">
                  <Factory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600">No instructions have been provided yet.</p>
                </div>
              </div>
            )}

            {/* MPI Instructions Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-5 h-5 text-blue-900" />
                <h3 className="text-lg font-semibold text-blue-900">General Instructions</h3>
              </div>
              {mpi.Instruction && mpi.Instruction.length > 0 ? (
                <div className="border border-gray-300 rounded-lg p-4">
                  {mpi.Instruction.map((instruction, index) => (
                    <div key={index} className="flex items-start gap-2 mb-2">
                      <div className="text-sm font-semibold">{index + 1}.</div>
                      <p className="text-sm text-gray-800">{instruction}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">No MPI instructions have been added yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Checklist Section */}
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <ClipboardList className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-semibold text-orange-600">Checklist</h2>
            </div>
            {(() => {
              const checklistsWithRequiredItems =
                mpi.checklists
                  ?.filter((checklist) => checklist.checklistItems?.some((item) => item.required === true))
                  .map((checklist) => ({
                    ...checklist,
                    checklistItems: checklist.checklistItems?.filter((item) => item.required === true) || [],
                  })) || []

              if (checklistsWithRequiredItems.length === 0) {
                return (
                  <div className="text-center py-8">
                    <p className="">No required checklist items were configured for this MPI.</p>
                  </div>
                )
              }

              return (
                <Accordion type="multiple" className="w-full">
                  {checklistsWithRequiredItems.map((checklist, index) => (
                    <AccordionItem key={checklist.id} value={`checklist-${index}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">{checklist.name || "N/A"}</h3>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <Table className="w-full border-collapse">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="px-4 py-2">Description</TableHead>
                              <TableHead className="px-4 py-2">Required</TableHead>
                              <TableHead className="px-4 py-2">Remarks</TableHead>
                              <TableHead className="px-4 py-2">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(checklist.checklistItems || []).map((item) => (
                              <TableRow key={item.id} className="border-t">
                                <TableCell className="px-4 py-2 font-medium">{item.description || "N/A"}</TableCell>
                                <TableCell className="px-4 py-2">
                                  <span className="text-sm font-medium">{item.required ? "Yes" : "No"}</span>
                                </TableCell>
                                <TableCell className="px-4 py-2">
                                  <span className="text-sm">{item.remarks || "No remarks"}</span>
                                </TableCell>
                                <TableCell className="px-4 py-2">
                                  <div className="flex items-center gap-2">
                                    {item.isActive ? (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <XCircle className="w-4 h-4 text-gray-400" />
                                    )}
                                    <Badge
                                      variant={item.isActive ? "default" : "secondary"}
                                      className={item.isActive ? "bg-green-100 text-green-800" : ""}
                                    >
                                      {item.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )
            })()}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this MPI?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the MPI and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-green-600 hover:bg-green-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
