


"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { MapPin, Users, Calendar, Edit, ArrowLeft, FileText, ImageIcon, Trash2, Download, Eye } from "lucide-react"
import type { Station } from "./types"
import { useToast } from "@/hooks/use-toast"
import { StationDocumentationApi } from "./station-docs-api"
import { StationFlowchartsApi } from "./station-flowcharts-api"
import { useState } from "react"
import { HasPermission } from "../HasPermission"

interface StationDetailsProps {
  station: Station
  onEdit: () => void
  onBack: () => void
  onDelete: () => void
}

export function StationDetails({ station, onEdit, onBack, onDelete }: StationDetailsProps) {
  const { toast } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const getStatusColor = (status: Station["status"]) => {
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

  const getInputTypeColor = (inputType: string) => {
    const colors: Record<string, string> = {
      TEXT: "bg-blue-100 text-blue-800 border-blue-200",
      number: "bg-green-100 text-green-800 border-green-200",
      CHECKBOX: "bg-pink-100 text-pink-800 border-pink-200",
      DROPDOWN: "bg-orange-100 text-orange-800 border-orange-200",
      FILE_UPLOAD: "bg-purple-100 text-purple-800 border-purple-200",
    }
    return colors[inputType] || "bg-gray-100 text-gray-800 border-gray-200"
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

  const formatInputType = (inputType: string) => {
    return inputType
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const getSuggestions = (spec: any) => {
    // Handle different formats of suggestions
    if (!spec.suggestions) return []
    // If it's already an array, return it
    if (Array.isArray(spec.suggestions)) {
      return spec.suggestions
    }
    // If it's a string, try to parse it as JSON
    if (typeof spec.suggestions === "string") {
      try {
        const parsed = JSON.parse(spec.suggestions)
        return Array.isArray(parsed) ? parsed : []
      } catch (error) {
        console.error("Failed to parse suggestions:", error)
        return []
      }
    }
    return []
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = () => {
    setShowDeleteDialog(false)
    onDelete()
  }

  const handleViewFile = (fileUrl: string) => {
    if (fileUrl) {
      // Use direct URL for viewing since backend serves files statically
      window.open(fileUrl, "_blank")
    } else {
      toast({
        title: "Error",
        description: "File URL not available",
        variant: "destructive",
      })
    }
  }

  const handleDownloadDocumentation = async (docId: string, filename?: string) => {
    try {
      const result = await StationDocumentationApi.downloadAndSaveFile(docId, filename)
      if (result.error) {
        throw new Error(result.error)
      }
      toast({
        title: "Success",
        description: "File download started",
      })
    } catch (error: any) {
      toast({
        title: "Download Failed",
        description: error.message || "Failed to download file",
        variant: "destructive",
      })
    }
  }

  const handleDownloadFlowchart = async (flowchartId: string, filename?: string) => {
    try {
      const result = await StationFlowchartsApi.downloadAndSaveFile(flowchartId, filename)
      if (result.error) {
        throw new Error(result.error)
      }
      toast({
        title: "Success",
        description: "File download started",
      })
    } catch (error: any) {
      toast({
        title: "Download Failed",
        description: error.message || "Failed to download file",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-green-600">Station Details</h1>
          </div>
        </div>
        {/* <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={onEdit} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={handleDeleteClick}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 bg-transparent"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div> */}


        <div className="flex items-center gap-2">
  <Button variant="outline" onClick={onBack}>
    <ArrowLeft className="w-4 h-4 mr-2" />
    Back
  </Button>

  <HasPermission permission="UPDATE_STATION">
    <Button
      onClick={onEdit}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
    >
      <Edit className="w-4 h-4" />
      Edit
    </Button>
  </HasPermission>

  <HasPermission permission="DELETE_STATION">
    <Button
      variant="outline"
      onClick={handleDeleteClick}
      className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 bg-transparent"
    >
      <Trash2 className="w-4 h-4" />
      Delete
    </Button>
  </HasPermission>
</div>
      </div>


   

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-green-600">
              <Trash2 className="w-5 h-5" />
              Delete Station
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="text-gray-600">
                <p>
                  Are you sure you want to delete station <strong>"{station.stationName}"</strong>? This action cannot
                  be undone and will permanently remove all associated data including:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Station specifications ({station.specifications?.length || 0} items)</li>
                  <li>Notes ({station.Note?.length || 0} items)</li>
                  <li>Documentation files ({station.documentations?.length || 0} items)</li>
                  <li>Flowcharts ({station.flowcharts?.length || 0} items)</li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-green-600 hover:bg-green-700 text-white">
              Delete Station
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Tabbed Content */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="specifications">Specifications ({station.specifications?.length || 0})</TabsTrigger>
          <TabsTrigger value="notes">Notes ({station.Note?.length || 0})</TabsTrigger>
          <TabsTrigger value="documentation">Files ({station.documentations?.length || 0})</TabsTrigger>
          <TabsTrigger value="flowcharts">Flowcharts ({station.flowcharts?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6">
          <Card>
            <CardContent className="space-y-6 mt-10">
              {/* Basic Information - 2 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 tracking-wide">Station ID</h3>
                    <span className="text-base font-medium text-gray-900">{station.stationId}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 tracking-wide">Station Name</h3>
                    <span className="text-base font-medium text-gray-900">{station.stationName}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 tracking-wide">Status</h3>
                    <div className="mt-1">
                      <Badge className={getStatusColor(station.status)}>{station.status}</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 tracking-wide">Location</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <span className="text-base font-medium text-gray-900">{station.location}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 tracking-wide">Operator</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="w-5 h-5 text-muted-foreground" />
                      <span className="text-base font-medium text-gray-900">{station.operator || "Not assigned"}</span>
                    </div>
                  </div>

                  {station.priority && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 tracking-wide">Priority</h3>
                      <span className="text-base font-medium text-gray-900">{station.priority}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description - Single Row */}
              {station.description && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 tracking-wide mb-2">Description</h3>
                    <p className="text-sm leading-relaxed bg-gray-50 p-3 rounded-lg border text-gray-800">
                      {station.description}
                    </p>
                  </div>
                </>
              )}

              {/* Timestamps - 2 Columns */}
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 tracking-wide">Created</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-900 font-medium">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {formatDate(station.createdAt)}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 tracking-wide">Last Updated</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-900 font-medium">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {formatDate(station.updatedAt)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardContent className="mt-5">
              {!station.specifications || station.specifications.length === 0 ? (
                <p className="text-muted-foreground">No specifications assigned to this station.</p>
              ) : (
                <div className="rounded-md border">
                  <table className="w-full table-fixed">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-12 px-4 w-1/4 text-left align-middle font-medium text-muted-foreground">
                          Specification Name
                        </th>
                        <th className="h-12 px-4 w-1/4 text-left align-middle font-medium text-muted-foreground">
                          Input Type
                        </th>
                        <th className="h-12 px-4 w-1/4 text-left align-middle font-medium text-muted-foreground">
                          Required
                        </th>
                        <th className="h-12 px-4 w-1/4 text-left align-middle font-medium text-muted-foreground">
                          Options/Suggestions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {station.specifications.map((spec, index) => {
                        const suggestions = getSuggestions(spec)
                        return (
                          <tr key={spec.id} className={index !== station.specifications!.length - 1 ? "border-b" : ""}>
                            <td className="p-4 w-1/4 align-middle">
                              <div className="font-medium">
                                {/* Clean the name by removing timestamp and ID suffixes */}
                                {spec.name.replace(/_\d+_\d+_[a-z0-9]+$/i, "").trim()}
                              </div>
                            </td>
                            <td className="p-4 w-1/4 align-middle text-sm text-gray-800 font-medium">
                              {formatInputType(spec.inputType)}
                            </td>
                            <td className="p-4 w-1/4 align-middle">{spec.required ? "Yes" : "No"}</td>
                            <td className="p-4 w-1/4 align-middle">
                              {spec.inputType === "DROPDOWN" && suggestions.length > 0 ? (
                                <span>
                                  {suggestions.slice(0, 3).join(", ")}
                                  {suggestions.length > 3 && `, +${suggestions.length - 3} more`}
                                </span>
                              ) : spec.inputType === "CHECKBOX" ? (
                                <span>{spec.required ? "Required" : "Optional"}</span>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card>
            <CardContent className="mt-5">
              {!station.Note || station.Note.length === 0 ? (
                <p className="text-muted-foreground">No notes available for this station.</p>
              ) : (
                <div className="space-y-4">
                  {station.Note.map((note, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed text-gray-800">{note}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="mt-6">
          <Card>
            <CardContent className="mt-5">
              {!station.documentations || station.documentations.length === 0 ? (
                <p className="text-muted-foreground">No files available.</p>
              ) : (
                <div className="space-y-4">
                  {station.documentations.map((doc) => (
                    <Card key={doc.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            {/* Display filename and description separately */}
                            {(doc.originalName || doc.fileName) && (
                              <h4 className="font-medium text-gray-900">{doc.originalName || doc.fileName}</h4>
                            )}
                            {doc.description && <p className="text-sm text-gray-700 mt-1">{doc.description}</p>}

                            <p className="text-xs text-muted-foreground mt-2">Added: {formatDate(doc.createdAt)}</p>
                          </div>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewFile(doc.fileUrl)}
                            className="text-xs"
                            disabled={!doc.fileUrl}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadDocumentation(doc.id, doc.originalName || doc.fileName)}
                            className="text-xs"
                            disabled={!doc.id}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flowcharts" className="mt-6">
          <Card>
            <CardContent className="mt-5">
              {!station.flowcharts || station.flowcharts.length === 0 ? (
                <p className="text-muted-foreground">No flowcharts available.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {station.flowcharts.map((flowchart) => (
                    <Card key={flowchart.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <ImageIcon className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            {/* Display filename and description separately */}
                            {(flowchart.originalName || flowchart.fileName) && (
                              <h4 className="font-medium text-gray-900">
                                {flowchart.originalName || flowchart.fileName}
                              </h4>
                            )}
                            {flowchart.description && (
                              <p className="text-sm text-gray-700 mt-1">{flowchart.description}</p>
                            )}

                            <p className="text-xs text-muted-foreground mt-2">
                              Added: {formatDate(flowchart.createdAt)}
                            </p>
                          </div>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewFile(flowchart.fileUrl)}
                            className="text-xs"
                            disabled={!flowchart.fileUrl}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDownloadFlowchart(flowchart.id, flowchart.originalName || flowchart.fileName)
                            }
                            className="text-xs"
                            disabled={!flowchart.id}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}






