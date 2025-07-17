


"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Download, Eye, X, FileText, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { StationFlowchartsApi } from "./station-flowcharts-api"

interface FlowchartDocument {
  id?: string
  filename?: string
  description?: string
  fileUrl?: string
  fileType?: string
  uploadedAt?: string
  file?: File
  isNew?: boolean
  originalName?: string
}

interface StationFlowchartsProps {
  flowcharts: any[]
  onChange: (flowcharts: any[]) => void
  stationId?: string
  onSubmit: () => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  isEdit?: boolean
}

export default function StationFlowcharts({
  flowcharts,
  onChange: onFlowchartsChange,
  stationId,
  onSubmit,
  onCancel,
  isLoading,
  isEdit,
}: StationFlowchartsProps) {
  const [uploadingFlowchart, setUploadingFlowchart] = useState(false)
  const [newFlowchart, setNewFlowchart] = useState({
    file: null as File | null,
    description: "",
  })
  const { toast } = useToast()

  const handleFlowchartUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingFlowchart(true)

    try {
      // For edit mode with stationId, upload immediately
      if (isEdit && stationId) {
        const result = await StationFlowchartsApi.uploadFlowcharts([file], {
          stationId: stationId,
          description: newFlowchart.description || file.name,
        })

        if (result.error || !result.data) {
          throw new Error(result.error || "Upload failed")
        }

        const uploadedDoc = result.data[0]

        const flowchartDoc: FlowchartDocument = {
          id: uploadedDoc.id || Date.now().toString(),
          filename: uploadedDoc.originalName || file.name,
          description: uploadedDoc.description || newFlowchart.description || file.name,
          fileUrl: uploadedDoc.fileUrl,
          fileType: file.type,
          uploadedAt: new Date().toISOString(),
          originalName: uploadedDoc.originalName || file.name,
        }

        onFlowchartsChange([...flowcharts, flowchartDoc])
      } else {
        // For create mode, store the file temporarily with a blob URL
        const tempFlowchart: FlowchartDocument = {
          id: `temp-${Date.now()}`,
          filename: file.name,
          description: newFlowchart.description || file.name,
          fileUrl: URL.createObjectURL(file), // Create blob URL for preview
          fileType: file.type,
          uploadedAt: new Date().toISOString(),
          file: file, // Store the actual file for later upload
          isNew: true,
          originalName: file.name,
        }

        onFlowchartsChange([...flowcharts, tempFlowchart])
      }

      // Reset form
      setNewFlowchart({
        file: null,
        description: "",
      })

      // Reset file input
      e.target.value = ""

      toast({
        title: "Success",
        description: `Flowchart "${file.name}" ${isEdit ? "uploaded" : "added"} successfully.`,
      })
    } catch (error: any) {
      console.error("Error uploading flowchart:", error)
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload flowchart.",
        variant: "destructive",
      })
    } finally {
      setUploadingFlowchart(false)
    }
  }

  const handleRemoveFlowchart = async (flowchartId: string) => {
    try {
      // If it's a real document (not temporary) and we're in edit mode, delete from server
      if (isEdit && !flowchartId.startsWith("temp-")) {
        const result = await StationFlowchartsApi.deleteFlowchart(flowchartId)
        if (result.error) {
          throw new Error(result.error)
        }
      }

      // Remove from local state
      onFlowchartsChange(flowcharts.filter((doc) => doc.id !== flowchartId))

      toast({
        title: "Success",
        description: "Flowchart removed successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete flowchart.",
        variant: "destructive",
      })
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType && fileType.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4" />
    }
    return <FileText className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      <h4 className="text-xl font-semibold">Upload Flowcharts</h4>
      {/* Upload New Flowchart */}
      <Card>
        <CardContent className="space-y-4 mt-5">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="flowchart-file">Select File</Label>
              <Input
                id="flowchart-file"
                type="file"
                // accept="image/*,.pdf,.doc,.docx"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

                onChange={handleFlowchartUpload}
                disabled={uploadingFlowchart}
              />
            </div>

            <div>
              <Label htmlFor="flowchart-description">Description (Optional)</Label>
              <Textarea
                id="flowchart-description"
                placeholder="Enter description for the flowchart..."
                value={newFlowchart.description}
                onChange={(e) =>
                  setNewFlowchart((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                disabled={uploadingFlowchart}
              />
            </div>
          </div>

          {uploadingFlowchart && <div className="text-sm text-muted-foreground">Uploading flowchart...</div>}
        </CardContent>
      </Card>

      {/* Existing Flowcharts */}
      {flowcharts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Station Flowcharts ({flowcharts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {flowcharts.map((flowchart) => (
                <div
                  key={flowchart.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(flowchart.fileType || "")}
                    <div className="flex-1 min-w-0">
                      {/* Display filename and description separately */}
                      {(flowchart.filename || flowchart.originalName) && (
                        <p className="font-medium text-gray-900">
                          {/* <span className="text-sm text-gray-500">File: </span> */}
                          {flowchart.filename || flowchart.originalName}
                        </p>
                      )}
                      {flowchart.description && (
                        <p className="text-sm text-gray-700 mt-1">
                          {/* <span className="text-xs text-gray-500">Description: </span> */}
                          {flowchart.description}
                        </p>
                      )}
                    
                      {/* <p className="text-xs text-muted-foreground mt-1">
                        {flowchart.uploadedAt
                          ? `Uploaded ${new Date(flowchart.uploadedAt).toLocaleDateString()}`
                          : "Ready to upload"}
                      </p> */}
                     
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.open(flowchart.fileUrl, "_blank")}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          if (flowchart.id && !flowchart.id.startsWith("temp-") && isEdit) {
                            await StationFlowchartsApi.downloadAndSaveFile(flowchart.id, flowchart.filename)
                          } else {
                            const link = document.createElement("a")
                            link.href = flowchart.fileUrl || ""
                            link.download = flowchart.filename || "flowchart"
                            link.click()
                          }
                        } catch (error: any) {
                          toast({
                            title: "Download Failed",
                            description: error.message || "Failed to download file.",
                            variant: "destructive",
                          })
                        }
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveFlowchart(flowchart.id || "")}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {flowcharts.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No flowcharts uploaded yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Upload flowcharts to help visualize the station process
            </p>
          </CardContent>
        </Card>
      )}
   
    </div>
  )
}



