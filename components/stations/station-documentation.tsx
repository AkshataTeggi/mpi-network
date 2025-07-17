

"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Download, Eye, X, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { StationDocumentationApi } from "./station-docs-api"

interface DocumentationDocument {
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

interface StationDocumentationProps {
  documentations: any[]
  onChange: (documentations: any[]) => void
  stationId?: string
  onSubmit: () => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  isEdit?: boolean
}

export function StationDocumentation({
  documentations,
  onChange: onDocumentationsChange,
  stationId,
  onSubmit,
  onCancel,
  isLoading,
  isEdit,
}: StationDocumentationProps) {
  const [uploadingDocumentation, setUploadingDocumentation] = useState(false)
  const [newDocumentation, setNewDocumentation] = useState({
    file: null as File | null,
    description: "",
  })
  const { toast } = useToast()

  const handleDocumentationUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingDocumentation(true)

    try {
      // For edit mode with stationId, upload immediately
      if (isEdit && stationId) {
        const result = await StationDocumentationApi.uploadDocumentation([file], {
          stationId: stationId,
          description: newDocumentation.description || file.name,
        })

        if (result.error || !result.data) {
          throw new Error(result.error || "Upload failed")
        }

        const uploadedDoc = result.data[0]

        const documentationDoc: DocumentationDocument = {
          id: uploadedDoc.id || Date.now().toString(),
          filename: uploadedDoc.originalName || file.name,
          description: uploadedDoc.description || newDocumentation.description || file.name,
          fileUrl: uploadedDoc.fileUrl,
          fileType: file.type,
          uploadedAt: new Date().toISOString(),
          originalName: uploadedDoc.originalName || file.name,
        }

        onDocumentationsChange([...documentations, documentationDoc])
      } else {
        // For create mode, store the file temporarily with a blob URL
        const tempDocumentation: DocumentationDocument = {
          id: `temp-${Date.now()}`,
          filename: file.name,
          description: newDocumentation.description || file.name,
          fileUrl: URL.createObjectURL(file), // Create blob URL for preview
          fileType: file.type,
          uploadedAt: new Date().toISOString(),
          file: file, // Store the actual file for later upload
          isNew: true,
          originalName: file.name,
        }

        onDocumentationsChange([...documentations, tempDocumentation])
      }

      // Reset form
      setNewDocumentation({
        file: null,
        description: "",
      })

      // Reset file input
      e.target.value = ""

      toast({
        title: "Success",
        description: `Documentation "${file.name}" ${isEdit ? "uploaded" : "added"} successfully.`,
      })
    } catch (error: any) {
      console.error("Error uploading documentation:", error)
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload documentation.",
        variant: "destructive",
      })
    } finally {
      setUploadingDocumentation(false)
    }
  }

  const handleRemoveDocumentation = async (documentationId: string) => {
    try {
      // If it's a real document (not temporary) and we're in edit mode, delete from server
      if (isEdit && !documentationId.startsWith("temp-")) {
        const result = await StationDocumentationApi.deleteDocumentation(documentationId)
        if (result.error) {
          throw new Error(result.error)
        }
      }

      // Remove from local state
      onDocumentationsChange(documentations.filter((doc) => doc.id !== documentationId))

      toast({
        title: "Success",
        description: "Documentation removed successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete documentation.",
        variant: "destructive",
      })
    }
  }

  const getFileIcon = (fileType: string) => {
    return <FileText className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      <h4 className="text-xl font-semibold">Upload Documentation</h4>

      {/* Upload New Documentation */}
      <Card>
        <CardContent className="space-y-4 mt-5">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="documentation-file">Select File</Label>
              <Input
                id="documentation-file"
                type="file"
                // accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

                onChange={handleDocumentationUpload}
                disabled={uploadingDocumentation}
              />
            </div>

            <div>
              <Label htmlFor="documentation-description">Description (Optional)</Label>
              <Textarea
                id="documentation-description"
                placeholder="Enter description for the documentation..."
                value={newDocumentation.description}
                onChange={(e) =>
                  setNewDocumentation((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                disabled={uploadingDocumentation}
              />
            </div>
          </div>

          {uploadingDocumentation && <div className="text-sm text-muted-foreground">Uploading documentation...</div>}
        </CardContent>
      </Card>

      {/* Existing Documentation */}
      {documentations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Station Documentation ({documentations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documentations.map((documentation) => (
                <div
                  key={documentation.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(documentation.fileType || "")}
                    <div className="flex-1 min-w-0">
                      {/* Display filename and description separately */}
                      {(documentation.filename || documentation.originalName) && (
                        <p className="font-medium text-gray-900">
                          {documentation.filename || documentation.originalName}
                        </p>
                      )}
                      {documentation.description && (
                        <p className="text-sm text-gray-700 mt-1">{documentation.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.open(documentation.fileUrl, "_blank")}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          if (documentation.id && !documentation.id.startsWith("temp-") && isEdit) {
                            await StationDocumentationApi.downloadAndSaveFile(documentation.id, documentation.filename)
                          } else {
                            const link = document.createElement("a")
                            link.href = documentation.fileUrl || ""
                            link.download = documentation.filename || "documentation"
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
                      onClick={() => handleRemoveDocumentation(documentation.id || "")}
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

      {documentations.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No documentation uploaded yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Upload documentation files to help with station information
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}




